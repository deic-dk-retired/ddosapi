var express = require('express')
var router = express.Router()

var icmp = require('../icmp')
var admins = require('../admins')
var rules = require('../rules')
var fnm = require('../fnm')

// router.get('/')

/*
map urls to functions
for icmp types and codes
*/
router.get('/api/icmp', icmp.getTypesICMP)
router.get('/api/icmp/:type', icmp.getTypesICMP)

/*
map urls to functions
for admins
*/
router.get('/api/login/:usr/:pass', admins.verifyAccess)
router.get('/api/admins', admins.getAllAdmins)
router.get('/api/admins/:usr', admins.getOneAdmin)
router.post('/api/admins', admins.createAdmin)
router.put('/api/admins/:usr', admins.updateAdmin)
router.delete('/api/admins/:usr', admins.removeAdmin)

/*
map urls to functions
for rules
*/
router.get('/api/rules/all', rules.getAllRules)
router.get('/api/rules', rules.getRulesByIP)
router.get('/api/rules/:id', rules.getRuleByID)
router.post('/api/rules', rules.createRule)

/*
map urls to functions
for time series data
*/
router.get('/api/series/:qryfile', fnm.getSeries)
router.get('/api/series/hosts/group', fnm.getGrpSeries)
router.get('/api/series/hosts/one', fnm.getOneSeries)
// router.get('/api/series/:series', fnm.getAllSeries);

/*
export express new router object
and its methods
*/
module.exports = router
