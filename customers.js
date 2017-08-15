// connect to db and then get the
// query handler method

var db = require('./db')

// uses json api conventions
function getAllCustomers (req, res, next) {
  var sqlAllCustomers = db.miniQuery('.sql/customers/allCustomers.sql')
  db.foddb.any(sqlAllCustomers)
    .then(function (data) {
      // create json api array
      var jsonarr = []
      data.map(function (e) {
        jsonarr.push({
          type: 'customers',
          id: parseInt(e.customerid),
          attributes: e
        })
      })
      // show jsonapi
      res.status(200)
      .json({
        data: jsonarr
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

// uses json api conventions
function getOneCustomer (req, res, next) {
  var sqlOneCustomer = db.miniQuery('.sql/customers/oneCustomer.sql')
  db.foddb.one(sqlOneCustomer, {customerid: req.params.customerid})
    .then(function (data) {
      // show jsonapi
      res.status(200)
      .json({
        type: 'customers',
        id: parseInt(data.customerid),
        attributes: data
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

function createCustomer (req, res, next) {

}

function updateCustomer (req, res, next) {

}

function removeCustomer (req, res, next) {

}

module.exports = {
  getAllCustomers: getAllCustomers,
  getOneCustomer: getOneCustomer,
  createCustomer: createCustomer,
  updateCustomer: updateCustomer,
  removeCustomer: removeCustomer
}
