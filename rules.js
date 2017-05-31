// connect to db and then get the
// query handler method
var db = require('./db')

function getRules (req, res, next) {
  var sqlGetAllRules = db.miniQuery('../sql/getAllRules.sql')
  db.foddb.any(sqlGetAllRules)
    .then(function (data) {
      res.status(200)
      .json({rules: data})
    })
    .catch(function (err) {
      return next(err.message)
    })
}

function getRuleById (req, res, next) {
  var ruleId = parseInt(req.params.id)
  var sqlRuleByID = db.miniQuery('../sql/RuleById.sql')
  db.foddb.one(sqlRuleByID, {id: ruleId})
    .then(function (data) {
      res.status(200)
      .json({
        status: 'success',
        rule: data,
        size: data.length,
        message: 'Retrieved one rule using given rule Id'
      })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

function getRuleDetail (req, res, next) {
  var sqlRuleDetail = db.miniQuery('../sql/RuleDetail.sql')
  db.foddb.any(sqlRuleDetail,
    { prot: req.params.prot,
      dest: req.params.dest,
      action: req.params.action,
      isexp: req.params.isexp,
      isact: req.params.isact,
      vfrom: req.params.vfrom,
      vto: req.params.vto})
    .then(function (data) {
      res.status(200)
      .json({rules: data})
    })
    .catch(function (err) {
      return next(err.message)
    })
}

/**
 * create a rule with form parameters
 */
function createRule (req, res, next) {
  db.foddb.none('', req.body)
    .then(function () {
      res.status(201)
      .json({
        status: 'success',
        message: 'Inserted one rule'
      })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

module.exports = {
  getRules: getRules,
  getRuleById: getRuleById,
  getRuleDetail: getRuleDetail,
  createRule: createRule
}
