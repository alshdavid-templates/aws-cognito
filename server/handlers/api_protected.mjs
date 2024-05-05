import * as http from 'node:http'
import { CLIENT_ID, HOSTED_UI, LOGIN_ENDPOINT } from '../platform/config.mjs'
import { parse_req_url } from '../platform/req.mjs'

export async function api_protected(
  /** @type {URL} */ url,
  /** @type {http.IncomingMessage} */ req,
  /** @type {http.ServerResponse} */ res,
) {
  
  res.statusCode = 200
  res.end()
}
