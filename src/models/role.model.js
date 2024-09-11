'use strict'

// !dmbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'Roles'

// const grantList = [
//     { role: 'admin', resource: 'profile', action: 'update:any', attributes: '*' },
//     { role: 'admin', resource: 'balance', action: 'update:any', attributes: '*, !mount' },

//     { role: 'shop', resource: 'profile', action: 'update:own', attributes: '*' },
//     { role: 'shop', resource: 'balance', action: 'update:own', attributes: '*, !mount' },

//     { role: 'user', resource: 'profile', action: 'update:own', attributes: '*' },
//     { role: 'user', resource: 'profile', action: 'update:own', attributes: '*' },
// ]

// Declare the Schema of the Mongo model
var roleSchema = new Schema({
    rol_name: { type: String, default: 'user', enum: ['user', 'shop', 'admin'] },
    rol_slug: { type: String, required: true },
    rol_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    rol_description: { type: String, default: '' },
    rol_grants: [
        {
            resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
            actions: [{ type: String, required: true }],
            attributes: { type: String, default: '*' },
        }
    ]
}, {
	timestamps: true,
	collection: COLLECTION_NAME,
});

//Export the model
module.exports = model(DOCUMENT_NAME, roleSchema);