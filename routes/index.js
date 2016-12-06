var express = require('express');
var router = express.Router();

var db = require('../queries');

router.get('/api/admins', db.getAllAdmins);
router.get('/api/admins/:id', db.getSingleAdmin);
router.post('/api/admins', db.createAdmin);
// router.put('/api/admins/:id', db.updateAdmin);
router.delete('/api/admins/:id', db.removeAdmin);

module.exports = router;