'use strict'

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromUrl, uploadImageFromLocal, uploadImageFromLocalFiles } = require('../services/upload.service')

class UploadController {
    uploadImageFromUrl = async (req, res, next) => {
        new SuccessResponse({
            message: 'upload image success!',
            metadata: await uploadImageFromUrl()
        }).send(res)
    }

    uploadFileThumb = async (req, res, next) => {
        const { files } = req
        if (!files) {
            throw new BadRequestError('file is required!')
        }

        new SuccessResponse({
            message: 'upload image success!',
            metadata: await uploadImageFromLocal({
                path: file.path
            })
        }).send(res)
    }

    uploadImageFromLocalFiles = async (req, res, next) => {
        const { files } = req
        if (!files.length) {
            throw new BadRequestError('file is required!')
        }

        new SuccessResponse({
            message: 'upload images success!',
            metadata: await uploadImageFromLocalFiles({
                files,
                ...req.body
            })
        }).send(res)
    }
}

moudle.exports = new UploadController()
