'use strict'

// !dmbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Otp'
const COLLECTION_NAME = 'Otps'

// Declare the Schema of the Mongo model
var otpSchema = new Schema({
    otp_token: { type: String, required: true },
    otp_email: { type: String, required: true },
    otp_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    expireAt: { type: Date, default: Date.now, index: { expires: 60 * 2 } }
}, {
	timestamps: true,
	collection: COLLECTION_NAME,
});

//Export the model
module.exports = model(DOCUMENT_NAME, otpSchema);