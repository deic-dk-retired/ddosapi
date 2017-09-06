// connect to db and then get the
// query handler method

var db = require('./db')

// uses json api conventions
function getAllCustomers (req, res, next) {
  /*
  #todo: get customer and customer networks
  #todo: sideload relations
  */
  var sqlAllCustomers = db.miniQuery('.sql/customers/allCustomers.sql')
  db.foddb.any(sqlAllCustomers)
    .then(function (data) {
      // create json api array
      var jsonarr = []
      var jsonobj
      data.map(function (e) {
        jsonobj = {
          type: 'customers',
          id: parseInt(e.customerid)
        }
        // remove duplicate id property from attributes
        delete e.customerid
        jsonobj.attributes = e
        jsonarr.push(jsonobj)
      })
      // show jsonapi
      res.status(200)
      .json({
        data: jsonarr,
        meta: {
          total: data.length
        }
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

// uses json api conventions
// // return all networks of all customers
function getAllNetworks (req, res, next) {
  var sqlallNetworks = db.miniQuery('.sql/customers/allNetworks.sql')
  db.foddb.any(sqlallNetworks)
    .then(function (data) {
      // create json api array
      var jsonarr = []
      var jsonobj
      data.map(function (e) {
        jsonobj = {
          type: 'networks',
          id: parseInt(e.customernetworkid)
        }
        // remove duplicate id property from attributes
        delete e.customernetworkid
        jsonobj.attributes = e
        jsonarr.push(jsonobj)
      })
      // show jsonapi
      res.status(200)
      .json({
        data: jsonarr,
        meta: {
          total: data.length
        }
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

// uses json api conventions
// return all networks of a customer based on customerid
function getCustomerNetworks (req, res, next) {
  var sqlCustomerNetworks = db.miniQuery('.sql/customers/customerNetworks.sql')
  db.foddb.any(sqlCustomerNetworks, {customerid: req.params.customerid})
    .then(function (data) {
      // create json api array
      var jsonarr = []
      var jsonobj
      data.map(function (e) {
        jsonobj = {
          type: 'networks',
          id: parseInt(e.customernetworkid)
        }
        // remove duplicate id property from attributes
        delete e.customernetworkid
        jsonobj.attributes = e
        jsonarr.push(jsonobj)
      })
      // show jsonapi
      res.status(200)
      .json({
        data: jsonarr,
        meta: {
          total: data.length
        }
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

// uses json api conventions
function getOneCustomer (req, res, next) {
  /*
  #todo: get customer and customer networks
  #todo: sideload relations
  */
  var sqlOneCustomer = db.miniQuery('.sql/customers/oneCustomer.sql')
  db.foddb.one(sqlOneCustomer, {customerid: req.params.customerid})
    .then(function (data) {
      var jsonobj = {
        type: 'customers',
        id: parseInt(data.customerid)
      }
      // remove duplicate id property from attributes
      delete data.customerid
      jsonobj.attributes = data
      // show jsonapi
      res.status(200)
      .json({
        data: jsonobj
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

function createCustomer (req, res, next) {
  // add customer info
  // add customer networks

}

function updateCustomer (req, res, next) {
  // update customer info
  // update customer networks
}

function removeCustomer (req, res, next) {
  // delete customer info
  // delete customer networks
}

module.exports = {
  getAllCustomers: getAllCustomers,
  getAllNetworks: getAllNetworks,
  getCustomerNetworks: getCustomerNetworks,
  getOneCustomer: getOneCustomer,
  createCustomer: createCustomer,
  updateCustomer: updateCustomer,
  removeCustomer: removeCustomer
}
