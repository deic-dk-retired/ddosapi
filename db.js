require('dotenv').config()
const chalk = require('chalk')
const promise = require('bluebird')
const path = require('path')
const Influxnode = require('influxdb-nodejs')
const InfluxnodeClient = new Influxnode('http://' + process.env.IF_HOST + ':8086/' + process.env.IF_SCHEMA)
const Influx = require('influx')
const influxClient = new Influx.InfluxDB({
  host: process.env.IF_HOST,
  database: process.env.IF_SCHEMA
})
const options = {
  promiseLib: promise
}
const pgp = require('pg-promise')(options)
const connectStringFod =
  process.env.RU_DBC + ':' +
  process.env.RU_USER + ':' +
  process.env.RU_PWD + '@' +
  process.env.RU_HOST + '/' +
  process.env.RU_SCHEMA
var fodDb = pgp(connectStringFod)

/**
 *  check connection for postgre sql
 */
fodDb.connect()
.then((obj) => {
  console.log(chalk.hex('#EC407A')('listening on ' + obj.client.database + ' using pg-promise'))
})
.catch((err) => {
  console.log(chalk.red('Error:', err))
})
/**
 * check for db graphite on influxdb and show all the dbs listening on
 */
influxClient.getDatabaseNames()
.then((names) => {
  console.log(chalk.hex('#26A69A')('stream1: ' + names.join(', ')))
  if (!names.includes('graphite')) {
    console.log(chalk.redBright('graphite not found, please check the db named grahite exists at' + process.env.IF_HOST + ':8083'))
  } else {
    console.log(chalk.hex('#039BE5')('Listening on graphite using influx'))
  }
})
.catch((err) => {
  console.error('Error looking up graphite unsing influx!')
  return err.message
})

/**
 * check for db graphite on influxdb and show all the dbs listening on
 */
InfluxnodeClient.showDatabases()
.then((names) => {
  console.log(chalk.hex('#00897B')('stream2: ' + names.join(', ')))
  if (!names.includes('graphite')) {
    console.log(chalk.redBright('graphite not found, please check the db named grahite exists at' + process.env.IF_HOST + ':8083'))
  } else {
    console.log(chalk.hex('#0277BD')('Listening on graphite using influxdb-nodejs'))
  }
})
.catch((err) => {
  console.error('Error looking up graphite using influxdb-nodejs!')
  return err.message
})

let miniQuery = (file) => {
  const fullPath = path.join(__dirname, file)
  return pgp.QueryFile(fullPath, {minify: true, noWarnings: true})
}

const db = {
  foddb: fodDb,
  influxClient: influxClient,
  // InfluxnodeClient: InfluxnodeClient,
  miniQuery: miniQuery,
  promise: promise,
  chalk: chalk
}
module.exports = db
