'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils/index')
const { BadRequestError, AuthFailureError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

const RoleShop = {
	SHOP: 'SHOP',
	WRITTER: 'WRITTER',
	EDITOR: 'EDITOR',
	ADMIN: 'ADMIN',
}

class AccessService {

	static logout = async (keyStore) => {
		console.log(keyStore._id);
		const delKey = await KeyTokenService.removeKeyById(keyStore._id)
		console.log({ delKey });

		return delKey
	}

	static login = async ({ email, password, refreshToken = null }) => {
		// 1. Check email in dbs
		const foundShop = await findByEmail({ email })
		if (!foundShop) throw new BadRequestError('Shop not registered')

		// 2. Match password
		const match = bcrypt.compare(password, foundShop.password)
		if (!match) throw new AuthFailureError('Authentication error')
		
		// 3. Create AT (Access token) and RT (Refresh Token) and save
		// Create publicKey and privateKey
		const publicKey = crypto.randomBytes(64).toString('hex')
		const privateKey = crypto.randomBytes(64).toString('hex')

		// 4. Generate tokens
		const userId = foundShop._id

		const tokens = await createTokenPair(
			{ userId, email },
			publicKey,
			privateKey
		)

		await KeyTokenService.createKeyToken({
			userId,
			refreshToken: tokens.refreshToken,
			privateKey,
			publicKey,
		})

		// 5. Get data return login
		return {
			shop: getInfoData({
				fields: ['_id', 'name', 'email'],
				object: foundShop
			}),
			tokens
		} 
	}

	static signUp = async ({ name, email, password }) => {
		// Step 1: Check email exists?
		const holderShop = await shopModel.findOne({ email }).lean()

		// --- Email exists ----
		if (holderShop) {
			throw new BadRequestError('Error: Shop already registered!')
		}

		// --- Email not exists ---

		// Step 2: Hash password
		const passwordHash = await bcrypt.hash(password, 10)
		
		// Create a new shop
		const newShop = await shopModel.create({
			name, email, password: passwordHash, roles: [RoleShop.SHOP]
		})

		// --- Create new shop FAIL --- 
		if (!newShop) {
			throw new BadRequestError('Error: Create new shop failed!')
		}
		// --- Create new shop SUCCESS --- 

		// Create privateKey and publicKey

		// const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
		// 	modulusLength: 4096,
		// 	publicKeyEncoding: {
		// 		type: 'pkcs1',
		// 		format: 'pem'
		// 	},
		// 	privateKeyEncoding: {
		// 		type: 'pkcs1',
		// 		format: 'pem'
		// 	},
		// })

		const publicKey = crypto.randomBytes(64).toString('hex')
		const privateKey = crypto.randomBytes(64).toString('hex')

		console.log({ privateKey, publicKey }); // save collection KeyStore

		const keyStore = await KeyTokenService.createKeyToken({
			userId: newShop._id,
			publicKey,
			privateKey
		})

		if (!keyStore) {
			throw new BadRequestError('Error: KeyStore error!')
		}

		// const publicKeyObject = crypto.createPublicKey(publicKeyString)

		// created token pair
		const tokens = await createTokenPair(
			{ userId: newShop._id, email },
			publicKey,
			privateKey
		)
		console.log(`Created Token Success::`, tokens);
		
		return {
			shop: getInfoData({
				fields: ['_id', 'name', 'email'],
				object: newShop
			}),
			tokens
		}
	}

}

module.exports = AccessService