// const fs = require('fs')
const app = require('../app')
const debug = require('debug')('node-postgres-promises:server')
const Http = require('http')
const server = Http.Server(app)
const io = require('socket.io')(server)
/**
 * Normalize a port into a number.
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

const port = normalizePort(process.env.PORT || process.env.RU_SERVER_PORT)
/**
 * Event listener for HTTP server "error" event.
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

app.set('port', port)

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
