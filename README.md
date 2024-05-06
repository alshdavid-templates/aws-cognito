# Cognito Starter Project

First set up a Cognito project with the hosted UI

```
cp env/default.env env/custom.env
nano env/custom.env

source env/read_env env/custom.env

node ./server/main.mjs
```

## Client Usage

```javascript
import { AuthClient } from './auth.js'

const authClient = new AuthClient()

authClient.onAuthAction((action, state) => {
  // 'login', 'logout', 'refresh'
  console.log(action, state)
})

document.querySelector('#btn_login').addEventListener('click', async () => {
  // This will redirect the user to the hosted Cognito UI for login
  // You can add an optional state which will be emitted when returning to your application
  // State is used to navigate back to a previous point in the application
  authClient.navigateToLogin({ hello: 'world' })
})

document.querySelector('#btn_logout').addEventListener('click', async () => {
  // This will redirect the user to the hosted Cognito UI for logout
  // You can add an optional state which will be emitted when returning to your application
  // State is used to navigate back to a previous point in the application
  authClient.navigateToLogout({ foo: 'bar' })
})

document.querySelector('#btn_refresh').addEventListener('click', async () => {
  // This will make an http request to renew the auth token
  await authClient.refreshAuth()
})

document.querySelector('#btn_protected').addEventListener('click', async () => {
  // This will validate the token and return the contents
  const resp = await authClient.validate()
  console.log(resp)
})
```

## TODO

- make a TF script for creating cognito
- rewrite the client code so it can be deployed to lambda
- add lambda to TF script
