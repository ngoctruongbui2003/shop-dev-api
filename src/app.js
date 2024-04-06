const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

// init database
require('./dbs/init.mongodb')

// init routes
app.get('/', (req, res, next) => {
	const strCompression = "Hello Ngoc Truong Bui"

	return res.status(200).json({
		message: 'Welcome Truong Bui',
		metadata: strCompression.repeat(10000)
	})
})

// handle error

module.exports = app