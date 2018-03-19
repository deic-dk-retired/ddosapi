const express = require('express')
const openRouter = express.Router()
const rules = require('../stats')

// openRouter.get('/')

/*
map urls to functions
for rules
*/
// openRouter.get('/api/rules/:rows/:offset', rules.getRules)
openRouter.get('/stats/:userid', rules.getStats)

/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
