import * as http from 'node:http'
import { parse_req_url } from '../platform/req.mjs'

export async function api_auth_logout_callback_get(
  /** @type {URL} */ url,
  /** @type {http.IncomingMessage} */ req,
  /** @type {http.ServerResponse} */ res,
) {
  let location = '/'
  
  const state = url.searchParams.get('state')
  if (state) {
    location += `?state=${state}`
  }

  res.setHeader('Set-Cookie', [
    `auth_refresh_token=null; SameSite=Strict; Path=/api/auth; HttpOnly; Expires=${new Date(0).toUTCString()}`,
    `auth_refresh_valid=null; SameSite=Strict; Path=/; Expires=${new Date(0).toUTCString()}`,
    `auth_id_token=null; SameSite=Strict; Path=/api; HttpOnly; Expires=${new Date(0).toUTCString()}`,
  ])

  res.setHeader('Location', location)
  res.statusCode = 307
  res.end()
}
