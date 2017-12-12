require('dotenv').config()

const helmet = require('helmet')
const compression = require('compression')
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// const methodOverride = require('method-override')
// const session = require('express-session')
const passport = require('passport')
const jwt = require('jwt-simple')
// const LocalStrategy = require('passport-local')
const index = require('./routes/index')
const tcps = require('./routes/tcps')
const icmps = require('./routes/icmps')
const users = require('./routes/users')
const rules = require('./routes/rules')
const customers = require('./routes/customers')
const fnm = require('./routes/fnm')
const stats = require('./routes/stats')
const app = express()

// app.disable('x-powered-by')
app.use(helmet())
app.use(compression())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Content-Type', 'application/vnd.api+json')
  res.header('Access-Control-Allow-Credentials', true)
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
app.use('/api', stats)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = req.session.error
  let msg = req.session.notice
  let success = req.session.success

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
