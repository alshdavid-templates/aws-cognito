import * as http from 'node:http'
import * as handlers from './handlers/index.mjs'
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from './platform/config.mjs';

const cognitoJwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: "id",
  clientId: COGNITO_CLIENT_ID,
});

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.statusCode = 200
    res.end()
    return
  }

  const url = new URL('http://0.0.0.0' + req.url)

  // Redirects client to the Cognito login page
  if (url.pathname === '/api/auth/login') {
    return handlers.api_auth_login_get(url, req, res)
  }

  // Cognito navigates here after login
  if (url.pathname === '/api/auth/login/callback') {
    return handlers.api_auth_login_callback_get(url, req, res)
  }

  // Redirects client to the Cognito logout page
  if (url.pathname === '/api/auth/logout') {
    return handlers.api_auth_logout_get(url, req, res)
  }

  // Cognito navigates here after logout
  if (url.pathname === '/api/auth/logout/callback') {
    return handlers.api_auth_logout_callback_get(url, req, res)
  }
  // Endpoint to renew the auth token
  if (url.pathname === '/api/auth/refresh') {
    return handlers.api_auth_refresh_get(url, req, res)
  }

  // Example of protected endpoint
  if (url.pathname === '/api/auth/validate') {
    return handlers.api_auth_validate(url, req, res, cognitoJwtVerifier)
  }

  // Fallback
  await handlers.client_get(url, req, res)
})

server.listen(3000, '0.0.0.0', () => {
  console.log('listening on http://localhost:3000')
})
