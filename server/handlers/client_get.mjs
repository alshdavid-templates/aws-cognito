import * as path from 'node:path'
import * as fsSync from 'node:fs'
import * as http from 'node:http'
import * as url from 'node:url'
import { MimeType } from '../platform/mime_types.mjs'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export async function client_get(
  /** @type {http.IncomingMessage} */ req,
  /** @type {http.ServerResponse} */ res,
) {
  const url = req.url
  if (!req.url) {
    res.statusCode = 400
    res.end()
    return
  }

  let client_file = path.join(__dirname, '..', '..', 'client', url === '/' ? 'index.html' : url)

  if (!fsSync.existsSync(client_file)) {
    client_file = path.join(__dirname, '..', '..', 'client', 'index.html')
  }

  const mime_type = MimeType[path.extname(client_file)] || 'text/plain'
  res.setHeader('Content-Type', mime_type)

  res.statusCode = 200
  fsSync.createReadStream(client_file).pipe(res)
}
