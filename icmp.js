// connect to db and then get the
// query handler method
var db = require('./db')

function getIcmps (req, res, next) {
  var allTypesIcmp = db.miniQuery('.sql/misc/allTnCicmps.sql')
  db.foddb.any(allTypesIcmp)
    .then(function (data) {
      // json api
      res.status(200)
      .json({
        data: data.map(function (e) {
          return {
            type: 'icmps',
            id: e.id,
            attributes: {
              name: e.name,
              codeid: e.codeid,
              code: e.code
            }
          }
        }),
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
  getIcmps: getIcmps
}
