var express = require('express');
var router = express.Router();

var db = require('../queries');

router.get('/api/admins', db.getAllAdmins);
router.get('/api/admins/:id', db.getOneAdmin);
router.post('/api/admins', db.createAdmin);
router.put('/api/admins/:id', db.updateAdmin);
router.delete('/api/admins/:id', db.removeAdmin);

router.get('/api/rules', db.getAllRules);
router.get('/api/rules/:id', db.getOneRule);

module.exports = router;