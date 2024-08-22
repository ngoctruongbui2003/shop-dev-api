'use strict'

const express = require('express')
const notiController = require('../../controllers/notification.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.use(authentication)

router.get('', asyncHandler(notiController.listNotiByUser))


module.exports = router