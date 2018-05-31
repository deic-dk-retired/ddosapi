require('dotenv').config()

const helmet = require('helmet')
const compression = require('compression')
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const route = './routes/'
const index = require(`${route}index`)
const auth = require(`${route}auth`)
const tcps = require(`${route}tcps`)
const icmps = require(`${route}icmps`)
const users = require(`${route}users`)
const rules = require(`${route}rules`)
const customers = require(`${route}customers`)
const fnm = require(`${route}fnm`)
const stats = require(`${route}stats`)
const app = express()
const api = `/${process.env.RU_NAMESPACE}`

app.use(helmet.dnsPrefetchControl())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.noCache())
app.use(helmet.noSniff())
app.use(helmet.referrerPolicy())
app.use(helmet.xssFilter())

app.use(compression())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, jwtauthtkn')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Content-Type', 'application/vnd.api+json')
  res.header('Access-Control-Allow-Credentials', true)
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)
app.use(api, auth)
app.use(api, customers)
app.use(api, fnm)
app.use(api, icmps)
app.use(api, rules)
app.use(api, stats)
app.use(api, tcps)
app.use(api, users)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = req.session.error
  let msg = req.session.notice
  let success = req.session.success

  delete req.session.error
  delete req.session.success
  delete req.session.notice

  if (err) { res.locals.error = err }
  if (msg) { res.locals.notice = msg }
  if (success) { res.locals.success = success }
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
