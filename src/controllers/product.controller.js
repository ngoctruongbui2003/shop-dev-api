'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
	createProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Create new Product success!',
			metadata: await ProductService.createProduct(
				req.body.product_type,
				{
					...req.body,
					product_shop: req.user.userId
				}
			)
		}).send(res)
	}

	updateProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Update Product success!',
			metadata: await ProductService.updateProduct(
				req.body.product_type,
				req.params.productId,
				{
					...req.body,
					product_shop: req.user.userId
				}
			)
		}).send(res)
	}

	publishedProductByShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Update publish product success!',
			metadata: await ProductService.publishedProductByShop({
				product_id: req.params.id,
				product_shop: req.user.userId
			})
		}).send(res)
	}

	unPublishedProductByShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Update unpublish product success!',
			metadata: await ProductService.unPublishedProductByShop({
				product_id: req.params.id,
				product_shop: req.user.userId
			})
		}).send(res)
	}

	// QUERY

	/**
	 * @description Get all Drafts for shop
	 * @param { Number } limit
	 * @param { Number } skip
	 * @return { JSON }
	 */
	getAllDraftsForShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get list Draft success!',
			metadata: await ProductService.findAllDraftsForShop({
				product_shop: req.user.userId
			})
		}).send(res)
	}

	getAllPublishForShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get list Publish success!',
			metadata: await ProductService.findAllPublishForShop({
				product_shop: req.user.userId
			})
		}).send(res)
	}

	getListSearchProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get list search success!',
			metadata: await ProductService.searchProductByUser(req.params)
		}).send(res)
	}

	findAllProducts = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get list all products success!',
			metadata: await ProductService.findAllProducts(req.query)
		}).send(res)
	}

	findProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get product success!',
			metadata: await ProductService.findProduct({
				product_id: req.params.product_id
			})
		}).send(res)
	}

	// END QUERY
}

module.exports = new ProductController()