'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response")
const discount = require("../models/discount.model")
const { product } = require("../models/product.model")
const { findAllDiscountCodeUnSelect, findDiscount, updateDiscountById } = require("../models/repositories/discount.repo")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectId, removeUndefinedObject } = require("../utils")

/**
    Discount Services
    1 - Generate Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify Discount Code [User]
    5 - Delete Discount Code [Shop | Admin]
    6 - Cancel Discount Code [User]
 */

class DiscountService {
    static async createDiscountCode(payload) {
        // Generate discount code
        const {
            code, start_date, end_date, is_active,
            shopId, min_order, product_ids, applies_to,
            name, description, type, max_value, max_uses,
            max_user_per_user
        } = payload

        if (new Date() > new Date(start_date)){
            throw new BadRequestError('Discount start date cannot be in the past')
        }

        if (Date(start_date) < Date(end_date)){
            throw new BadRequestError('Discount start date cannot be greater than end date')
        }
        
        const foundDiscount = await findDiscount({
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectId(shopId),
            }
        })

        if (foundDiscount && foundDiscount.discount_is_active){
            throw new BadRequestError('Discount code already exists')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: max_value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_max_uses_per_user: max_user_per_user,
            discount_users_used: [],
            discount_used_count: 0,
            discount_min_order_value: min_order || 0,
            discount_shopId: convertToObjectId(shopId),
            discount_is_active: is_active,
            discount_apply_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }

    static async updateDiscountCode(discount_id, payload) {
        const objectParams = removeUndefinedObject(payload)
        return await updateDiscountById({
            discount_id,
            payload: objectParams,
        })
    }

    static async getAllDiscountCodeWithProduct({
        code, shopId, limit = 50, page = 1
    }) {
        const shopObjectId = convertToObjectId(shopId)

        // create index for discount code
        const foundDiscount = await findDiscount({
            filter: {
                discount_code: code,
                discount_shopId: shopObjectId,
            }
        })

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount code does not exist')
        }
        
        let products

        const { discount_apply_to, discount_product_ids } = foundDiscount
        if (discount_apply_to === 'all') {
            // Get all product
            products = await findAllProducts({
                filter: {
                    product_shop: shopObjectId,
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        } else if (discount_apply_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }

    static async getAllDiscountCodeByShop({
        shopId, limit = 50, page = 1, 
    }) {
        const discounts = await findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page,
            filter: { 
                discount_shopId: convertToObjectId(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId']
        })

        return discounts
    }

    static async getDiscountAmount({
        codeId, userId, shopId, products
    }) {
        const foundDiscount = await findDiscount({
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectId(shopId),
            }
        })

        if (!foundDiscount) {
            throw new NotFoundError('Discount code does not exist')
        }

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_start_date,
            discount_value,
            discount_end_date
        } = foundDiscount

        if (!discount_is_active) throw new BadRequestError('Discount code has been unactive')
        if (discount_max_uses <= 0) throw new BadRequestError('Discount code has been exhausted')

        if (new Date() > new Date(discount_end_date)){
            throw new BadRequestError('Discount code has expired')
        }

        var totalOrder = 0
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + product.price*product.quantity
            }, 0)

            console.log('AAAAAAAAAAA', totalOrder);
            console.log('products', products);
        }

        if (totalOrder < discount_min_order_value) {
            throw new BadRequestError('Order value is less than minimum order value')
        }

        if (discount_max_uses_per_user > 0) {
            const userUsed = discount_users_used.find(user => user === userId)
            if (userUsed && userUsed.length >= discount_max_uses_per_user) {
                throw new BadRequestError('You have used this discount code')
            }
        }

        console.log('discount_min_order_value', discount_min_order_value);

        const amount = discount_type === 'fixed_amount' 
                    ? discount_value 
                    : totalOrder*(1 - discount_value/100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({
        shopId, codeId
    }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectId(shopId)
        })

        return deleted
    }

    static async cancelDiscountCode({
        codeId, shopId, userId
    }){
        const foundDiscount = await findDiscount({
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectId(shopId),

            }
        })

        if (!foundDiscount) {
            throw new NotFoundError('Discount code does not exist')
        }

        const result = await discount.updateOne(foundDiscount._id,{
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_used_count: -1
            }
        })

        return result
    }
}

module.exports = DiscountService
