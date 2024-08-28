'use strict'

const multer = require('multer');

const uploadMemory = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
})

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '/src/uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    }),
    // limits: {
    //     fileSize: 10 * 1024 * 1024, // 10 MB
    // },
})

module.exports = {
    uploadMemory,
    uploadDisk
}
