var express = require('express');
var router = express.Router();

var admins = require('../admins'),
    rules = require('../rules'),
    fnm = require('../fnm');

router.get('/api/login/:usr/:pass', admins.verifyAccess);
router.get('/api/admins', admins.getAllAdmins);
router.get('/api/admins/:usr', admins.getOneAdmin);
router.post('/api/admins', admins.createAdmin);
router.put('/api/admins/:usr', admins.updateAdmin);
router.delete('/api/admins/:usr', admins.removeAdmin);

router.get('/api/rules/all', rules.getAllRules);
router.get('/api/rules', rules.getRulesByIP);
router.get('/api/rules/:id', rules.getRuleByID);
router.post('/api/rules', rules.createRule);

// router.get('/api/series/:series', fnm.getSeries);
router.get('/api/series/:series', fnm.getAllSeries);

module.exports = router;