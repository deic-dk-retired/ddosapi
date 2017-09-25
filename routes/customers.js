var express = require('express')
var openRouter = express.Router()

var customers = require('../customers')

// openRouter.get('/')

/**
map urls to functions
for customers
*/
openRouter.get('/customers', customers.getAllCustomers)
openRouter.get('/customers/:customerid', customers.getOneCustomer)
openRouter.get('/customers/:customerid/relationships/networks', customers.getCustomerNetworks)
openRouter.get('/customers/:customerid/networks', customers.getCustomerNetworks)
openRouter.get('/networks', customers.getAllNetworks)
openRouter.patch('/networks', customers.createNetwork)
/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
