import * as path from 'node:path'
import * as fsSync from 'node:fs'
import * as fs from 'node:fs/promises'
import * as url from 'node:url'
import { MimeType } from '../platform/mime_types.mjs'
import { SERVER_SPA } from '../platform/config.mjs'

const __current_file = (() => {
  try {
    return __dirname
  } catch (error) {
    
  }
  return url.fileURLToPath(new URL('.', import.meta.url))
})()

const __client_root = (() => {
  if (fsSync.existsSync(path.join(__current_file, 'client'))) {
    return path.join(__current_file, 'client')
  } else {
    return path.join(__current_file, '..', '..', 'client')
  }
})()

export async function client_get(
  /** @type {URL} */ url,
  /** @type {import('../platform/http.js').Request} */ req,
  /** @type {import('../platform/http.js').Response} */ res,
) {
  let client_file = path.join(__client_root, url.pathname === '/' ? 'index.html' : url.pathname)

  const exists = fsSync.existsSync(client_file)
  if (SERVER_SPA && !exists) {
    client_file = path.join(__client_root, 'index.html')
  }  
  
  if (!exists) {
    res.statusCode = 404
    res.end()
    return
  }

  const mime_type = MimeType[path.extname(client_file)] || 'text/plain'
  res.setHeader('Content-Type', mime_type)

  res.statusCode = 200
  res.write(await fs.readFile(client_file))
  res.end()
}
