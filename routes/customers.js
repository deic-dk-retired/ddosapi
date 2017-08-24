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

/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
