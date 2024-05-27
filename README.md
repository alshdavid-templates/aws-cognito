# Cognito Starter Project

This will provision
- AWS Cognito for authentication,
  - Provides MFA, email verification, etc
- AWS Lambda function as the auth client
  - Does the auth handshake with Cognito,
  - Hides the client secrets
  - Sets the auth cookies (http-only)

## Setup

Make sure you have the Terraform and AWS CLIs set up and configured on your machine, then run:

```bash
terraform apply
```

## Running locally

You can run the authentication client locally, this will use Cognito as the auth server but will spawn the authentication client locally.

The lambda function and local http server use the same code, the http `req`/`res` objects are just mapped accordingly to the relevant consumer.

```bash
# Setup Env
cp env/default.env env/custom.env
nano env/custom.env

# Apply env
source env/read_env env/custom.env

# Run HTTP server locally
node ./server/main.mjs
```

## Web Client Usage

This is a very basic http client for a web client. Feel free to modify this as needed.

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

- make a TF script for creating cognito
- rewrite the client code so it can be deployed to lambda
- add lambda to TF script
