import * as path from 'node:path'
import * as fsSync from 'node:fs'
import * as http from 'node:http'
import * as url from 'node:url'
import { MimeType } from '../platform/mime_types.mjs'
import { SERVER_SPA } from '../platform/config.mjs'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export async function client_get(
  /** @type {URL} */ url,
  /** @type {http.IncomingMessage} */ req,
  /** @type {http.ServerResponse} */ res,
) {
  let client_file = path.join(__dirname, '..', '..', 'client', url.pathname === '/' ? 'index.html' : url.pathname)

  const exists = fsSync.existsSync(client_file)
  if (SERVER_SPA && !exists) {
    client_file = path.join(__dirname, '..', '..', 'client', 'index.html')
  }  
  
  if (!exists) {
    res.statusCode = 404
    res.end()
    return
  }

  const mime_type = MimeType[path.extname(client_file)] || 'text/plain'
  res.setHeader('Content-Type', mime_type)

  res.statusCode = 200
  fsSync.createReadStream(client_file).pipe(res)
}
