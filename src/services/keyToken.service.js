'use strict'

const keyTokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken = null }) => {
        try {
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey : null

            const filter = { user: userId }
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            }
            const options = { upsert: true, new: true }

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null

        } catch (error) {
            return error
        }
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne(id)
    }

    static deleteKeyByUserId = async (userId) => {
        return await keyTokenModel.findByIdAndDelete({ user: userId })
    }

    static findByUserId = async (userId) => {
        const userIdObj = new Types.ObjectId(userId)
        const foundByUserId = await keyTokenModel.findOne({ user: userIdObj }).lean()

        return foundByUserId
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken })
    }
}

module.exports = KeyTokenService
