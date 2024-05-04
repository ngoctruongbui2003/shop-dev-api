'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils/index')

const RoleShop = {
	SHOP: 'SHOP',
	WRITTER: 'WRITTER',
	EDITOR: 'EDITOR',
	ADMIN: 'ADMIN',
}

class AccessService {
	static signUp = async ({ name, email, password }) => {
		try {
			// Step 1: Check email exists?
			const holderShop = await shopModel.findOne({ email }).lean()

			// --- Email exists ----
			if (holderShop) {
				return {
					code: 'xxxx',
					message: 'Shop already registered!'
				}
			}

			// --- Email not exists ---

			// Step 2: Hash password
			const saltRounds = 10
			const passwordHash = await bcrypt.hash(password, saltRounds)
			
			// Create a new shop
			const newShop = await shopModel.create({
				name, email, password: passwordHash, roles: [RoleShop.SHOP]
			})

			// --- Create new shop FAIL --- 
			if (!newShop) {
				return {
					code: '200',
					metadata: null,
				}
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
				return {
					code: 'xxxx',
					message: 'keyStore error'
				}
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
				code: 201,
				metadata: {
					shop: getInfoData({
						fields: ['_id', 'name', 'email'],
						object: newShop
					}),
					tokens
				}
			}

		} catch (error) {
			return {
				code: 'xxx',
				message: error.message,
				status: 'error'
			}
		}
	}
}

module.exports = AccessService