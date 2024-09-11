'use strict'

const { create } = require('lodash');
const resource = require('../models/resource.model');
const role = require('../models/role.model');

/**
 * Create a new resource
 * @param {String} name
 * @param {String} slug
 * @param {String} description
 */
const createResource = async ({
    name = 'profile',
    slug = 'p00001',
    description = ''
}) => {
    try {
        // 1. Check name or slug exist

        // 2n new resource
        const newResource = await resource.create({
            src_name: name,
            src_slug: slug,
            src_description: description
        })

        return newResource;
    } catch (error) {
        return error
    }
}

const resourceList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = ''
}) => {
    try {
        // 1. Check admin? middleware function

        // 2. get list of resources
        const resources = await resource.aggregate([
            {
                $project: {
                    _id: 0,
                    name: '$src_name',
                    slug: '$src_slug',
                    description: '$src_description',
                    resourceId: '$_id',
                    createAt: 1,
                }
            }
        ])

        return resources
    } catch (error) {

    }
}

const createRole = async ({
    name = 'shop',
    slug = 's00001',
    description = 'extend from shop or user',
    grants = []
}) => {
    try {
        // 1. check role exists

        // 2. new role
        const newRole = await role.create({
            rol_name: name,
            rol_slug: slug,
            rol_description: description,
            rol_grants: grants
        })
    } catch (error) {
        return error
    }
}

const roleList = async () => {
    try {
        userId = 0,
        limit = 30,
        offset = 0,
        search = ''
    } catch (error) {
        // 1. userId

        // 2. List roles
        const roles = await role.aggregate([
            {
                $unwind: '$rol_grants'
            },
            {
                $lookup: {
                    from: 'resources',
                    localField: 'rol_grants.resource',
                    foreignField: '_id',
                    as: 'resource'
                }
            },
            {
                $unwind: '$resource'
            },
            {
                $project: {
                    role: '$rol_name',
                    resource: '$resource.src_name',
                    action: '$rol_grants.action',
                    attributes: '$rol_grants.attributes',
                }
            },
            {
                $unwind: '$action'
            },
            {
                $project: {
                    _id: 0,
                    role: 1,
                    resource: 1,
                    action: '$action',
                    attributes: 1,
                }
            },
        ])

        return roles
    }
}

module.exports = {
    createResource,
    resourceList,
    createRole,
    roleList
}
