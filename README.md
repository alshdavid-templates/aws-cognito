# Cognito Starter Project

First set up a Cognito project with the hosted UI

```
cp env/default.env env/custom.env
nano env/custom.env

source scripts/read_env env/custom.env

node ./server/main.mjs
```

## TODO

- make a TF script for creating cognito
- rewrite the client code so it can be deployed to lambda
- add lambda to TF script