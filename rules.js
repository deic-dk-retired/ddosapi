//connect to db and then get the
//query handler method
var db = require('./db');

function getAllRules(req, res, next) {
  var sqlGetAllRules = db.query('../sql/getAllRules.sql');
  db.foddb.any(sqlGetAllRules)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all rules'
        });
    })
    .catch(function (err) {
      return next(err.message);
    });
}

function getRulesByIP(req, res, next) {
  var sqlAllRulesByIP = db.query('../sql/allRulesByIP.sql');
  db.foddb.any(sqlAllRulesByIP)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all rules grouped by IP'
        });
    })
    .catch(function (err) {
      return next(err.message);
    });
}

function getRuleByID(req, res, next) {
  var ruleId = parseInt(req.params.id);
  var sqlRuleByID = db.query('../sql/RuleByID.sql');
  db.foddb.one(sqlRuleByID, {id: ruleId})
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved one rule by ID'
        });
    })
    .catch(function (err) {
      return next(err.message);
    });
}

// create a rule with form parameters
function createRule(req, res, next) {
  // req.body.age = parseInt(req.body.age);
  db.foddb.none('insert into flow.flowspecrules (flowspecruleid, customernetworkid, rule_name, administratorid, direction, validfrom, validto, isactivated, isexpired, destinationprefix, sourceprefix, ipprotocol,  destinationport, sourceport, icmptype, icmpcode, tcpflags, packetlength, description,customerid)' +
      'values(${flowspecruleid}, ${customernetworkid}, ${rule_name}, ${administratorid}, ${direction}, ${validfrom}, ${validto}, ${isactivated}, ${isexpired}, ${destinationprefix}, ${sourceprefix}, ${ipprotocol}, ${ destinationport}, ${sourceport}, ${icmptype}, ${icmpcode}, ${tcpflags}, ${packetlength}, ${description}, ${customerid})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one rule'
        });
    })
    .catch(function (err) {
      return next(err.message);
    });
}

module.exports = {
  getAllRules: getAllRules
, getRulesByIP: getRulesByIP
, getRuleByID: getRuleByID
, createRule: createRule
};