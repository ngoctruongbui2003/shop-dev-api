'use strict'

const { format, createLogger, transports } = require('winston')
const { combine, timestamp, json, align, printf } = format
const { v4: uuidv4 } = require('uuid')
require('winston-daily-rotate-file');

class MyLogger {
    constructor() {
        const formatPrint = format.printf(
            ({ level, message, context, requestId, timestamp, metadata }) => {
                return `${timestamp} [${level}] ${context} ${requestId} ${message} ${metadata ? JSON.stringify(metadata) : ''}`
            }
        )

        this.logger = createLogger({
            level: process.env.LOG_LEVEL || 'debug',
            format: combine(
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                align(),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    level: 'info',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: combine(
                        timestamp({
                            format: 'YYYY-MM-DD HH:mm:ss',
                        }),
                        align(),
                        formatPrint
                    ),
                    level: 'info'
                }),
                new transports.DailyRotateFile({
                    level: 'info',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: combine(
                        timestamp({
                            format: 'YYYY-MM-DD HH:mm:ss',
                        }),
                        align(),
                        formatPrint
                    ),
                    level: 'error'
                })
            ],
        })
    }

    commonParams(params) {
        let context, req, metadata;

        if (!Array.isArray(params)) {
            context = params
        } else {
            [context, req, metadata] = params
        }

        const requestId = req?.requestId || uuidv4()

        return {
            requestId,
            context,
            metadata
        }

    }

    log(message, params) {
        const paramLog = commonParams(params)
        const logObject = Object.assign({ message }, paramLog)
        this.logger.info(logObject)
    }

    error(message, params) {
        const paramLog = commonParams(params)
        const logObject = Object.assign({ message }, paramLog)
        this.logger.error(logObject)
    }
}

module.exports = MyLogger()