'use strict'

const { AuthFailureError } = require('../core/error.response');
const { roleList } = require('../services/rbac.service');
const rbac = require('./role.middleware');

/**
 * 
 * @param {string} action // read, delete, update, create 
 * @param {*} resource // profile, video
 */
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            rbac.setGrants(await roleList({
                userId: 999
            }));
            const role_name = req.query.role;
            const permission = rbac.can(role_name)[action](resource);
            if (!permission.granted) {
                throw new AuthFailureError('Permission denied.');
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = {
    grantAccess
}
