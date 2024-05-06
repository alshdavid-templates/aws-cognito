import * as http from 'node:http'
import { COGNITO_CLIENT_ID, COGNITO_ORIGIN, LOCAL_ORIGIN, LOGOUT_ENDPOINT } from '../platform/config.mjs'

export async function api_auth_logout_get(
  /** @type {URL} */ url,
  /** @type {import('../platform/http.js').Request} */ req,
  /** @type {import('../platform/http.js').Response} */ res,
) {
  const target = new URL(COGNITO_ORIGIN)
  target.pathname = LOGOUT_ENDPOINT
  target.searchParams.set('client_id', COGNITO_CLIENT_ID)
  target.searchParams.set('logout_uri', `${LOCAL_ORIGIN}/api/auth/logout/callback`)

  const state = url.searchParams.get('state')
  if (state) url.searchParams.set('state', state)

  res.setHeader('Set-Cookie', [
    `auth_refresh_token=null; SameSite=Strict; Path=/api/auth; HttpOnly; Expires=${new Date(0).toUTCString()}`,
    `auth_refresh_valid=null; SameSite=Strict; Path=/; Expires=${new Date(0).toUTCString()}`,
    `auth_id_token=null; SameSite=Strict; Path=/api; HttpOnly; Expires=${new Date(0).toUTCString()}`,
  ])

  res.setHeader('Location', target.toString())
  res.statusCode = 307
  res.end()
}
