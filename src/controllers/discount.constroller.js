'use strict'

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {

	createDiscountCode = async (req, res, next) => {
		new SuccessResponse({
			message: 'Create discount code success!',
			metadata: await DiscountService.createDiscountCode({
                ...req.body,
                discount_shopId: req.user.userId
            })
		}).send(res)
	}

    updateDiscountCode = async (req, res, next) => {
		new SuccessResponse({
			message: 'Update discount code success!',
			metadata: await DiscountService.updateDiscountCode(
                req.params.discountId,
                {
                    ...req.body,
                    discount_shopId: req.user.userId
                }
            )
		}).send(res)
	}

    getAllDiscountCodeWithProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get discount code success!',
			metadata: await DiscountService.getAllDiscountCodeWithProduct({
				...req.body
            })
		}).send(res)
	}

	getAllDiscountCodeByShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get discount code by shop success!',
			metadata: await DiscountService.getAllDiscountCodeByShop({
                shopId: req.params.shopId
            })
		}).send(res)
	}

	getDiscountAmount = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get discount amount success!',
			metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
		}).send(res)
	}

	deleteDiscountCode = async (req, res, next) => {
		new SuccessResponse({
			message: 'Delete discount code success!',
			metadata: await DiscountService.deleteDiscountCode({
                shopId: req.user.userId,
				codeId: req.params.codeId
            })
		}).send(res)
	}

	cancelDiscountCode = async (req, res, next) => {
		new SuccessResponse({
			message: 'Cancel discount code success!',
			metadata: await DiscountService.cancelDiscountCode({
				...req.body,
            })
		}).send(res)
	}

}

module.exports = new DiscountController()