'use strict'

const apiKeyModel = require('../models/apikey.model')

const findById = async (key) => {
    // const newApiKey = await apiKeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permissions: ['0000'] })
    // console.log(`New apiKey::`, newApiKey);

    const objKey = await apiKeyModel.findOne({ key, status: true }).lean()

    return objKey
}

module.exports = {
    findById
}