'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick( object, fields )
}

const getSelectData = (select = []) => {
    return Object.fromEntries( select.map( key => [key, 1] ) )
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries( select.map( key => [key, 0] ) )
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key]
        }
    })

    return obj
}

const updateNestedObjectParser = obj => {
    const final = {}

    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key])
            Object.keys(response).forEach(k => {
                final[`${key}.${k}`] = response[k]
            })
        } else {
            final[key] = obj[key]
        }
    })

    return final
}

const replacePlaceholder = (template, params) => {
    Object.keys(params).forEach(key => {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), params[key])
    })

    return template
}

const convertToObjectId = id => new Types.ObjectId(id)

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectId,
    replacePlaceholder
}