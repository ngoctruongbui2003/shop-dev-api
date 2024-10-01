require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const myLogger = require('./loggers/mylogger.log')
const app = express()

// cors
// const corsOptions = {
//     origin: 'localhost:3000',
//     methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE'],
//     credentials: true,
//     optionsSuccessStatus: 204
// }

// app.use(cors(corsOptions))

// init middlewares
app.use(morgan("dev"))	
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extends: true
}))

app.use((req, res, next) => {
    const requestId = req.header['x-request-id']
    req.requestId = requestId || uuidv4()

    myLogger.log(`input params :: ${req.method}`, [
        req.path,
        { requestId: req.requestId },
        req.method === 'POST' ? req.body : req.query
    ])

    next()
})


// init database
require('./dbs/init.mongodb')
// const { checkOverloadConnect } = require('./helpers/check.connect')
// checkOverloadConnect()

// init routes
app.use('', require('./routers'))

// handling error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    const resMessage = `${statusCode} - ${Date.now}ms - Response: ${JSON.stringify(err.message)}`

    myLogger.error(resMessage, [
        req.path,
        { requestId: req.requestId },
        {
            message: err.message,
        }
    ])

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: err.message || 'Internal Server Error',
        // stack: err.stack
    })
})

module.exports = app