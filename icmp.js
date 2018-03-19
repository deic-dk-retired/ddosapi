// connect to db and then get the
// query handler method
const db = require('./db')

const getIcmps = (req, res, next) => {
  const allTypesIcmp = db.miniQuery('.sql/misc/allTypesIcmp.sql')
  db.foddb.any(allTypesIcmp)
    .then((data) => {
      res.status(200)
      .json({
        data: data.map((e) => {
          return {
            type: 'icmptype',
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
    .catch((err) => {
      return next(err.message)
    })
}

const icmp = {
  getIcmps
}

module.exports = icmp
