'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-refresh-token'
}

const createTokenPair = async ( payload, publicKey, privateKey ) => {
    try {
        // access token
        const accessToken = await JWT.sign( payload, publicKey, {
            expiresIn: '2 days'
        } )

        // refresh token
        const refreshToken = await JWT.sign( payload, privateKey, {
            expiresIn: '7 days'
        } )
        
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`Error verify::`, err)
            } else {
                console.log(`Decode verify::`, decode);
            }
        })

        return { accessToken, refreshToken }

    } catch (error) {
        return error
    }
}

const authentication = asyncHandler( async (req, res, next) => {
    // 1. Check userId missing
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid request')
    
    // 2. Get accessToken
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore')

    // 3. Verify token
    const refreshToken = req.headers[HEADER.REFRESHTOKEN]
    if (refreshToken) {
        try {
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken

    
            return next()
        } catch (error) {
            throw error
        }
    }


    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError('Invalid userId')
        }
        req.keyStore = keyStore

        return next()
    } catch (error) {
        throw error
    }
} )

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}
