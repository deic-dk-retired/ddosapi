// const fs = require('fs')
const app = require('../app')
const debug = require('debug')('node-postgres-promises:server')
const Http = require('http')
const server = Http.Server(app)
const io = require('socket.io')(server)
// const https = require('https')

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
  let port = null
  if (isNaN(port)) {
    port = val
  }
  if (port >= 0) {
    port = parseInt(val, 10)
  }
  return port
}

/**
 * Event listener for HTTPS server "error" event.
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
    // handle specific listen errors with friendly messages
  if (error.code === 'EACCES') {
    console.log(bind + ' requires elevated privileges')
  }
  if (error.code === 'EADDRINUSE') {
    console.log(bind + ' is already in use')
  }
}

/**
 * Event listener for HTTPS server "listening" event.
 */
const onListening = () => {
  let addr = server.address()
  let bind =
    typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || process.env.RU_SERVER_PORT)
app.set('port', port)

/**
 * Create HTTPS server.
 */
// const options = {
//   key: fs.readFileSync('noapi_key.pem'),
//   cert: fs.readFileSync('noapi_cert.pem'),
//   requestCert: true,
//   rejectUnauthorized: true
// }

// const server = https.Server(options, app, (req, res) => {
//   console.log('authorized: ', req.socket.authorized)
//   console.log('client certificate: ', req.socket.getPeerCertificate())
// })

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error on', onError)
server.on('listening on', onListening)

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' })
  socket.on('my other event', function (data) {
    console.log(data)
  })
})
