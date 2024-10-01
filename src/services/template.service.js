'use strict'

const TEMPLATE = require('../models/template.model');

const newTemplate = async ({
    tem_name,
    tem_html
}) => {
    // 1. check if template exist in database

    // 2. create a new template
    const newTemplate = await TEMPLATE.create({
        tem_name,
        tem_html: htmlEmailToken()
    });

    return newTemplate;
}

const getTemplate = async ({}) => {

}

module.exports = {
    newTemplate,
    getTemplate
}
