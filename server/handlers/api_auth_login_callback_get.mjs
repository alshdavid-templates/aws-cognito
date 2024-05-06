import * as http from 'node:http'
import { parse_req_url } from '../platform/req.mjs'
import { exchange } from '../platform/cognito.mjs'
import { Duration } from '../platform/duration.mjs'

export async function api_auth_login_callback_get(
  /** @type {URL} */ url,
  /** @type {import('../platform/http.js').Request} */ req,
  /** @type {import('../platform/http.js').Response} */ res,
) {
  const code = url.searchParams.get('code')
  const resp = await exchange(code)

  let location = '/'
  
  const state = url.searchParams.get('state')
  if (state) {
    location += `?state=${state}`
  }
  
  const [,payload_enc,] = resp.id_token.split('.')
  const payload = JSON.parse(atob(payload_enc))

  const auth_payload = JSON.stringify({ 
    email: payload.email,
    auth_time: payload.auth_time,
    email_verified: payload.email_verified,
    exp: payload.exp,
  })

  res.setHeader('Set-Cookie', [
    `auth_refresh_token=${resp.refresh_token}; SameSite=Strict; Path=/api/auth/refresh; HttpOnly; Expires=${new Date(payload.auth_time * 1000 + Duration.day * 30).toUTCString()}`,
    `auth_refresh_valid=true; SameSite=Strict; Path=/; Expires=${new Date(payload.auth_time * 1000 + Duration.day * 30).toUTCString()}`,
    `auth_payload=${encodeURIComponent(auth_payload)}; SameSite=Strict; Path=/; Expires=${new Date(payload.auth_time * 1000 + Duration.day * 30).toUTCString()}`,
    `auth_id_token=${resp.id_token}; SameSite=Strict; Path=/api; HttpOnly; Expires=${new Date(payload.exp * 1000).toUTCString()}`,
  ])

  res.setHeader('Location', location)
  res.statusCode = 307
  res.end()
}
