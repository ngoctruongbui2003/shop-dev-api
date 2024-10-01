'use strict'

// !dmbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Template'
const COLLECTION_NAME = 'Templates'

// Declare the Schema of the Mongo model
var templateSchema = new Schema({
    tem_id: { type: Number, required: true },
    tem_name: { type: String, required: true },
    tem_status: { type: String, default: 'active', enum: ['active', 'inactive'] },
    tem_html: { type: String, required: true },
}, {
	timestamps: true,
	collection: COLLECTION_NAME,
});

//Export the model
module.exports = model(DOCUMENT_NAME, templateSchema);