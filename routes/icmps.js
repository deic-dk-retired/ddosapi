var express = require('express')
var openRouter = express.Router()

var icmp = require('../icmp')

// openRouter.get('/')

/*
map urls to functions
for icmp types and codes
*/
openRouter.get('/icmps', icmp.getIcmps)

/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
