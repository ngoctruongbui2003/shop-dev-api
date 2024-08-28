'use strict'

const express = require('express')
const uploadController = require('../../controllers/upload.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const { uploadDisk } = require('../../config/multer.config')
const router = express.Router()

router.post('/product', asyncHandler(uploadController.uploadImageFromUrl))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))
router.post('/product/multiple', uploadDisk.array('files', 3), asyncHandler(uploadController.uploadImageFromLocalFiles))


module.exports = router