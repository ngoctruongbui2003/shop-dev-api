'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required
const slugify = require('slugify')

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
    product_slug: String,
    product_shop: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    //more
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    isDraf: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },

}, {
	timestamps: true,
	collection: COLLECTION_NAME,
});

// Create index for search
productSchema.index({ product_name: 'text', product_descriptions: 'text' })

// Document middleware: run before .save() and .create() etc
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

// Define the product type = clothing
const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
	collection: COLLECTION_NAME_CLOTHING,
})

// Define the product type = electronic
const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
	collection: COLLECTION_NAME_ELECTRONIC,
})

// Define the product type = furniture
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