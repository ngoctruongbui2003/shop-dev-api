'use strict'

const { ErrorResponse } = require("../core/error.response")
const { transporter } = require("../dbs/init.nodemailer")
const { replacePlaceholder } = require("../utils")
const { newOtp } = require("./otp.service")

const sendEmailLinkVerify = async ({
    html,
    toEmail,
    subject = 'Xác nhận Email đăng ký',
    text = 'Xác nhận Email đăng ký ...'
}) => {
    try {
        const mailOptions = {
            from: ' "ShopDEV" <ngoctruongbui2003@gmail.com>',
            to: toEmail,
            subject,
            text,
            html
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw new ErrorResponse({
                    message: 'Email send failed',
                })
            }

            console.log('Email sent: ' + info.messageId)
        })

    } catch (error) {
        throw new ErrorResponse({ message: error })
    }
}

const sendEmailToken = async ({
    email = null
}) => {
    try {
        // 1. get token
        const token = await newOtp({ email })

        // 2. get email template
        const template = await getTemplate({
            tem_name: 'HTML EMAIL TOKEN'
        })

        // 3. replace placeholder with params
        const content = replacePlaceholder(
            template.tem_html,
            {
                link_verify: `http://localhost:3056/cgp/welcome-back?token=${token.otp_token}`
            }
        )

        // 3. send email
        sendEmailLinkVerify({
            html: content,
            toEmail: email,
            subject: 'Xác nhận Email đăng ký',
        }).catch
    } catch (error) {
        throw new ErrorResponse(error)
    }
}

module.exports = {
    sendEmailToken
}
