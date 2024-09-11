'use strict'

const { SuccessResponse } = require("../core/success.response");
const { createResource, roleList, resourceList, createRole } = require("../services/rbac.service");

class RbacController {
    newRole = async (req, res, next) => {
        new SuccessResponse({
            message: 'Role created!',
            metadata: await createRole(req.body)
        }).send(res)
    }

    newResource = async (req, res, next) => {
        new SuccessResponse({
            message: 'Resource created!',
            metadata: await createResource(req.body)
        }).send(res)
    }

    listRoles = async (req, res, next) => {
        new SuccessResponse({
            message: 'List of roles',
            metadata: await roleList(req.body)
        }).send(res)
    }

    listResources = async (req, res, next) => {
        new SuccessResponse({
            message: 'List of resources',
            metadata: await resourceList(req.body)
        }).send(res)
    }
}

module.exports = new RbacController()
