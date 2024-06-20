'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const DOCUMENT_NAME_ELECTRONIC = 'Electronic'
const COLLECTION_NAME_ELECTRONIC = 'Electronics'
const DOCUMENT_NAME_CLOTHING = 'Clothing'
const COLLECTION_NAME_CLOTHING = 'Clothings'
const DOCUMENT_NAME_FURNITURE = 'Furniture'
const COLLECTION_NAME_FURNITURE = 'Furnitures'

// Declare the Schema of the Mongo model
const productSchema = new Schema({
	product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_descriptions: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_attributes: { type: Schema.Types.Mixed, required: true }

}, {
	timestamps: true,
	collection: COLLECTION_NAME,
});

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
	collection: COLLECTION_NAME_CLOTHING,
})

const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
	collection: COLLECTION_NAME_ELECTRONIC,
})

const furnitureSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
	collection: COLLECTION_NAME_FURNITURE,
})

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model(DOCUMENT_NAME_ELECTRONIC, electronicSchema),
    clothing: model(DOCUMENT_NAME_CLOTHING, clothingSchema),
    furniture: model(DOCUMENT_NAME_FURNITURE, furnitureSchema),
}