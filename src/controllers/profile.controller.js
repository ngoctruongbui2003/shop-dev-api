'use strict'

const { SuccessResponse } = require('../core/success.response');

class ProfileController {
    // admin    
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: 'View all profiles!',
            metadata: [

            ]
        }).send(res);
    }

    // shop    
    profile = async (req, res, next) => {
        new SuccessResponse({
            message: 'View shop profile!',
            metadata: {

            }
        }).send(res);
    }
}

module.exports = new ProfileController();
