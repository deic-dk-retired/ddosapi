require('dotenv').config()
const jwt = require('jsonwebtoken')
const Express = require('express')
const openRouter = Express.Router()
const auth = require('../auth')

// openRouter.get('/')

/**
map urls to functions
for users
*/
// openRouter.post('/authenticate', users.authenticate)
openRouter.post('/auth', auth.authenticate)
openRouter.use((req, res, next) => {
  let token = req.headers.jwtauthtkn || req.headers['x-jwt-tkn']
  if (req.method === 'OPTIONS') {
    return res.status(200).json({
      status: 200,
      success: false,
      message: 'Preflight check. Done!'
    })
  }
  if (token) {
    jwt.verify(token, process.env.SU_SEC, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(404).json({
            status: 404,
            success: false,
            expiredAt: err.expiredAt,
            message: err.message
          })
        }
        if (err.name === 'JsonWebTokenError') {
          return res.status(403).json({
            status: 403,
            success: false,
            message: err.message
          })
        }
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.status(403).json({
      success: false,
      message: 'No token provided.'
    })
  }
})
/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
