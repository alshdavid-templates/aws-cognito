class AuthClient {
  constructor() {}

  navigateToLogin(
    /** @type {Record<string, any> | undefined} */ state
  ) {
    const target = new URL(window.location.origin)
    target.pathname = '/api/auth/login'
    if (state) {
      target.searchParams.set('state', encodeURIComponent(btoa(JSON.stringify({ return_url: window.location.href }))))
    }
    window.location.assign(target)
  }

  navigateToLogout(
    /** @type {Record<string, any> | undefined} */ state
  ) {
    const target = new URL(window.location.origin)
    target.pathname = '/api/auth/logout'
    if (state) {
      target.searchParams.set('state', encodeURIComponent(btoa(JSON.stringify({ return_url: window.location.href }))))
    }
    window.location.assign(target)
  }

  async refreshAuth() {
    const target = new URL(window.location.origin)
    target.pathname = '/api/auth/refresh'
    await fetch(target)
  }
}
