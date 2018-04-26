const moment = require('moment')
const db = require('./db')
const url = db.serveUrl + '/rules/'

const getRules = (req, res, next) => {
  const sqlGetAllRules = db.miniQuery('.sql/rules/allRules.sql')
  // const sqlRulesCount = db.miniQuery('.sql/rules/rulesCount.sql')
  let jsonarr = []
  let jsonobj = {}
  let records = 10
  let offset = 0 // rows to skip, same as # of recent rules to fetch
  let nxt = 0
  if (typeof req.query.page !== 'undefined') {
    nxt = (parseInt(req.query.page) - 1)
  }

  db.foddb.tx((t) => {
    let txs = []
    const prRules = t.any(sqlGetAllRules, {rows: records, next: offset + records * nxt}).then((rules) => {
      return rules
    })
    txs.push(prRules)
    return db.promise.all(txs).then((args) => {
      const r = args[0]

      jsonarr = r.map((e) => {
        jsonobj = {
          type: 'rules',
          id: parseInt(e.id),
          links: {
            self: url + e.id
          }
        }
        delete e.id
        e.validfrom = moment(e.validfrom).format()
        e.validto = moment(e.validto).format()
        jsonobj.attributes = e
        return jsonobj
      })
      return {
        rules: jsonarr,
        recent: jsonarr.filter(function (e) {
          return e.attributes.isactive && !e.attributes.isexpired
        }),
        older: jsonarr.filter(function (e) {
          return !e.attributes.isactive && e.attributes.isexpired
        })
      }
    })
  })
  .then((d) => {
    res.status(200)
    res.json({
      data: d.rules,
      meta: {
        rows: d.rules.length,
        recent: d.recent.length,
        older: d.older.length
      }
    })
  })
  .catch((err) => {
    console.error(err.stack)
    return next(err.message)
  })
}

const getRuleById = (req, res, next) => {
  const sqlRuleByID = db.miniQuery('.sql/rules/RuleById.sql')
  db.foddb.one(sqlRuleByID, {id: parseInt(req.params.id)})
    .then((data) => {
      res.status(200)
      .json({
        data: {
          type: 'rules',
          id: parseInt(data.id),
          attributes: data
        }
      })
    })
    .catch((err) => {
      return next(err.message)
    })
}

const getRuleDetail = (req, res, next) => {
  const sqlRuleDetail = db.miniQuery('.sql/rules/RuleDetail.sql')
  db.foddb.any(sqlRuleDetail,
    { prot: req.params.prot,
      dest: req.params.dest,
      action: req.params.action,
      isexp: req.params.isexp,
      isact: req.params.isact,
      vfrom: req.params.vfrom,
      vto: req.params.vto})
    .then((data) => {
      res.status(200)
      .json({
        rules: data,
        meta: {
          total: data.length
        }
      })
    })
    .catch((err) => {
      return next(err.message)
    })
}

const createRule = (req, res, next) => {
  const sqlCreateRule = db.miniQuery('.sql/rules/createRule.sql')
  db.foddb.any(sqlCreateRule,
    {
      ruleuuid: req.body.ruleuuid,
      rulename: req.body.ruleuuid,
      couuid: req.body.couuid,
      userid: req.body.userid,
      fmnuuid: req.body.fmnuuid,
      validfrom: req.body.validfrom,
      validto: req.body.validto,
      destip: req.body.destip,
      destport: req.body.destport,
      protocol: req.body.protocol,
      icmptype: req.body.icmptype,
      icmpcode: req.body.icmpcode,
      tcpflags: req.body.tcpflags,
      pktlen: req.body.pktlen,
      fragenc: req.body.fragenc,
      description: req.body.description,
      action: req.body.action
    })
    .then((d) => {
      var jsonobj
      jsonobj = {
        type: 'rules',
        id: parseInt(d[0].flowspecruleid)
      }
      delete d[0].flowspecruleid
      jsonobj.attributes = d.pop()
      res.status(201)
      .json({
        data: jsonobj,
        meta: {
          status: 'OK',
          message: 'Successfully created a ' + jsonobj.attributes.ipprotocol + ' rule on ' + jsonobj.attributes.destinationprefix
        }
      })
    })
    .catch((err) => {
      return next(err.message)
    })
}

const updateRule = (req, res, next) => {
  const sqlUpdateRule = db.miniQuery('.sql/rules/updateRule.sql')
  db.foddb.any(sqlUpdateRule,
    { ruleid: parseInt(req.params.ruleid),
      isactive: req.body.isactive,
      isexpired: req.body.isexpired
    })
    .then(() => {
      res.status(200)
      .json({
        meta: {
          status: 'success',
          message: 'Rule ' + parseInt(req.params.ruleid) + ' cleared'
        }
      })
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
}

const rules = {
  getRules,
  getRuleById,
  getRuleDetail,
  createRule,
  updateRule
}

module.exports = rules
