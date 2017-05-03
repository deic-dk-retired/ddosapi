// connect to db and then get the
// query handler method
var db = require('./db')

function getTypesICMP (req, res, next) {
  var sqlGetAllRules = db.query('../sql/allTypesICMP.sql')
  db.foddb.any(sqlGetAllRules)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          size: data.length,
          message: 'Retrieved all ICMP Types'
        })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

function geCodesICMP (req, res, next) {
  var sqlAllRulesByIP = db.query('../sql/allTypesICMP.sql')
  db.foddb.any(sqlAllRulesByIP)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          size: data.length,
          message: 'Retrieved all ICMP Codes for...'
        })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

module.exports = {
  getTypesICMP: getTypesICMP,
  geCodesICMP: geCodesICMP
}
