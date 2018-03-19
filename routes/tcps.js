const express = require('express')
const openRouter = express.Router()
const tcp = require('../tcp')

// openRouter.get('/')

/*
map urls to functions
for tcp flags
*/
openRouter.get('/tcps', tcp.getTcps)

/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
