var express = require('express')
var router = express.Router()

var icmp = require('../icmp')
var users = require('../users')
var rules = require('../rules')
var fnm = require('../fnm')

// router.get('/')

/*
map urls to functions
for icmp types and codes
*/
router.get('/api/icmp', icmp.getIcmp)

/**
map urls to functions
for users
*/
router.get('/api/login/:usr/:pass', users.verifyAccess)
router.get('/api/users', users.getAllUsers)
router.get('/api/users/:usr', users.getOneUser)
router.post('/api/users', users.createUser)
router.put('/api/users/:usr', users.updateUser)
router.delete('/api/users/:usr', users.removeUser)

/*
map urls to functions
for rules
*/
router.get('/api/rules', rules.getRules)
router.get('/api/rules/:id', rules.getRuleById)
router.get('/api/rules/detail/:prot/:dest/:action/:isexp/:isact/:vfrom/:vto', rules.getRuleDetail)
router.post('/api/rules', rules.createRule)

/*
map urls to functions
for time series data
*/
router.get('/api/series/:qryfile', fnm.getSeries)
// router.get('/api/series/raw', fnm.getSeriesWithTime)
// router.get('/api/series/raw/:qryfile/:top', fnm.getSeriesWithTime)
// router.get('/api/series/hosts/one', fnm.getOneSeries)
// router.get('/api/series/:series', fnm.getAllSeries);

/*
export express new router object
and its methods
*/
module.exports = router
