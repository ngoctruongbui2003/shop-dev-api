'use strict'

const USER = require('../models/user.model')

const createUser = async ({
    usr_id,
    usr_slug,
    usr_name,
    usr_password,
    usr_role
}) => {
    const newUser = await USER.create({
        usr_id,
        usr_slug,
        usr_name,
        usr_password,
        usr_role
    })

    return newUser
}

module.exports = {
    createUser
}