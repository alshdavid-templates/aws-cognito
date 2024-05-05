import { COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_ORIGIN, TOKEN_ENDPOINT } from "./config.mjs"

export async function exchange(
  /** @type {string} */ code,
) {
  const target = new URL(COGNITO_ORIGIN)
  target.pathname = TOKEN_ENDPOINT

  const body = new URLSearchParams()
  body.set('client_id', COGNITO_CLIENT_ID)
  body.set('client_secret', COGNITO_CLIENT_SECRET)
  body.set('grant_type', 'authorization_code')
  body.set('code', code)
  body.set('redirect_uri', 'http://localhost:3000/api/auth/login/callback')
  target.searchParams.set('scope', 'email/openid')

  const response = await fetch(target.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString()
  })

  return response.json()
}

export async function refresh(
  /** @type {string} */ refresh_token,
) {
  const target = new URL(COGNITO_ORIGIN)
  target.pathname = TOKEN_ENDPOINT

  const body = new URLSearchParams()
  body.set('client_id', COGNITO_CLIENT_ID)
  body.set('client_secret', COGNITO_CLIENT_SECRET)
  body.set('grant_type', 'refresh_token')
  body.set('refresh_token', refresh_token)

  const response = await fetch(target.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString()
  })

  return response.json()
}
