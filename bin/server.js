const app = require('../app')
const debug = require('debug')('node-postgres-promises:server')
const http = require('http')

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
  let port = parseInt(val, 10)
  if (isNaN(port)) {
    // named pipe
    return val
  }
  if (port >= 0) {
    // port number
    return port
  }
  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
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
 * Create HTTP server.
 */
const server = http.Server(app)
const io = require('socket.io')(server)
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
