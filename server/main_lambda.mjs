import { main_server } from './main.mjs'

/** @returns {Promise<import('./platform/lambda.js').LambdaResponse>} */
export async function handler(
  /** @type {import('./platform/lambda.js').LambdaEvent} */ event
) {
  // console.log(JSON.stringify(event, null, 2))
  const request = /** @type {import('./platform/http.js').Request} */ ({
    url: event.rawPath,
    headers: event.headers
  })

  if (event.rawQueryString) {
    request.url += '?'
    request.url += event.rawQueryString
  }

  if (event.cookies) {
    request.headers.cookie = event.cookies.join(';')
  }

  const lambda_response = /** @type {import('./platform/lambda.js').LambdaResponse} */ ({
    isBase64Encoded: false,
    statusCode: 200,
    headers: {},
    cookies: [],
    multiValueHeaders: {},
    body: ''
  })

  const response = /** @type {import('./platform/http.js').Response} */ ({
    get statusCode() {
      return lambda_response.statusCode
    },

    set statusCode(value) {
      lambda_response.statusCode = value
    },

    end() {},

    write(data) {
      lambda_response.body += data
    },

    setHeader(key, headers) {
      if (typeof headers === 'string') {
        lambda_response.headers[key] = headers
      } else {
        if (key.toLowerCase() === 'set-cookie') {
          lambda_response.cookies.push(...headers)
        }
        // lambda_response.multiValueHeaders[key] = lambda_response.multiValueHeaders[key] || []
        // lambda_response.multiValueHeaders[key].push(...headers)
      }
    },
  })

  await main_server(request, response)

  console.log(JSON.stringify(lambda_response, null, 2))
  return lambda_response
}