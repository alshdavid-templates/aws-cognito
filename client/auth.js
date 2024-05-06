export class AuthClient {
  /** @type {Set<(action: 'login' | 'logout' | 'refresh', state: any | undefined) => any>} */
  #listeners

  /** @type {Array<['login' | 'logout' | 'refresh', any | undefined]>} */
  #buffer

  constructor() {
    this.#listeners = new Set()
    this.#buffer = []

    // await window.cookieStore.get('auth_refresh_expires')
    const authAction = window.sessionStorage.getItem('auth_action')
    const previousState = window.sessionStorage.getItem('auth_state')

    if (authAction && previousState) {
      // @ts-expect-error
      this.#buffer.push([authAction, JSON.parse(previousState)])
    } else if (authAction && !previousState) {
      // @ts-expect-error
      this.#buffer.push([authAction, undefined])
    } else if (window.document.cookie.includes('auth_refresh_valid=true')) {
      this.refreshAuth()
    }

    window.sessionStorage.removeItem('auth_action')
    window.sessionStorage.removeItem('auth_state')
  }

  /** @returns {() => any} */
  onAuthAction(
    /** @type {(action: 'login' | 'logout' | 'refresh', state: any | undefined) => any} */ callback
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
    await fetch(target)
    this.#notifyListeners('refresh', undefined)
  }

  async validate() {
    const target = new URL(window.location.origin)
    target.pathname = '/api/auth/validate'
    const response = await fetch(target)
    if (!response.ok) {
      throw new Error('Invalid auth')
    }
    return await response.json()
  }

  #notifyListeners(
    /** @type {'login' | 'logout' | 'refresh'} */ action,
    /** @type {any} */ state,
  ) {
    this.#listeners.forEach(listener => listener(action, state))
  }
}
