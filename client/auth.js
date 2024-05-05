function login() {
  const target = new URL(window.location.origin)
  target.pathname = '/api/auth/login'
  // target.searchParams.set('') = JSON.stringify({ return_url: window.location.href })
  window.location.assign(target)
}

async function logout() {
  const target = new URL(window.location.origin)
  target.pathname = '/api/auth/logout'
  // target.state = JSON.stringify({ return_url: window.location.href })
  window.location.assign(target)
}

async function refresh() {
  const target = new URL(window.location.origin)
  target.pathname = '/api/auth/refresh'
  await fetch(target)
}
