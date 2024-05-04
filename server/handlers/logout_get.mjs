import * as http from 'node:http'
import { CLIENT_ID, HOSTED_UI, LOGOUT_ENDPOINT } from '../platform/config.mjs'
import { parse_req_url } from '../platform/req.mjs'

export async function logout_get(
  /** @type {http.IncomingMessage} */ req,
  /** @type {http.ServerResponse} */ res,
) {
  const { searchParams } = parse_req_url(req)

  const target = new URL(HOSTED_UI)
  target.pathname = LOGOUT_ENDPOINT
  target.searchParams.set('client_id', CLIENT_ID)
  target.searchParams.set('logout_uri', 'http://localhost:3000/auth/logout')

  const state = searchParams.get('state')
  if (state) searchParams.set('state', state)

  res.setHeader('Set-Cookie', [
    `auth_refresh_token=null; SameSite=Strict; Path=/auth; HttpOnly; Expires=${new Date(0).toUTCString()}`,
    `auth_access_token=null; SameSite=Strict; Path=/; Expires=${new Date(0).toUTCString()}`,
    `auth_user_email=null; SameSite=Strict; Path=/; Expires=${new Date(0).toUTCString()}`,
  ])

  res.setHeader('Location', target.toString())
  res.statusCode = 307
  res.end()
}
