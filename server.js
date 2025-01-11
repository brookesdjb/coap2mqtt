const coap = require('coap')
const server = coap.createServer()

// Boolean lamp state in memory (0 = OFF, 1 = ON)
let lampState = 0

server.on('request', (req, res) => {
    console.log(req)
  const resourceName = req.url.split('/')[1] || ''
  const method = req.method // 'PUT', 'GET', etc.

  switch (resourceName) {
    case 'wake':
        console.log('wake')
        break;
    case 'Lamp':
      if (method === 'PUT') {
        // Parse incoming payload as '0' or '1'
        const incomingPayload = req.payload.toString().trim()
        if (incomingPayload !== '0' && incomingPayload !== '1' && incomingPayload !== '2') {
          res.code = '4.00' // "Bad Request" in CoAP codes
          // Return a minimal plain-text error
          res.end('ERR')
          return
        }
        
        // Update lampState
        // 2 = "Toggle"
        if (incomingPayload === '2') {
            lampState = lampState === 0 ? 1 : 0
            } else {
                lampState = parseInt(incomingPayload, 10)
            }
        // 2.04 = "Changed"
        res.code = '2.04'
        // Return a minimal plain-text success indicator
        // You could also just return nothing (empty string).
        res.end('OK')

      } else if (method === 'GET') {
        // 2.05 = "Content"
        res.code = '2.05'
        // Return the lamp state as a single character: '0' or '1'
        res.end(lampState.toString())

      } else {
        // 4.05 = "Method Not Allowed"
        res.code = '4.05'
        res.end('ERR')
      }
      break

    default:
      // 4.04 = "Not Found"
      res.code = '4.04'
      res.end('ERR')
      break
  }
  console.log(lampState)
})

server.listen(() => {
  console.log('CoAP server is listening on port 5683...')
})