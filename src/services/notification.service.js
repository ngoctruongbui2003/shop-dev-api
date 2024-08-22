'use strict'

const notificationModel = require("../models/notification.model")

const pushNotification = async ({
    type = 'SHOP-001',
    receivedId = 1,
    senderId = 1,
    options = {}
}) => {
    let noti_content
    
    if (type === 'SHOP-001') {
        noti_content = `Shop ${senderId} has just added a new product`
    } else if (type === 'PROMOTION-001') {
        noti_content = `Shop ${senderId} has just added a new promotion`
    }

    const newNoti = new notificationModel({
        noti_type: type,
        noti_senderId: senderId,
        noti_receiverId: receivedId,
        noti_content,
        noti_options: options
    })

    return newNoti
}

const listNotiByUser = async ({
    useId = 1,
    type = 'ALL',
    isRead = 0
}) => {
    const match = { noti_receiverId: userId }
    if (type !== 'ALL') {
        match['noti_type'] = type
    }

    return await notificationModel.aggregate([
        {
            $match: match
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receiverId: 1,
                noti_content: {
                    $concat: [
                        {
                            $substr: ['$noti_options.shop_name', 0, -1]
                        },
                        ' vua moi them 1 san pham moi: ',
                        {
                            $substr: ['$noti_options.product_name', 0, -1]
                        },
                    ]
                },
                noti_options: 1,
                createAt: 1
            }
        }
    ])
}

module.exports = {
    pushNotification,
    listNotiByUser
} 
