/** @typedef {'login' | 'logout' | 'refresh' | 'validate'} ActionType */

export class AuthClient {
  /** @type {Set<(action: ActionType, state: any | undefined) => any>} */
  #listeners

  /** @type {Array<[ActionType, any | undefined]>} */
  #buffer

  /** @type {boolean} */
  #status

  /** @type {any} */
  #details

  constructor() {
    this.#listeners = new Set()
    this.#buffer = []

    // await window.cookieStore.get('auth_refresh_expires')
    const cookies = parseCookie(document.cookie)
    const authAction = window.sessionStorage.getItem('auth_action')
    const previousState = window.sessionStorage.getItem('auth_state')
    const hasRefreshToken = cookies['auth_refresh_valid'] || false

    this.#status = hasRefreshToken

    if (cookies['auth_payload']) {
      this.#details = cookies['auth_payload']
    }

    if (authAction && previousState) {
      // @ts-expect-error
      this.#buffer.push([authAction, JSON.parse(previousState)])
    } else if (authAction && !previousState) {
      // @ts-expect-error
      this.#buffer.push([authAction, undefined])
    } else if (hasRefreshToken) {
      this.refreshAuth()
    }

    window.sessionStorage.removeItem('auth_action')
    window.sessionStorage.removeItem('auth_state')
  }

  getStatus() {
    return this.#status
  }

  getDetails() {
    return this.#details
  }

  /** @returns {() => any} */
  onAuthAction(
    /** @type {(action: ActionType, state: any | undefined) => any} */ callback
  ) {
    this.#listeners.add(callback)
    while (this.#buffer.length) {
      callback(...this.#buffer.shift())
    }
    return () => this.#listeners.delete(callback)
  }

  navigateToLogin(
    /** @type {any | undefined} */ state
  ) {
    const target = new URL(window.location.origin)
    target.pathname = '/api/auth/login'

    window.sessionStorage.setItem('auth_action', 'login')
    if (state) {
      window.sessionStorage.setItem('auth_state', JSON.stringify(state))
    }

    window.location.assign(target)
  }

  navigateToLogout(
    /** @type {Record<string, any> | undefined} */ state
  ) {
    const target = new URL(window.location.origin)
    target.pathname = '/api/auth/logout'

    window.sessionStorage.setItem('auth_action', 'logout')
    if (state) {
      // target.searchParams.set('state', encodeURIComponent(btoa(JSON.stringify({ return_url: window.location.href }))))
      window.sessionStorage.setItem('auth_state', JSON.stringify(state))
    }

    window.location.assign(target)
  }

  async refreshAuth() {
    const target = new URL(window.location.origin)
    target.pathname = '/api/auth/refresh'
    const response = await fetch(target)
    if (!response.ok) {
      throw new Error('Invalid auth')
    }
    this.#details = await response.json()
    this.#notifyListeners('refresh', undefined)
  }

  async validate() {
    const target = new URL(window.location.origin)
    target.pathname = '/api/auth/validate'
    const response = await fetch(target)
    if (!response.ok) {
      throw new Error('Invalid auth')
    }
    this.#details = await response.json()
    this.#notifyListeners('validate', undefined)
    return this.#details
  }

  #notifyListeners(
    /** @type {ActionType} */ action,
    /** @type {any} */ state,
  ) {
    this.#listeners.forEach(listener => listener(action, state))
  }
}

/** @returns {Record<string, any>} */
export const parseCookie = (str = '') =>
  str.split(';')
  .reduce((res, c) => {
    const [key, val] = c.trim().split('=').map(decodeURIComponent)
    try {
      return Object.assign(res, { [key]: JSON.parse(val) })
    } catch (e) {
      return Object.assign(res, { [key]: val })
    }
  }, {});
