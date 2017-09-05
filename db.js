const chalk = require('chalk')
var promise = require('bluebird')
const path = require('path')
/*
knexjs.org
 */
var knex = require('knex')({
  client: 'pg',
  version: '9.5',
  connection: {
    host: '127.0.0.1',
    user: 'flowuser',
    password: 'Gbr(Ff)wCJOF@localhost',
    database: 'netflow'
  },
  debug: true
})
/*
pg-promise stuff
 */
var options = {
  // Initialization Options
  // use bluebird promise library
  promiseLib: promise
}
var pgp = require('pg-promise')(options)
var connectStringFod = 'postgres:flowuser:Gbr(Ff)wCJOF@localhost/netflow'
var fodDb = pgp(connectStringFod)

/**
 *  check connection for postgre sql
 */
fodDb.connect()
.then(function (obj) {
  console.log(chalk.hex('#EC407A')('listening on ' + obj.client.database + ' using pg-promise'))
})
.catch(error => {
  console.log(chalk.red('Error:', error))
})
/**
 * using official npm package
 * [npm install influx]
 */
var Influx = require('influx')
var influxClient = new Influx.InfluxDB({
  host: '172.22.89.2',
  database: 'graphite'
})
/**
 * check for db graphite on influxdb and show all the dbs listening on
 */
influxClient.getDatabaseNames()
.then(function (names) {
  console.log(chalk.hex('#26A69A')('stream1: ' + names.join(', ')))
  if (!names.includes('graphite')) {
    console.log(chalk.redBright('graphite not found, please check the db named grahite exists at http://172.22.89.2:8083/'))
  } else {
    console.log(chalk.hex('#039BE5')('Listening on graphite using influx'))
  }
})
.catch(function (err) {
  console.error('Error looking up graphite unsing influx!')
  return err.message
})

/**
 * [npm install influxdb-nodejs]
 */
var Influxnode = require('influxdb-nodejs')
var InfluxnodeClient = new Influxnode('http://172.22.89.2:8086/graphite')
/**
 * check for db graphite on influxdb and show all the dbs listening on
 */
InfluxnodeClient.showDatabases()
.then(function (names) {
  console.log(chalk.hex('#00897B')('stream2: ' + names.join(', ')))
  if (!names.includes('graphite')) {
    console.log(chalk.redBright('graphite not found, please check the db named grahite exists at http://172.22.89.2:8083/'))
  } else {
    console.log(chalk.hex('#0277BD')('Listening on graphite using influxdb-nodejs'))
  }
})
.catch(function (err) {
  console.error('Error looking up graphite using influxdb-nodejs!')
  return err.message
})

function miniQuery (file) {
  const fullPath = path.join(__dirname, file)
  return pgp.QueryFile(fullPath, {minify: true, noWarnings: true})
}

// export as x:function
module.exports = {
  secret: 'ash80gossamer30',
  knex: knex,
  foddb: fodDb,
  influxClient: influxClient,
  // InfluxnodeClient: InfluxnodeClient,
  miniQuery: miniQuery
}
