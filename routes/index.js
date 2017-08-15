var express = require('express')
var openRouter = express.Router()

var tcp = require('../tcp')
var icmp = require('../icmp')
var users = require('../users')
var customers = require('../customers')
var rules = require('../rules')
var fnm = require('../fnm')

// openRouter.get('/')

/*
map urls to functions
for icmp types and codes
*/
openRouter.get('/api/icmps', icmp.getIcmps)

/*
map urls to functions
for tcp flags
*/
openRouter.get('/api/tcps', tcp.getTcps)

/**
map urls to functions
for users
*/
openRouter.post('/api/authenticate', users.authenticate)
openRouter.post('/api/login', users.verifyAccess)
openRouter.get('/api/users', users.getAllUsers)
openRouter.get('/api/users/:username', users.getOneUser)
openRouter.post('/api/users', users.createUser)
openRouter.patch('/api/users/:username', users.updateUser)
openRouter.delete('/api/users/:username', users.removeUser)

/**
map urls to functions
for customers
*/
openRouter.get('/api/customers', customers.getAllCustomers)
openRouter.get('/api/customers/:customerid', customers.getOneCustomer)

/*
map urls to functions
for rules
*/
// openRouter.get('/api/rules/:rows/:offset', rules.getRules)
openRouter.get('/api/rules', rules.getRules)
openRouter.get('/api/rules/:id', rules.getRuleById)
openRouter.get('/api/rules/detail/:prot/:dest/:action/:isexp/:isact/:vfrom/:vto', rules.getRuleDetail)
openRouter.post('/api/rules', rules.createRule)

/*
map urls to functions
for time series data
*/
openRouter.get('/api/series/:qryfile', fnm.getSeries)
// openRouter.get('/api/series/raw', fnm.getSeriesWithTime)
// openRouter.get('/api/series/raw/:qryfile/:top', fnm.getSeriesWithTime)
// openRouter.get('/api/series/hosts/one', fnm.getOneSeries)
// openRouter.get('/api/series/:series', fnm.getAllSeries);

/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
