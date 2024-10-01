'use strict'

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'email-smtp.ap-southeast-1.amazonaws.com',
    port: 465,
    secure: true,
    auth: {
        user: 'awazon.user',
        pass: 'awazon.password',
    }
})

module.exports = {
    transporter
}
