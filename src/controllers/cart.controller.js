'use strict'

const CartService = require("../services/cart.service")

class CartController {
    createUserCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Cart success!',
            metadata: await CartService.createUserCart({
                userId: req.user.userId,
                product: req.body
            })
        }).send(res)
    }
}

module.exports = new CartController()
