'use strict'

const { newTemplate } = require("../services/template.service")

class EmailController {

    newTemplate = async (req, res, next) => {
        new SuccessResponse({
            message: 'newTemplate',
            metadata: await newTemplate(req.body)
        }).send(res)
    }

}

module.exports = new EmailController()