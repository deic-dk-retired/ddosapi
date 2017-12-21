require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require('express')
const openRouter = express.Router()

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
    return res.status(200).send({
      success: false,
      message: 'Preflight check. Done!'
    })
  }
  if (token) {
    jwt.verify(token, process.env.SU_SEC, function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Invalid token. Failed to authenticate!'
        })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.status(403).send({
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
