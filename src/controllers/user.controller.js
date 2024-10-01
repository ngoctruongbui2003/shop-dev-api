'use strict'

const { SuccessResponse } = require("../core/success.response");
const { newUser, checkLoginEmailToken } = require("../services/user.service");

class UserController {
    // new user
    newUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'User created',
            metadata: await newUser(req.body.email)
        }).send(res)
    }

    // check user token via email
    checkRegisterEmailToken = async (req, res) => {
        
    }

    checkLoginEmailToken = async (req, res) => {
        new SuccessResponse({
            message: 'User created',
            metadata: await checkLoginEmailToken(req.body.email)
        }).send(res)
    }
}

module.exports = new UserController();