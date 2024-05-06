import * as http from 'node:http'
import { parseCookie } from '../platform/cookies.mjs'
import { refresh } from '../platform/cognito.mjs'

export async function api_auth_refresh_get(
  /** @type {URL} */ url,
  /** @type {import('../platform/http.js').Request} */ req,
  /** @type {import('../platform/http.js').Response} */ res,
) {
  const cookie = parseCookie(req.headers.cookie)
  if (!cookie.auth_refresh_token) {
    res.statusCode = 400
    res.end()
    return
  }

  const result = await refresh(cookie.auth_refresh_token)
  const [,payload_enc,] = result.id_token.split('.')
  const payload = JSON.parse(atob(payload_enc))

  res.setHeader('Set-Cookie', [
    `auth_id_token=${result.id_token}; SameSite=Strict; Path=/api; HttpOnly; Expires=${new Date(payload.exp * 1000).toUTCString()}`,
  ])

  res.statusCode = 200
  res.end()
}
