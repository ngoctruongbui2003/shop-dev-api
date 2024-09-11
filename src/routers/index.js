'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

router.get('/api/checkstatus', (req, res) => {
    return res.status(200).json({
        status: 'check status done',
        code: 200,
        message: 'WSV eCommerce is running'
    })
})

// check apiKey
router.use(apiKey)

// check permission
router.use(permission('0000'))

router.use('/v1/api/shop', require('./access'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/order', require('./rbac'))

module.exports = router
