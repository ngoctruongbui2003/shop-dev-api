'use strict'

const { cart } = require("../models/cart.model")
const { findProduct } = require("../models/repositories/product.repo")
const { NotFoundError } = require("../core/error.response")

/**
    Key features: Cart service
    - Add product to cart [User]
    - Reduce product quanlity by one [User]
    - Increase product quanlity by one [User]
    - Get cart [User]
    - Delete cart [User]
    - Delete cart time [User]
 */

class CartService {
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId },
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            },
        },
        options = { upsert: true, new: true }

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            cart_userId: userId,
            cart_state: "active",
            'cart_products.productId': productId
        },
        update = {
            $inc: {
                "cart_products.$.quantity": quantity
            },
        },
        options = { upsert: true ,new: true }

        return await cart.findOneAndUpdate(query, update, options)
    }

    static async addToCart({ userId, product = {} }) {
        // Check cart exist
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            return await this.createUserCart({ userId, product })
        }

        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        return await this.updateUserCartQuantity({ userId, product })
    }

    /**
        shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId,
                    }
                ],
                version
            }
        ]
     */
    static async addtoCartV2({ userId, product = {} }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

        // check product
        const foundProduct = await findProduct(productId)
        if (!foundProduct) throw new NotFoundError("Product not found")

        // compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError("Product do not belong to the shop")
        }

        if (quantity === 0) {
            // delete product from cart
        }

        return await this.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({ userId, productId }) {
        const query = {
            cart_userId: userId,
            cart_state: "active"
        },
        update = {
            $pull: {
                cart_products: { productId }
            }
        }

        const deleteCart = await cart.updateOne(query, update)

        return deleteCart
    }

    static async getListCart({ userId }) {
        return await cart.findOne({
            cart_userId: userId
        }).lean()
    }
}

moudle.exports = CartService
