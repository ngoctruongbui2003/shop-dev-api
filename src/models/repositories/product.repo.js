'use strict'

const { getSelectData, unGetSelectData } = require('../../utils');
const { product, electronic, clothing, furniture } = require('../product.model')
const { Types: { ObjectId } } = require('mongoose');

const findAllDraftsForShop = async({ query, skip, limit }) => {
    return await queryProduct({ query, skip, limit })
}

const findAllPublishForShop = async({ query, skip, limit }) => {
    return await queryProduct({ query, skip, limit })
}

const findAllProducts = async({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return products
}

const findProduct = async({ product_id, unSelect = {} }) => {
    return await product.findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean()
}

const updateProductById = async({ product_id, payload, model, isNew = true }) => {
    return await model.findByIdAndUpdate(product_id, payload, { new: isNew })
}

const searchProductByUser = async({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const result = await product.find({
        isPublished: true,
        $text: { $search: regexSearch }
    }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .lean()

    return result
}

const publishedProductByShop = async({ product_shop, product_id }) => {
    console.log(`publishedProductByShop::`, product_shop, product_id)
    const foundShop = await product.findOne({
        product_shop: new ObjectId(product_shop),
        _id: new ObjectId(product_id),
    })

    if (!foundShop) return null

    foundShop.isDraf = false
    foundShop.isPublished = true

    await foundShop.save()

    return foundShop
}

const unPublishedProductByShop = async({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new ObjectId(product_shop),
        _id: new ObjectId(product_id),
    })

    if (!foundShop) return null

    foundShop.isDraf = true
    foundShop.isPublished = false

    await foundShop.save()

    return foundShop
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
                .populate('product_shop', 'name email -_id')
                .sort({ updateAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec()
}

const checkProductByServer = async(products) => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await product.findById(product.productId)
        if (foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId
            }
        }
    }))
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishedProductByShop,
    unPublishedProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    checkProductByServer
}
