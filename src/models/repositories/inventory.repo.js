'use strict'

const { inventory } = require("../inventorymodel")
const { Types } = require('mongoose')

const insertInventory = async ({
    productId,
    location = 'unKnown',
    stock,
    shopId,
}) => {
    return await inventory.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_location: location,
        inven_stock: stock,
    })
}

module.exports = {
    insertInventory
}
