const db = require('./db')
const url = 'http://10.33.1.97:4242/api/rules/'

const getRules = (req, res, next) => {
  const sqlGetAllRules = db.miniQuery('.sql/rules/allRules.sql')
  // const sqlRulesCount = db.miniQuery('.sql/rules/rulesCount.sql')
  let jsonarr = []
  let jsonobj = {}
  let recs = 10
  let offset = 8 // rows to skip, same as # of recent rules to fetch
  let nxt = 0
  if (req.query.page !== undefined) {
    nxt = (parseInt(req.query.page) - 1)
  }

  db.foddb.tx(t => {
    let txs = []
    const prRules = t.any(sqlGetAllRules, {rows: recs, next: offset + recs * nxt}).then(rules => {
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
  db.foddb.none('', req.body)
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

const rules = {
  getRules: getRules,
  getRuleById: getRuleById,
  getRuleDetail: getRuleDetail,
  createRule: createRule
}

module.exports = rules
