'use strict'

const { product, electronic, clothing, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const {
    findAllDraftsForShop,
    publishedProductByShop,
    unPublishedProductByShop, 
    searchProductByUser,
    findAllPublishForShop,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../models/repositories/product.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.repo')
const { pushNotification } = require('./notification.service')

// define Factory class to create product
class ProductFactory {
    /**
     * type: 'Clothing',
     * payload
     */
    static productRegistry = {} // key-class

    static registerProductType(type, classRef) {
        this.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        // switch(type) {
        //     case 'Electronics':
        //         return new Electronic(payload).createProduct()
        //     case 'Clothing':
        //         return new Clothing(payload).createProduct()
        //     case 'Furniture':
        //         return new Furniture(payload).createProduct()
        //     default:
        //         throw new BadRequestError(`Invalid Product Types ${type}`)
        // }

        const productClass = this.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        
        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, product_id, payload) {
        const productClass = this.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        
        return new productClass(payload).updateProduct(product_id)
    }

    // PUT
    static async publishedProductByShop({ product_shop, product_id }) {
        return await publishedProductByShop({ product_shop, product_id })
    }

    static async unPublishedProductByShop({ product_shop, product_id }) {
        return await unPublishedProductByShop({ product_shop, product_id })
    }
    // END PUT

    // QUERY
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraf: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        
        return await findAllPublishForShop({ query, limit, skip })
    } 

    static async searchProductByUser({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, page, filter,
            select: ['product_name', 'product_thumb', 'product_price']})
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v']})
    }

}

// define base product class
class Product {
    constructor({
        product_name, product_thumb, product_descriptions,
        product_price, product_quantity, product_type,
        product_shop, product_attributes,
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_descriptions = product_descriptions
        this.product_price = product_price
        this.product_type = product_type
        this.product_quantity = product_quantity
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create new product 
    async createProduct(product_id){
        const newProduct = await product.create({
            ...this,
            _id: product_id
        })
        if (newProduct) {
            // Add product_stock in inventory collection
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })

            // Push notification to system collection
            pushNotification({
                type: 'SHOP-001',
                receivedId: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shop_name: this.product_shop
                }
            }).then((newNoti) => console.log(newNoti))
            .catch((err) => console.log(err))
        }

        return newProduct
    }

    async updateProduct(product_id, payload) {
        return await updateProductById({ product_id, payload, model: product })
    }

    // HELPER
    async updateProductHelper(product_id, model) {
        const objectParams = removeUndefinedObject(this);
        const payload_model = updateNestedObjectParser(objectParams.product_attributes)

        if (objectParams.product_attributes) {
            await updateProductById({
                product_id,
                payload: payload_model,
                model
            });
        }

        return objectParams
    }
}

// define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('create new Clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('create new Product error')

        return newProduct
    }

    async updateProduct(product_id) {
        const objectParams = await this.updateProductHelper(product_id, clothing);
        const payload = updateNestedObjectParser(objectParams)

        const updateProduct = await super.updateProduct(
            product_id,
            payload
        );

        return updateProduct;
    }
}

// define sub-class for different product types Electronics
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({ 
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('create new Electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('create new Product error')

        return newProduct
    }

    async updateProduct(product_id) {
        const objectParams = await this.updateProductHelper(product_id, electronic);
        const payload = updateNestedObjectParser(objectParams)

        const updateProduct = await super.updateProduct(
            product_id,
            payload
        );

        return updateProduct;
    }
}

// define sub-class for different product types Electronics
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({ 
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('create new Furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('create new Product error')

        return newProduct
    }

    async updateProduct(product_id) {
        const objectParams = await this.updateProductHelper(product_id, furniture);
        const payload = updateNestedObjectParser(objectParams)

        const updateProduct = await super.updateProduct(
            product_id,
            payload
        );

        return updateProduct;
    }
}

ProductFactory.registerProductType('Electronics', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory
