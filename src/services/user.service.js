'use strict'

const USER = require('../models/user.model');
const { ErrorResponse } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');
const { sendEmailToken } = require('./email.service');
const { checkEmailToken } = require('./otp.service');

const newUser = async ({
    email = null,
    capcha = null
}) => {
    // 1. check email exist in database
    const user = USER.findOne({ usr_email: email }).lean();

    // 2. if user exist return error
    if (user) {
        return ErrorResponse({
            message: 'User already exist'
        })
    }

    // 3. send token via email user
    const res = sendEmailToken({ email });

    return {
        message: 'Verify email user',
        metadata: {
            token: res
        }
    }
}

const checkLoginEmailToken = async ({
    token
}) => {
    try {
        // 1. check token in otp model
        const { otp_email: email, otp_token } = await checkEmailToken({ token }); 
        if (!email) throw new ErrorResponse('Email not found in token');

        // 2. check email in user model
        const hasUser = await findUserByEmailWithLogin({ email });
        if (hasUser) throw new ErrorResponse('Email already exist');

        // 3. create new user
        const passwordHash = await bcrypt.hash(email, 10)
		// Create a new shop
		const newShop = await USER.create({
			usr_id: 1,
            usr_slug: 'xyzavc',
            usr_name: email,
            usr_password: passwordHash,
            usr_role: [],
		})
		if (!newShop) {
			throw new BadRequestError('Error: Create new shop failed!')
		}

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

    } catch (error) {
        throw new ErrorResponse(error.message);
    }
}

const findUserByEmailWithLogin = async ({ email }) => {
    const user = await USER.findOne({ usr_email: email }).lean();
    return user;
}

module.exports = {
    newUser,
    checkLoginEmailToken
}