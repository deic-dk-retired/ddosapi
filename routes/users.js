var express = require('express')
var openRouter = express.Router()

var users = require('../users')

// openRouter.get('/')

/**
map urls to functions
for users
*/
openRouter.post('/authenticate', users.authenticate)
openRouter.get('/login', users.auth)
openRouter.get('/users', users.getAllUsers)
// openRouter.get('/users', users.getUsers)
openRouter.get('/users/:userid', users.getOneUser)
// openRouter.get('/users/:userid', users.getUser)
openRouter.get('/users/:userid/relationships/networks', users.getUserNetworks)
openRouter.get('/users/:userid/networks', users.getUserNetworks)
openRouter.post('/users', users.createUser)
openRouter.patch('/users/:userid', users.updateUser)
openRouter.delete('/users/:userid', users.removeUser)

/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
