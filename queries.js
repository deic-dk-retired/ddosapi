var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString =  'postgres:flowuser:Gbr(Ff)wCJOF@localhost/netflow';
var db = pgp(connectionString);

function getAllAdmins(req, res, next) {
  db.any("SELECT administratorid as userid, customerid as custid, kind, name, username FROM flow.administrators WHERE valid = 'TRUE' order by username ASC")
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL Administrators'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getOneAdmin(req, res, next) {
  var adminID = parseInt(req.params.id);
  db.one("SELECT administratorid as userid, customerid as custid, kind, name, username FROM flow.administrators WHERE administratorid = $1", adminID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE Administrator'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createAdmin(req, res, next) {
  // req.body.age = parseInt(req.body.age);
  db.none("INSERT INTO flow.administrators (customerid, kind, name, phone, username, password, valid, lastlogin, lastpasswordchange)" +
      "VALUES(${customerid}, ${kind}, ${name}, ${phone}, ${username}, crypt(${password}, gen_salt('bf', 10)), true, now(), now())",
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one Administrator'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateAdmin(req, res, next) {
  db.none("UPDATE flow.administrators SET customerid=$1, kind=$2, name=$3, phone=$4, username=$5, password=crypt($6, gen_salt('bf', 10)) WHERE id=$7",
    [req.body.customerid, req.body.kind, req.body.name, req.body.phone, req.body.username, req.body.password])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated Admin'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeAdmin(req, res, next) {
  var adminID = parseInt(req.params.id);
  db.result("DELETE from flow.administrators WHERE administratorid = $1", adminID)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Removed ${result.rowCount} Admin'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAllRules(req, res, next) {
  // var adminID = parseInt(req.params.id);
  db.any("SELECT flowspecruleid \"ruleid\", customerid \"custid\", customernetworkid \"custnetid\", rule_name \"rname\", administratorid \"adminid\", direction \"direct\", validfrom \"fromdate\", validto \"todate\", fastnetmoninstanceid \"fmonid\", isactivated \"active\", isexpired \"expired\", destinationprefix \"destpre\", sourceprefix \"sourcepre\", ipprotocol \"protocol\", destinationport \"destpt\", sourceport \"srcpt\", packetlength \"pktlen\" FROM flow.flowspecrules AS f WHERE f.flowspecruleid not in ( select t.flowspecruleid  from flow.flowspecrules AS t WHERE t.flowspecruleid not in (SELECT distinct x.flowspecruleid FROM flow.flowspecrules AS x WHERE srcordestport = destinationport)) ORDER BY ruleid DESC")
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all rules'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getOneRule(req, res, next) {
  var ruleId = parseInt(req.params.id);
  db.one("SELECT flowspecruleid \"ruleid\", customerid \"custid\", customernetworkid \"custnetid\", rule_name \"rname\", administratorid \"adminid\", direction \"direct\", validfrom \"fromdate\", validto \"todate\", fastnetmoninstanceid \"fmonid\", isactivated \"active\", isexpired \"expired\", destinationprefix \"destpre\", sourceprefix \"sourcepre\", ipprotocol \"protocol\", destinationport \"destpt\", sourceport \"srcpt\", packetlength \"pktlen\" FROM flow.flowspecrules AS f WHERE f.flowspecruleid = $1", ruleId)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved one rule'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllAdmins: getAllAdmins,
  getOneAdmin: getOneAdmin,
  createAdmin: createAdmin,
  updateAdmin: updateAdmin,
  removeAdmin: removeAdmin,
  getAllRules: getAllRules,
  getOneRule: getOneRule
};