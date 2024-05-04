import * as http from 'node:http'
import * as path from 'node:path'
import * as fsSync from 'node:fs'
import * as fs from 'node:fs/promises'
import * as url from 'node:url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const CLIENT_ID = process.env.COGNITO_CLIENT_ID
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET
const HOSTED_UI = process.env.COGNITO_CLIENT_ORIGIN

const LOGIN_ENDPOINT = '/oauth2/authorize'
const LOGOUT_ENDPOINT = '/logout'
const TOKEN_ENDPOINT = '/oauth2/token'

const Duration = {
  millisecond: 1,
  second: 1 * 1000,
  minute: 1 * 1000 * 60,
  hour: 1 * 1000 * 60 * 60,
  day: 1 * 1000 * 60 * 60 * 24,
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.statusCode = 200
    res.end()
    return
  }

  const req_url = new URL('http://0.0.0.0' + req.url)
  console.log(req_url.href)

  if (req_url.pathname === '/login') {
    const target = new URL(HOSTED_UI)
    target.pathname = LOGIN_ENDPOINT
    target.searchParams.set('response_type', 'code')
    target.searchParams.set('client_id', CLIENT_ID)
    target.searchParams.set('redirect_uri', 'http://localhost:3000/auth/callback')

    const state = req_url.searchParams.get('state')
    if (state) target.searchParams.set('state', state)

    res.setHeader('Location', target.toString())
    res.statusCode = 307
    res.end()
    return
  }

  if (req_url.pathname === '/auth/callback') {
    const code = req_url.searchParams.get('code')
    const resp = await exchange(code)

    const state = req_url.searchParams.get('state')
    resp.state = null
    if (state) resp.state = JSON.parse(state)
    
    const [,payload_enc,] = resp.id_token.split('.')
    const payload = JSON.parse(atob(payload_enc))

    res.setHeader('Set-Cookie', [
      `auth_refresh_token=${resp.refresh_token}; SameSite=Strict; Path=/auth; HttpOnly; Expires=${new Date(payload.auth_time * 1000 + Duration.day * 30).toUTCString()}`,
      `auth_access_token=${resp.access_token}; SameSite=Strict; Path=/; Expires=${new Date(payload.exp * 1000).toUTCString()}`,
      `auth_user_email=${payload.email}; SameSite=Strict; Path=/; Expires=${new Date(payload.exp * 1000).toUTCString()}`,
    ])

    res.setHeader('Location', '/')
    res.statusCode = 307
    res.end()
    return
  }

  if (req_url.pathname === '/logout') {
    const target = new URL(HOSTED_UI)
    target.pathname = LOGOUT_ENDPOINT
    target.searchParams.set('client_id', CLIENT_ID)
    target.searchParams.set('logout_uri', 'http://localhost:3000/auth/logout')

    const state = req_url.searchParams.get('state')
    if (state) target.searchParams.set('state', state)

    res.setHeader('Set-Cookie', [
      `auth_refresh_token=null; SameSite=Strict; Path=/auth; HttpOnly; Expires=${new Date(0).toUTCString()}`,
      `auth_access_token=null; SameSite=Strict; Path=/; Expires=${new Date(0).toUTCString()}`,
      `auth_user_email=null; SameSite=Strict; Path=/; Expires=${new Date(0).toUTCString()}`,
    ])

    res.setHeader('Location', target.toString())
    res.statusCode = 307
    res.end()
    return
  }

  if (req_url.pathname === '/auth/logout') {
    let return_url = '/'

    const state = req_url.searchParams.get('state')
    if (state) return_url = `/?state=${state}`

    res.setHeader('Set-Cookie', [
      `auth_refresh_token=null; SameSite=Strict; Path=/auth; HttpOnly; Expires=${new Date(0).toUTCString()}`,
      `auth_access_token=null; SameSite=Strict; Path=/; Expires=${new Date(0).toUTCString()}`,
      `auth_user_email=null; SameSite=Strict; Path=/; Expires=${new Date(0).toUTCString()}`,
    ])

    res.setHeader('Location', '/')
    res.statusCode = 307
    res.end()
    return
  }

  if (req_url.pathname === '/auth/refresh') {
    const cookie = parseCookie(req.headers.cookie)
    if (!cookie.auth_refresh_token) {
      res.statusCode = 404
      res.end()
      return
    }

    const result = await refresh(cookie.auth_refresh_token)
    const [,payload_enc,] = result.id_token.split('.')
    const payload = JSON.parse(atob(payload_enc))

    console.log(result)

    res.setHeader('Set-Cookie', [
      `auth_access_token=${result.access_token}; SameSite=Strict; Path=/; Expires=${new Date(payload.exp * 1000).toUTCString()}`,
    ])

    res.statusCode = 200
    res.end()
    return
  }

  const client_file = path.join(__dirname, 'client', req_url.pathname === '/' ? 'index.html' : req_url.pathname)
  if (fsSync.existsSync(client_file)) {
    if (path.extname(client_file) === 'js') {
      res.setHeader('Content-Type', 'application/javascript')
    }
    if (path.extname(client_file) === 'css') {
      res.setHeader('Content-Type', 'text/css')
    }
    if (path.extname(client_file) === 'html') {
      res.setHeader('Content-Type', 'text/html')
    }
    res.write(await fs.readFile(client_file))
  }

  res.statusCode = 200
  res.end()
})

server.listen(3000, '0.0.0.0', () => {
  console.log('listening on http://localhost:3000')
})

async function exchange(code) {
  const target = new URL(HOSTED_UI)
  target.pathname = TOKEN_ENDPOINT

  const body = new URLSearchParams()
  body.set('client_id', CLIENT_ID)
  body.set('client_secret', CLIENT_SECRET)
  body.set('grant_type', 'authorization_code')
  body.set('code', code)
  body.set('redirect_uri', 'http://localhost:3000/auth/callback')
  target.searchParams.set('scope', 'email/openid')

  const response = await fetch(target.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString()
  })

  return response.json()
}

async function refresh(refresh_token) {
  const target = new URL(HOSTED_UI)
  target.pathname = TOKEN_ENDPOINT

  const body = new URLSearchParams()
  body.set('client_id', CLIENT_ID)
  body.set('client_secret', CLIENT_SECRET)
  body.set('grant_type', 'refresh_token')
  body.set('refresh_token', refresh_token)

  const response = await fetch(target.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString()
  })

  return response.json()
}

const parseCookie = (str = '') =>
  str.split(';')
  .reduce((res, c) => {
    const [key, val] = c.trim().split('=').map(decodeURIComponent)
    try {
      return Object.assign(res, { [key]: JSON.parse(val) })
    } catch (e) {
      return Object.assign(res, { [key]: val })
    }
  }, {});
