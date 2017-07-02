// connect to db and then get the
// query handler method
var db = require('./db')

function getIcmp (req, res, next) {
  var allTypesIcmp = db.miniQuery('.sql/icmpTnc.sql')
  db.foddb.any(allTypesIcmp)
    .then(function (data) {
      res.status(200)
      .json({
        icmptnc: data,
        meta: {
          total: data.length
        }
      })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

module.exports = {
  getIcmp: getIcmp
}
