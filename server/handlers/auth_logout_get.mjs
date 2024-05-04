import * as http from 'node:http'
import { parse_req_url } from '../platform/req.mjs'

export async function auth_logout_get(
  /** @type {http.IncomingMessage} */ req,
  /** @type {http.ServerResponse} */ res,
) {
  const { searchParams } = parse_req_url(req)
  let return_url = '/'

  const state = searchParams.get('state')
  if (state) return_url = `/?state=${state}`

  res.setHeader('Set-Cookie', [
    `auth_refresh_token=null; SameSite=Strict; Path=/auth; HttpOnly; Expires=${new Date(0).toUTCString()}`,
    `auth_access_token=null; SameSite=Strict; Path=/; Expires=${new Date(0).toUTCString()}`,
    `auth_user_email=null; SameSite=Strict; Path=/; Expires=${new Date(0).toUTCString()}`,
  ])

  res.setHeader('Location', '/')
  res.statusCode = 307
  res.end()
}
