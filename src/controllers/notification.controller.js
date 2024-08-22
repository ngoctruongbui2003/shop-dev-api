'use strict'

const NotificationService = require('../services/notification.service')

class CommentController {
    listNotiByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list noti by user success!',
            metadata: await NotificationService.listNotiByUser(req.body)
        }).send(res)
    }
}

moudle.exports = new CommentController()
