'use strict'

const amqp = require('amqplib')

async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()

    const queueName = 'ordered-queue-message'
    await channel.assertQueue(queueName, {
        durable: true
    })

    // set prefetch to 1 to ensure that a worker only processes one message at a time
    channel.prefetch(1)

    channel.consume(queueName, (msg) => {
        const message = msg.content.toString()
        const time = Math.random() * 1000

        setTimeout(() => {
            console.log(`Processed message: ${message}`)
            console.log(`Time: ${time}`)
            channel.ack(msg)
        }, time)

        
    })
}

consumerOrderedMessage().catch(err => console.error(err))