export type LambdaEvent = {
  version: string
  routeKey: string
  rawPath: string
  rawQueryString: string
  headers: Record<string, string>
  cookies: string[]
  requestContext: {
    accountId: string
    apiId: string
    domainName: string
    domainPrefix: string
    http: {
      method: string
      path: string
      protocol: string
      sourceIp: string
      userAgent: string
    }
    requestId: string
    routeKey: string
    stage: string
    time: string
    timeEpoch: string
  }
  isBase64Encoded: boolean
}

export type LambdaResponse = {
  isBase64Encoded: boolean
  statusCode: number
  headers?: Record<string, string>
  multiValueHeaders?: Record<string, string[]>
  cookies?: string[]
  body?: string
}
