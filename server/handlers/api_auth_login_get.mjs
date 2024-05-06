import * as http from 'node:http'
import { COGNITO_CLIENT_ID, COGNITO_ORIGIN, LOCAL_ORIGIN, LOGIN_ENDPOINT } from '../platform/config.mjs'
import { parse_req_url } from '../platform/req.mjs'

export async function api_auth_login_get(
  /** @type {URL} */ url,
  /** @type {import('../platform/http.js').Request} */ req,
  /** @type {import('../platform/http.js').Response} */ res,
) {
  const target = new URL(COGNITO_ORIGIN)
  target.pathname = LOGIN_ENDPOINT
  target.searchParams.set('response_type', 'code')
  target.searchParams.set('client_id', COGNITO_CLIENT_ID)
  target.searchParams.set('redirect_uri', `${LOCAL_ORIGIN}/api/auth/login/callback`)

  if (url.searchParams.has('state')) {
    target.searchParams.set('state', url.searchParams.get('state'))
  }

  res.setHeader('Location', target.toString())
  res.statusCode = 307
  res.end()
}
