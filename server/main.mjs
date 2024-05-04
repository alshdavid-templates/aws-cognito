import * as http from 'node:http'
import * as handlers from './handlers/index.mjs'

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.statusCode = 200
    res.end()
    return
  }

  const req_url = new URL('http://0.0.0.0' + req.url)
  console.log(req_url.href)

  if (req_url.pathname === '/login') {
    await handlers.login_get(req, res)
    return
  }

  if (req_url.pathname === '/auth/callback') {
    await handlers.auth_callback_get(req, res)
    return
  }

  if (req_url.pathname === '/logout') {
    await handlers.logout_get(req, res)
    return
  }

  if (req_url.pathname === '/auth/logout') {
    await handlers.auth_logout_get(req, res)
    return
  }

  if (req_url.pathname === '/auth/refresh') {
    await handlers.auth_refresh_get(req, res)
    return
  }

  await handlers.client_get(req, res)
})

server.listen(3000, '0.0.0.0', () => {
  console.log('listening on http://localhost:3000')
})
