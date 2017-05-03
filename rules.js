// connect to db and then get the
// query handler method
var db = require('./db')

function getAllRules (req, res, next) {
  var sqlGetAllRules = db.query('../sql/getAllRules.sql')
  db.foddb.any(sqlGetAllRules)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          size: data.length,
          message: 'Retrieved all rules'
        })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

function getRulesByIP (req, res, next) {
  var sqlAllRulesByIP = db.query('../sql/allRulesByIP.sql')
  db.foddb.any(sqlAllRulesByIP)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          size: data.length,
          message: 'Retrieved all rules grouped by IP'
        })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

function getRuleByID (req, res, next) {
  var ruleId = parseInt(req.params.id)
  var sqlRuleByID = db.query('../sql/RuleByID.sql')
  db.foddb.one(sqlRuleByID, {id: ruleId})
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          size: data.length,
          message: 'Retrieved one rule by ID'
        })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

// create a rule with form parameters
function createRule (req, res, next) {
  // req.body.age = parseInt(req.body.age);
  db.foddb.none('', req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          size: data.length,
          message: 'Inserted one rule'
        })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

module.exports = {
  getAllRules: getAllRules,
  getRulesByIP: getRulesByIP,
  getRuleByID: getRuleByID,
  createRule: createRule
}
