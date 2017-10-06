const db = require('./db')
const url = 'http://10.33.1.97:4242/api/customers/'

// uses json api conventions
const getAllCustomers = (req, res, next) => {
  /*
  #todo: get customer and customer networks
  #todo: sideload relations
  */
  const sqlAllCustomers = db.miniQuery('.sql/customers/allCustomers.sql')
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
const getAllNetworks = (req, res, next) => {
  const sqlallNetworks = db.miniQuery('.sql/customers/allNetworks.sql')
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
const getCustomerNetworks = (req, res, next) => {
  const sqlCustomerNetworks = db.miniQuery('.sql/customers/customerNetworks.sql')
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
const getOneCustomer = (req, res, next) => {
  /*
  #todo: get customer and customer networks
  #todo: sideload relations
  */
  const sqlOneCustomer = db.miniQuery('.sql/customers/oneCustomer.sql')
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

const createCustomer = (req, res, next) => {
  // add customer info
  // add customer networks

}

const updateCustomer = (req, res, next) => {
  // update customer info
  // update customer networks
}

const removeCustomer = (req, res, next) => {
  const sqlDeleteCo = db.miniQuery('.sql/users/deleteCustomer.sql')
  db.foddb.result(sqlDeleteCo, {coid: req.params.coid})
    .then((result) => {
      res.status(200)
      .json({
        meta: {
          status: 'success',
          message: 'Removed customer: ' + req.params.coid
        }
      })
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
}

const createNetwork = (req, res, next) => {
  const sqlCreateNetwork = db.miniQuery('.sql/customers/createNetwork.sql')
  db.foddb.none(sqlCreateNetwork,
    { coid: parseInt(req.body.coid),
      coname: req.body.coname,
      cokind: req.body.cokind,
      conet: req.body.conet,
      codesc: req.body.codesc
    })
    .then(() => {
      res.status(201)
      .json({
        meta: {
          status: 'successfully created network',
          message: {
            name: req.body.coname,
            kind: req.body.cokind,
            net: req.body.conet
          }
        }
      })
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
}

const removeNetwork = (req, res, next) => {
  const sqlRemoveNetwork = db.miniQuery('.sql/customers/deleteCustomerNetwork.sql')
  db.foddb.none(sqlRemoveNetwork, {netid: parseInt(req.params.netid)})
    .then(() => {
      res.status(201)
      .json({
        meta: {
          status: 'successfully removed network'
        }
      })
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
}

const customers = {
  getAllCustomers: getAllCustomers,
  getAllNetworks: getAllNetworks,
  getCustomerNetworks: getCustomerNetworks,
  getOneCustomer: getOneCustomer,
  createCustomer: createCustomer,
  updateCustomer: updateCustomer,
  removeCustomer: removeCustomer,
  createNetwork: createNetwork,
  removeNetwork: removeNetwork
}

module.exports = customers
