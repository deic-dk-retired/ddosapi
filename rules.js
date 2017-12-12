const moment = require('moment')
const db = require('./db')
const url = 'http://10.33.1.97:4242/api/rules/'

const getRules = (req, res, next) => {
  const sqlGetAllRules = db.miniQuery('.sql/rules/allRules.sql')
  // const sqlRulesCount = db.miniQuery('.sql/rules/rulesCount.sql')
  let jsonarr = []
  let jsonobj = {}
  let records = 10
  let offset = 0 // rows to skip, same as # of recent rules to fetch
  let nxt = 0
  if (req.query.page !== undefined) {
    nxt = (parseInt(req.query.page) - 1)
  }

  db.foddb.tx(t => {
    let txs = []
    const prRules = t.any(sqlGetAllRules, {rows: records, next: offset + records * nxt}).then(rules => {
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
  .then(d => {
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
  .catch(err => {
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
  const sqlCreateRule = db.miniQuery('.sql/rules/insertRule.sql')
  db.foddb.none(sqlCreateRule,
    {
      uuidrule: req.body.uuidrule,
      rulename: req.body.uuidrule,
      couuid: req.body.couuid,
      uuiduser: req.body.uuiduser,
      fromtime: req.body.fromtime,
      totime: req.body.totime,
      fnmid: req.body.fnmid,
      dstip: req.body.dstip,
      // srcip: req.body.srcip,
      protocol: req.body.protocol,
      dstport: req.body.dstport,
      // srcport: req.body.srcport,
      icmptype: req.body.icmptype,
      icmpcode: req.body.icmpcode,
      tcpflags: req.body.tcpflags,
      pktlength: req.body.pktlength,
      dscp: req.body.dscp,
      fragenc: req.body.fragenc,
      action: req.body.action,
      description: req.body.description
    })
    .then(() => {
      res.status(201)
      .json({
        status: 'success',
        message: 'Inserted one rule'
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
  getRules: getRules,
  getRuleById: getRuleById,
  getRuleDetail: getRuleDetail,
  createRule: createRule,
  updateRule: updateRule
}

module.exports = rules
