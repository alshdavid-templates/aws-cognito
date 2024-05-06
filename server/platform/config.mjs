export const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID
export const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET
export const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID
export const COGNITO_ORIGIN = process.env.COGNITO_ORIGIN
export const SERVER_SPA = process.env.SERVER_SPA === 'true'

export const LOCAL_ORIGIN = (() => {
  if (process.env.LOCAL_ORIGIN.endsWith('/')) {
    return process.env.LOCAL_ORIGIN.substring(0, process.env.LOCAL_ORIGIN.length - 1)
  } else {
    return process.env.LOCAL_ORIGIN

  }
})()

export const LOGIN_ENDPOINT = '/oauth2/authorize'
export const LOGOUT_ENDPOINT = '/logout'
export const TOKEN_ENDPOINT = '/oauth2/token'
