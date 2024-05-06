import * as http from 'node:http'
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { parseCookie } from '../platform/cookies.mjs';

export async function api_auth_validate(
  /** @type {URL} */ url,
  /** @type {http.IncomingMessage} */ req,
  /** @type {http.ServerResponse} */ res,
  /** @type {CognitoJwtVerifier} */ cognitoJwtVerifier,
) {
  let { auth_id_token } = parseCookie(req.headers.cookie)
  if (!auth_id_token) {
    res.statusCode = 400
    res.end()
    return
  }

  try {
    const payload = await cognitoJwtVerifier.verify(auth_id_token);
    res.statusCode = 200
    res.write(JSON.stringify({ 
      email: payload.email,
      auth_time: payload.auth_time,
      email_verified: payload.email_verified,
      exp: payload.exp,
     }, null, 2))
    res.end()
  } catch (error) {
    res.statusCode = 400
    res.end()
  }
}
