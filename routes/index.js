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
router.get('/api/icmpt', icmp.getTypesIcmp)
router.get('/api/icmpt/:type', icmp.getTypesIcmp)

router.get('/api/icmpc', icmp.getCodesIcmp)
router.get('/api/icmpc/:code', icmp.getCodesIcmp)

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
router.get('/api/rules', rules.getRules)
router.get('/api/rules/:id', rules.getRuleById)
router.get('/api/rules/detail/:prot/:dest/:action/:isexp/:isact/:vfrom/:vto', rules.getRuleDetail)
router.post('/api/rules', rules.createRule)

/*
map urls to functions
for time series data
*/
router.get('/api/series/:qryfile', fnm.getSeries)
router.get('/api/series/raw/:qryfile', fnm.getSeriesWithTime)
// router.get('/api/series/hosts/one', fnm.getOneSeries)
// router.get('/api/series/:series', fnm.getAllSeries);

/*
export express new router object
and its methods
*/
module.exports = router
