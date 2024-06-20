'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

// Sign up
router.post('/signup', asyncHandler(accessController.signUp))
router.post('/login', asyncHandler(accessController.login))

// Authentication
router.use(authentication)
router.post('/logout', asyncHandler(accessController.logout))
router.post('/refreshToken', asyncHandler(accessController.handleRefreshToken))


module.exports = router