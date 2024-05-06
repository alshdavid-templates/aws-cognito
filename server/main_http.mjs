import * as http from 'node:http'
import { main_server } from './main.mjs'

let server = http.createServer(main_server)

server.listen(3000, '0.0.0.0', () => {
  console.log('listening on http://localhost:3000')
})
