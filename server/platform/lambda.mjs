import * as http from 'node:http'

/**
 * @typedef {Object} lambda_request_context_http
 * @property {string} method
 * @property {string} path
 * @property {string} protocol
 * @property {string} sourceIp
 * @property {string} userAgent
 */

/**
 * @typedef {Object} lambda_request_context
 * @property {string} accountId
 * @property {string} apiId
 * @property {string} domainName
 * @property {string} domainPrefix
 * @property {lambda_request_context_http} http
 * @property {string} requestId
 * @property {string} routeKey
 * @property {string} stage
 * @property {string} time
 * @property {string} timeEpoch
 */

/**
 * @typedef {Object} lambda_event 
 * @property {string} version
 * @property {string} routeKey
 * @property {string} rawPath
 * @property {string} rawQueryString
 * @property {Record<string, string>} headers
 * @property {lambda_request_context} requestContext
 * @property {boolean} isBase64Encoded
 */

/** @returns {http.IncomingMessage} lambda_event */
export const lambda_event_to_request = (/** @type {lambda_event} */ lambda_event) => {
  lambda_event.
}