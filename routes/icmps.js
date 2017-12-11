const express = require('express')
const openRouter = express.Router()

const icmp = require('../icmp')

// openRouter.get('/')

/*
map urls to functions
for icmp types and codes
*/
openRouter.get('/icmptypes', icmp.getIcmps)

/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
