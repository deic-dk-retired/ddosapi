// connect to db and then get the
// query handler method
var db = require('./db')

function getTypesIcmp (req, res, next) {
  var allTypesIcmp = db.miniQuery('../sql/allTypesIcmp.sql')
  db.foddb.any(allTypesIcmp)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          size: data.length,
          message: 'Retrieved all icmp types'
        })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

function getCodesIcmp (req, res, next) {
  var allCodesIcmp = db.miniQuery('../sql/allCodesIcmp.sql')
  db.foddb.any(allCodesIcmp)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          size: data.length,
          message: 'Retrieved all icmp codes'
        })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

module.exports = {
  getTypesIcmp: getTypesIcmp,
  getCodesIcmp: getCodesIcmp
}
