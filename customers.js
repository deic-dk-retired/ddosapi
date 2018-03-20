  const db = require('./db')
  const courl = db.serveUrl + '/customers/'
  const neturl = db.serveUrl + '/networks/'

  const getAllCustomers = (req, res, next) => {
  /*
  #todo: get customer and customer networks
  #todo: sideload relations
  */
    const sqlAllCustomers = db.miniQuery('.sql/customers/allCustomers.sql')
    db.foddb.any(sqlAllCustomers)
    .then((data) => {
      // create json api array
      var jsonarr = []
      var jsonobj
      data.map((e) => {
        jsonobj = {
          type: 'customers',
          id: parseInt(e.customerid),
          links: {
            self: courl + e.customerid
          }
        }
        delete e.customerid
        jsonobj.attributes = e
        jsonarr.push(jsonobj)
      })
      res.status(200)
      .json({
        data: jsonarr,
        meta: {
          status: 'OK',
          total: data.length
        }
      })
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
  }

// return all networks of all customers
  const getAllNetworks = (req, res, next) => {
    const sqlallNetworks = db.miniQuery('.sql/customers/allNetworks.sql')
    db.foddb.any(sqlallNetworks)
    .then((data) => {
      var jsonarr = []
      var jsonobj
      data.map((e) => {
        jsonobj = {
          type: 'networks',
          id: parseInt(e.customernetworkid),
          links: {
            self: neturl + e.customernetworkid
          }
        }
        delete e.customernetworkid
        jsonobj.attributes = e
        jsonarr.push(jsonobj)
      })
      res.status(200)
      .json({
        data: jsonarr,
        meta: {
          total: data.length
        }
      })
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
  }

// return all networks of a customer based on customerid
  const getCustomerNetworks = (req, res, next) => {
    const sqlCustomerNetworks = db.miniQuery('.sql/customers/customerNetworks.sql')
    db.foddb.any(sqlCustomerNetworks, {customerid: req.params.customerid})
    .then((data) => {
      var jsonarr = []
      var jsonobj
      data.map((e) => {
        jsonobj = {
          type: 'networks',
          id: parseInt(e.customernetworkid),
          links: {
            self: neturl + e.customernetworkid
          }
        }
        delete e.customernetworkid
        jsonobj.attributes = e
        jsonarr.push(jsonobj)
      })
      res.status(200)
      .json({
        data: jsonarr,
        meta: {
          status: 'OK',
          total: data.length
        }
      })
    })
    .catch((err) => {
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
    .then((d) => {
      var jsonobj = {
        type: 'customers',
        id: parseInt(d.customerid),
        links: {
          self: courl + d.customerid
        }
      }
      // remove duplicate id property from attributes
      delete d.customerid
      jsonobj.attributes = d
      // show jsonapi
      res.status(200)
      .json({
        data: jsonobj
      })
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
  }

  const createCustomer = (req, res, next) => {
    const sqlCreateCustomer = db.miniQuery('.sql/customers/createCustomer.sql')
    db.foddb.tx((t) => {
      return t.one(sqlCreateCustomer, {
        couuid: req.params.couuid,
        coname: req.params.coname,
        coadd1: req.params.coadd1,
        coadd2: req.params.coadd2,
        coadd3: req.params.coadd3,
        coaccname: req.params.oaccname,
        coaccemail: req.params.coaccemail,
        coaccphone: req.params.coaccphone,
        coaccrate: req.params.coaccrate,
        subfee: req.params.subfee,
        discount: req.params.discount,
        coemail: req.params.coemail,
        cophopne: req.params.cophopne,
        coweb: req.params.coweb,
        cocvr: req.params.cocvr,
        coean: req.params.coean,
        coadd4: req.params.coadd4,
        codesc: req.params.ccodesc
      })
    })
  .then((d) => {
    let jsonobj = {
      type: 'customers',
      id: parseInt(d.customerid)
    }
    delete d.customerid
    jsonobj.attributes = d
    res.status(201)
      .json({
        data: jsonobj,
        meta: {
          status: 'Created',
          message: 'Successfully created customer ' + jsonobj.attributes.name
        }
      })
  })
  .catch((err) => {
    console.error(err.stack)
    return next(err.message)
  })
  }

  const updateCustomer = (req, res, next) => {
  // update customer info
  // update customer networks
  }

  const removeCustomer = (req, res, next) => {
    const sqlHasNetworks = db.miniQuery('.sql/customers/hasNetworks.sql')
    const sqlIsCustomer = db.miniQuery('.sql/customers/isCustomer.sql')
    const sqlDeleteCo = db.miniQuery('.sql/customers/deleteCustomer.sql')
    const sqlDeleteCoNetworks = db.miniQuery('.sql/customers/deleteNetwork.sql')
    db.foddb.tx((t) => {
      let txs = []
      const isCo = t.any(sqlIsCustomer, {customerid: req.params.coid}).then((e) => {
        return e
      })
      if (isCo) {
        // find its networks
          // delete those networks
        // delete co
        const isNet = t.any(sqlHasNetworks, {customerid: req.params.coid}).then((e) => {
          return e
        })
        if (isNet) {
          t.none()
        }
      }
      // return t.batch([hasNets, isCo])
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })

  // db.foddb.result(sqlDeleteCo, {coid: req.params.coid})
  //   .then((result) => {
  //     res.status(200)
  //     .json({
  //       meta: {
  //         status: 'OK',
  //         message: 'Removed customer: ' + req.params.coid
  //       }
  //     })
  //   })
  //   .catch((err) => {
  //     console.error(err.stack)
  //     return next(err.message)
  //   })
  }

  const createNetwork = (req, res, next) => {
    const sqlCreateNetwork = db.miniQuery('.sql/customers/createNetwork.sql')
    db.foddb.one(sqlCreateNetwork,
      { netuuid: req.body.netuuid,
        couuid: req.body.couuid,
        coid: parseInt(req.body.coid),
        netname: req.body.netname,
        netkind: req.body.netkind,
        netaddr: req.body.netaddr,
        netdesc: req.body.netdesc
      })
    .then((d) => {
      var jsonobj
      jsonobj = {
        type: 'networks',
        id: parseInt(d.customernetworkid)
      }
      delete d.customernetworkid
      jsonobj.attributes = d
      res.status(201)
      .json({
        data: jsonobj,
        meta: {
          status: 'OK',
          message: 'Successfully created network ' + jsonobj.attributes.name
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
      res.status(200)
      .json({
        meta: {
          status: 'OK',
          message: 'successfully removed network'
        }
      })
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
  }

  const customers = {
    getAllCustomers,
    getAllNetworks,
    getCustomerNetworks,
    getOneCustomer,
    createCustomer,
    updateCustomer,
    removeCustomer,
    createNetwork,
    removeNetwork
  }

  module.exports = customers
