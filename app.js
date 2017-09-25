require('dotenv').config()
var helmet = require('helmet')
var compression = require('compression')
var express = require('express')
var path = require('path')
var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
// var methodOverride = require('method-override')
// var session = require('express-session')
var passport = require('passport')
var jwt = require('jwt-simple')
// var LocalStrategy = require('passport-local')
var index = require('./routes/index')
var tcps = require('./routes/tcps')
var icmps = require('./routes/icmps')
var users = require('./routes/users')
var rules = require('./routes/rules')
var customers = require('./routes/customers')
var fnm = require('./routes/fnm')

var app = express()

// app.disable('x-powered-by')
app.use(helmet())
app.use(compression())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// log to console
app.use(morgan('dev'))
app.use(passport.initialize())
// get req params
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)
app.use('/api', tcps)
app.use('/api', icmps)
app.use('/api', users)
app.use('/api', rules)
app.use('/api', customers)
app.use('/api', fnm)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = req.session.error
  var msg = req.session.notice
  var success = req.session.success

  delete req.session.error
  delete req.session.success
  delete req.session.notice

  if (err) res.locals.error = err
  if (msg) res.locals.notice = msg
  if (success) res.locals.success = success

  next()
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.code || 501)
    .json({
      status: 'error',
      message: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  })
})

module.exports = app
