import { CLIENT_ID, CLIENT_SECRET, HOSTED_UI, TOKEN_ENDPOINT } from "./config.mjs"

export async function exchange(
  /** @type {string} */ code,
) {
  const target = new URL(HOSTED_UI)
  target.pathname = TOKEN_ENDPOINT

  const body = new URLSearchParams()
  body.set('client_id', CLIENT_ID)
  body.set('client_secret', CLIENT_SECRET)
  body.set('grant_type', 'authorization_code')
  body.set('code', code)
  body.set('redirect_uri', 'http://localhost:3000/auth/callback')
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
  const target = new URL(HOSTED_UI)
  target.pathname = TOKEN_ENDPOINT

  const body = new URLSearchParams()
  body.set('client_id', CLIENT_ID)
  body.set('client_secret', CLIENT_SECRET)
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
