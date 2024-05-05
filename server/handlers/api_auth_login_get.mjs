import * as http from 'node:http'
import { CLIENT_ID, HOSTED_UI, LOGIN_ENDPOINT } from '../platform/config.mjs'
import { parse_req_url } from '../platform/req.mjs'

export async function api_auth_login_get(
  /** @type {URL} */ url,
  /** @type {http.IncomingMessage} */ req,
  /** @type {http.ServerResponse} */ res,
) {
  const target = new URL(HOSTED_UI)
  target.pathname = LOGIN_ENDPOINT
  target.searchParams.set('response_type', 'code')
  target.searchParams.set('client_id', CLIENT_ID)
  target.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/login/callback')

  if (url.searchParams.has('state')) {
    target.searchParams.set('state', url.searchParams.get('state'))
  }

  res.setHeader('Location', target.toString())
  res.statusCode = 307
  res.end()
}
