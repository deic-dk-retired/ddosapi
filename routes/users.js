require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require('express')
const openRouter = express.Router()

const users = require('../users')

// openRouter.get('/')

/**
map urls to functions
for users
*/
// openRouter.post('/authenticate', users.authenticate)
openRouter.post('/auth', users.auth)

openRouter.use((req, res, next) => {
  var token = req.body.token || req.param('token') || req.headers['x-access-token']

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.SU_SEC, function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' })
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded
        next()
      }
    })
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    })
  }
})
openRouter.get('/users', users.getAllUsers)
openRouter.get('/users/:userid', users.getOneUser)
openRouter.get('/users/:userid/relationships/networks', users.getUserNetworks)
openRouter.get('/users/:userid/networks', users.getUserNetworks)
openRouter.post('/users', users.createUser)
openRouter.patch('/users/:userid', users.updateUser)

/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
