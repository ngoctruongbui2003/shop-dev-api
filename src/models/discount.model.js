'use strict'

const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount', enum: ['fixed_amount', 'percentage'] },
    discount_value: { type: Number, required: true }, // 10.000 or 10%
    discount_code: { type: String, required: true }, 
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true }, // the number discount can be used
    discount_max_uses_per_user: { type: Number, required: true }, // the number discount can be used per user
    discount_users_used: { type: Array, default: [] }, // the users who have used the discount
    discount_used_count: { type: Number, required: true }, // the users who have used the discount
    discount_min_order_value: { type: Number, required: true }, // the minimum order value to use the discount
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    discount_is_active: { type: Boolean, default: true },
    discount_apply_to: { type: String, default: 'all', enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] }, // the products the discount applies to
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
