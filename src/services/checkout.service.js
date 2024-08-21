'use strict'

const { BadRequestError } = require("../core/error.response")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")

class CheckoutService {

    // login and without login
    /*
        {
            cartId,
            userId,
            shop_order_ids = [
                {
                    shopId,
                    shop_discount: [
                        {
                            shopId,
                            discountId,
                            codeId
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
    */
    
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }) {
        // check cartId exist
        const foundCart = await findCartById({ cartId })
        if (!foundCart) throw new BadRequestError('Cart does not exist')

        const checkout_order = {
            totalPrice: 0, // total price of all products
            feeShip: 0, // fee ship
            totalDiscount: 0, // total discount
            totalCheckout: 0, // total price after discount
        }, shop_order_ids_new = []

        // calculate total price of all products
        for (let i=0; i<shop_order_ids.length; i++) {
            const { shopId, item_products = [], shop_discounts = [] } = shop_order_ids[i]

            // check product availabel
            const checkProductServer = await checkProductByServer(item_products)
            if (!checkProductByServer[0]) throw new BadRequestError('Order wrong!!!')

            const checkoutPrice = checkProductServer.reduce((total, product) => {
                return total + (product.price * product.quantity)
            }, 0)

            // total before handle
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // before discount
                priceApplyDiscount: checkoutPrice, // after discount
                item_products: checkProductServer
            }

            // if shop_discount exist, check discount 
            if (shop_discounts.length > 0) {
                // if only one discount
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0],
                    userId,
                    shopId,
                    products: checkProductServer
                })

                // total discount
                checkout_order.totalPrice += discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // final total price
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}

module.exports = CheckoutService