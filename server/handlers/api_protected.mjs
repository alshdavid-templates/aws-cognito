import * as http from 'node:http'
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { parseCookie } from '../platform/cookies.mjs';

export async function api_protected(
  /** @type {URL} */ url,
  /** @type {http.IncomingMessage} */ req,
  /** @type {http.ServerResponse} */ res,
  /** @type {CognitoJwtVerifier} */ cognitoJwtVerifier,
) {
  let { auth_access_token } = parseCookie(req.headers.cookie)
  if (!auth_access_token) {
    res.statusCode = 400
    res.end()
    return
  }

  try {
    await cognitoJwtVerifier.verify(auth_access_token);
    res.statusCode = 200
    res.end()
  } catch (error) {
    res.statusCode = 400
    res.end()
  }
}
