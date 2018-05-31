const db = require('./db')
const url = `${db.serveUrl}/customers/`
const neturl = `${db.serveUrl}/networks/`

const getAllCustomers = (req, res, next) => {
  const sqlAllCustomers = db.miniQuery('.sql/customers/allCustomers.sql')
  const sqlCosNetworks = db.miniQuery('.sql/customers/customersNetworks.sql')
  let incNets = []
  let jsonObj = {}
  let isQueried = false
  if (req.query.include === 'networks') {
    isQueried = true
  }

  db.foddb.tx((t) => {
    let resObj = {}
    let txs = []
    const prCos = t.any(sqlAllCustomers)
      .then(cos => cos)
    txs.push(prCos)

    return db.promise.all(txs).then((args) => {
      const u = args[0]
      let jsonarr = []
      if (isQueried) {
        let nets = [...new Set(u.map(e => e.conets).reduce((a, c) => a.concat(c)).map(e => parseInt(e)))]
        incNets = nets.sort((a, b) => a - b)
      }
      jsonarr = u.map((e) => {
        jsonObj = {
          type: 'customers',
          id: e.customerid,
          links: {
            self: `${url}${e.customerid}`
          }
        }
        if (isQueried) {
          jsonObj.relationships = {
            networks: {
              links: {
                self: `${url}${e.customerid}/relationships/networks`,
                related: `${url}${e.customerid}/networks`
              },
              data: e.conets.map((e) => { return {type: 'networks', id: e} })
            }
          }
        }
        delete e.customerid
        jsonObj.attributes = e
        return jsonObj
      })
      resObj = {
        customers: jsonarr
      }
      if (isQueried) {
        resObj.inc = incNets
      }
      return resObj
    })
  })
  .then((o) => {
    if (isQueried) {
      return db.foddb.any(sqlCosNetworks, {networkids: `{${o.inc.join()}}`})
      .then((n) => {
        return {
          customers: o.customers,
          inc: n
        }
      })
    } else {
      return {
        customers: o.customers
      }
    }
  })
  .then((d) => {
    res.status(200)
    if (isQueried) {
      let inc = d.inc.map((e) => {
        let no = {type: 'networks', id: e.customernetworkid}
        delete e.customernetworkid
        no.attributes = e
        return no
      })
      res.json({
        data: d.customers,
        included: inc
      })
    } else {
      res.json({
        data: d.customers
      })
    }
  })
  .catch((err) => {
    console.log(err.stack)
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
    const customer = t.one(sqlOneCustomer, {customerid: req.params.coid})
    .then(customer => customer)
    txs.push(customer)
    if (isQueried) {
      let networks = t.any(sqlCosNetworks, {customerid: req.params.coid})
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
            id: n[0].customernetworkid
          }
          delete n[0].customernetworkid
          nobj.attributes = n[0]
          console.log(nobj)
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
  db.foddb.any(sqlCustomerNetworks, {customerid: req.params.coid})
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
        self: `${url}${req.params.coid}/networks`
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
  const sqlAddCoNetwork = db.miniQuery('.sql/customers/addCustomerNetwork.sql')

  db.foddb.tx((t) => {
    let txs = []
    const addedNet = t.one(sqlCreateNetwork, {
      netuuid: req.body.netuuid,
      couuid: req.body.couuid,
      coid: parseInt(req.body.coid),
      netname: req.body.netname,
      netkind: req.body.netkind,
      netaddr: req.body.netaddr,
      netdesc: req.body.netdesc
    }).then(n => n)
    txs.push(addedNet)
    return db.promise.all(txs).then(args => args)
  })
  .then((r) => {
    const sqlCoNets =
    `select networks
      from flow.customers a
      where a.customerid = $(coid);`
    const getCoNets = t.one(sqlCoNets, {coid: parseInt(req.body.coid)}).then(d => d)
    txs.push(getCoNets)

    const updateCoNets = t.one(sqlAddCoNetwork, {coid: parseInt(req.body.coid), netarr: `{${getCoNets}}`})
    txs.push(updateCoNets)
  })
  .then((d) => {
    console.log(d)
    let jsonObj = {
      type: 'networks',
      id: parseInt(d.customernetworkid)
    }
    delete d.customernetworkid
    jsonObj.attributes = d
    res.status(201)
    .json({
      data: jsonObj,
      meta: {
        status: 'OK',
        message: `Successfully created network ${jsonObj.attributes.name}`
      }
    })
  })
  .catch((err) => {
    console.log(err.stack)
    return next(err.message)
  })

  // db.foddb.one(sqlCreateNetwork,
  //   { netuuid: req.body.netuuid,
  //     couuid: req.body.couuid,
  //     coid: parseInt(req.body.coid),
  //     netname: req.body.netname,
  //     netkind: req.body.netkind,
  //     netaddr: req.body.netaddr,
  //     netdesc: req.body.netdesc
  //   })
  // .then((d) => {
  //   let jsonObj = {
  //     type: 'networks',
  //     id: parseInt(d.customernetworkid)
  //   }
  //   delete d.customernetworkid
  //   jsonObj.attributes = d
  //   res.status(201)
  //   .json({
  //     data: jsonObj,
  //     meta: {
  //       status: 'OK',
  //       message: `Successfully created network ${jsonObj.attributes.name}`
  //     }
  //   })
  // })
  // .catch((err) => {
  //   console.error(err.stack)
  //   return next(err.message)
  // })
}

const removeNetwork = (req, res, next) => {
  const sqlUpdateCoNetwork = db.miniQuery('.sql/customers/removeCustomerNetwork.sql')
  const sqlRemoveNetwork = db.miniQuery('.sql/customers/deleteNetwork.sql')
  console.log(req.params.coid)
  console.log(req.body.netid)
  db.foddb.tx((t) => {
    let txs = []
    const remCoNet = t.any(sqlUpdateCoNetwork,
      {coid: parseInt(req.params.coid), netid: parseInt(req.body.netid)}).then(c => c)
    txs.push(remCoNet)
    const remNet = t.any(sqlRemoveNetwork, {netid: parseInt(req.body.netid)})
      .then(c => c)
    txs.push(remNet)
    return db.promise.all(txs).then(res => res)
  })
  .then((d) => {
    console.log(d)
    res.status(200)
    .json({
      meta: {
        status: `200`,
        message: `successfully removed network`
      }
    })
  })
  .catch((err) => {
    console.error(err.stack)
    return next(err.message)
  })

  // db.foddb.none(sqlRemoveCoNetwork, {netid: parseInt(req.params.netid)})
  // .then(() => {
  //   res.status(200)
  //   .json({
  //     meta: {
  //       status: 'OK',
  //       message: 'successfully removed network'
  //     }
  //   })
  // })
  // .catch((err) => {
  //   console.error(err.stack)
  //   return next(err.message)
  // })
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
