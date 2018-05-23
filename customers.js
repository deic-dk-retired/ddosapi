const db = require('./db')
const url = `${db.serveUrl}/customers/`
const neturl = `${db.serveUrl}/networks/`

const getAllCustomers = (req, res, next) => {
  const sqlAllCustomers = db.miniQuery('.sql/customers/allCustomers.sql')
  const sqlCosNetworks = db.miniQuery('.sql/customers/customerNetworks.sql')
  let jsonarr = []
  let incNets = []
  let jsonObj = {}
  let isQueried = false
  if (req.query.include === 'networks') {
    isQueried = true
  }

  db.foddb.any(sqlAllCustomers)
  .then((data) => {
    // let jsonarr = []
    // let jsonobj
    data.map((e) => {
      jsonObj = {
        type: 'customers',
        id: parseInt(e.customerid),
        links: {
          self: `${url}${e.customerid}`
        }
      }
      delete e.customerid
      jsonObj.attributes = e
      jsonarr.push(jsonObj)
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

const getOneCustomer = (req, res, next) => {
  const sqlOneCustomer = db.miniQuery('.sql/customers/oneCustomer.sql')
  const sqlCosNetworks = db.miniQuery('.sql/customers/customerNetworks.sql')
  let jsonObj = {}
  let isQueried = false
  if (req.query.include === 'networks') {
    isQueried = true
  }
  db.foddb.tx((t) => {
    let txs = []
    const customer = t.one(sqlOneCustomer, {customerid: req.params.customerid})
    .then(customer => customer)
    txs.push(customer)
    if (isQueried) {
      let networks = t.any(sqlCosNetworks, {customerid: req.params.customerid})
        .then(networks => networks)
      txs.push(networks)
    }

    return db.promise.all(txs).then((args) => {
      const c = args[0]
      let cn = []
      if (isQueried) {
        const n = args[1]
        if (n.length > 1) {
          cn = n.map((e) => {
            let nobj = {
              type: 'networks',
              id: e.customernetworkid
            }
            delete e.customernetworkid
            nobj.attributes = e
            return nobj
          })
        }
        if (n.length === 1) {
          let nobj = {
            type: 'networks',
            id: n[0]
          }
          delete n[0].customernetworkid
          nobj.attributes = n[0]
          cn.push(nobj)
        }
      }
      jsonObj = {
        type: 'customers',
        id: c.customerid,
        links: {
          self: `${url}${c.customerid}`
        }
      }
      if (isQueried) {
        jsonObj.relationships = {
          networks: {
            links: {
              self: `${url}${c.customerid}/relationships/networks`,
              related: `${url}${c.customerid}/networks`
            },
            data: cn.map((e) => { return { type: e.type, id: e.id } })
          }
        }
      }
      delete c.customerid
      jsonObj.attributes = c
      if (isQueried) {
        return {customer: jsonObj, inc: cn}
      } else {
        return {customer: jsonObj}
      }
    })
  })
  .then((d) => {
    res.status(200)
    if (isQueried) {
      res.json({
        data: d.customer,
        included: d.inc
      })
    } else {
      res.json({
        data: d.customer
      })
    }
  })
  .catch((err) => {
    console.log(err.stack)
    return next(err.message)
  })
}

const getAllNetworks = (req, res, next) => {
  const sqlallNetworks = db.miniQuery('.sql/customers/allNetworks.sql')
  db.foddb.any(sqlallNetworks)
  .then((data) => {
    let jsonarr = []
    let jsonobj
    data.map((e) => {
      jsonobj = {
        type: 'networks',
        id: parseInt(e.customernetworkid),
        links: {
          self: `${neturl}${e.customernetworkid}`
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

const getCustomerNetworks = (req, res, next) => {
  const sqlCustomerNetworks = db.miniQuery('.sql/customers/customerNetworks.sql')
  db.foddb.any(sqlCustomerNetworks, {customerid: req.params.customerid})
  .then((data) => {
    let prarr = []
    let probj = {}
    if (data.length > 1) {
      prarr = []
      data.map((e) => {
        probj = {
          type: 'networks',
          id: parseInt(e.customernetworkid)
        }
        delete e.customernetworkid
        delete e.networks
        delete e.administratorid
        probj.attributes = e
        prarr.push(probj)
      })
    }
    if (data.length === 1) {
      probj = {
        type: 'networks',
        id: parseInt(data[0].customernetworkid)
      }
      delete data[0].customernetworkid
      delete data[0].networks
      delete data[0].administratorid
      probj.attributes = data[0]
      prarr = probj
    }
    res.status(200)
    .json({
      links: {
        self: `${url}${req.params.customerid}/networks`
      },
      data: prarr
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
        message: `Successfully created customer ${jsonobj.attributes.name}`
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
    let isCo = t.any(sqlIsCustomer, {customerid: req.params.coid}).then(e => e)
    if (isCo) {
      // find its networks
        // delete those networks
      // delete co
      let isNet = t.any(sqlHasNetworks, {customerid: req.params.coid}).then(e => e)
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
        message: `Successfully created network ${jsonobj.attributes.name}`
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
