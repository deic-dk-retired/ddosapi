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
openRouter.post('/auth', auth.auth)
openRouter.use((req, res, next) => {
  var token = req.body.token || req.param('token') || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, process.env.SU_SEC, function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
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
