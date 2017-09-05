var express = require('express')
var openRouter = express.Router()

var rules = require('../rules')

// openRouter.get('/')

/*
map urls to functions
for rules
*/
// openRouter.get('/api/rules/:rows/:offset', rules.getRules)
openRouter.get('/rules', rules.getRules)
openRouter.get('/rules/:id', rules.getRuleById)
openRouter.get('/rules/detail/:prot/:dest/:action/:isexp/:isact/:vfrom/:vto', rules.getRuleDetail)
openRouter.post('/rules', rules.createRule)

/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
