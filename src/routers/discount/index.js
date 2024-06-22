'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.constroller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.get('/', asyncHandler(discountController.getAllDiscountCodeWithProduct))
router.get('/list-discount/:shopId', asyncHandler(discountController.getAllDiscountCodeByShop))
router.get('/amount', asyncHandler(discountController.getDiscountAmount))

// Authentication
router.use(authentication)
/////////////////
router.post('', asyncHandler(discountController.createDiscountCode))
// router.post('cancel-discount', asyncHandler(discountController.cancelDiscountCode))
router.patch('/:discountId', asyncHandler(discountController.updateDiscountCode))
router.delete('/:codeId', asyncHandler(discountController.deleteDiscountCode))
// router.patch('/:discountId', asyncHandler(discountController.updateDiscountCode))


module.exports = router