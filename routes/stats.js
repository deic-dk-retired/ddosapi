const Express = require('express')
const openRouter = Express.Router()
const stats = require('../stats')

// openRouter.get('/')

/*
map urls to functions
for rules
*/
// openRouter.get('/api/rules/:rows/:offset', rules.getRules)
openRouter.get('/stats/:userid', stats.getStats)

/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
