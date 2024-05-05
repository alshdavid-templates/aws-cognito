import * as http from 'node:http'
import { COGNITO_CLIENT_ID, COGNITO_ORIGIN, LOGOUT_ENDPOINT } from '../platform/config.mjs'
import { parse_req_url } from '../platform/req.mjs'

export async function api_auth_logout_get(
  /** @type {URL} */ url,
  /** @type {http.IncomingMessage} */ req,
  /** @type {http.ServerResponse} */ res,
) {
  const target = new URL(COGNITO_ORIGIN)
  target.pathname = LOGOUT_ENDPOINT
  target.searchParams.set('client_id', COGNITO_CLIENT_ID)
  target.searchParams.set('logout_uri', 'http://localhost:3000/api/auth/logout/callback')

  const state = url.searchParams.get('state')
  if (state) url.searchParams.set('state', state)

  res.setHeader('Set-Cookie', [
    `auth_refresh_token=null; SameSite=Strict; Path=/auth; HttpOnly; Expires=${new Date(0).toUTCString()}`,
    `auth_access_token=null; SameSite=Strict; Path=/; Expires=${new Date(0).toUTCString()}`,
    `auth_user_email=null; SameSite=Strict; Path=/; Expires=${new Date(0).toUTCString()}`,
  ])

  res.setHeader('Location', target.toString())
  res.statusCode = 307
  res.end()
}
