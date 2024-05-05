export const CLIENT_ID = process.env.COGNITO_CLIENT_ID
export const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET
export const HOSTED_UI = process.env.COGNITO_CLIENT_ORIGIN
export const SERVER_SPA = process.env.SERVER_SPA === 'true'

export const LOGIN_ENDPOINT = '/oauth2/authorize'
export const LOGOUT_ENDPOINT = '/logout'
export const TOKEN_ENDPOINT = '/oauth2/token'
