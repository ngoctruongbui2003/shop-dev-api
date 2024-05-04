require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

// init middlewares
app.use(morgan("dev"))	
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extends: true
}))


// init database
require('./dbs/init.mongodb')
const { checkOverloadConnect } = require('./helpers/check.connect')
// checkOverloadConnect()

// init routes
app.use('', require('./routers'))

// handle error

module.exports = app