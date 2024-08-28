const amqp = require('amqplib');

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel();
        
        const notiExchange = 'notificationExchange';
        const notiQueue = 'notificationQueue';
        const notiExchangeDLX = 'notificationExchangeDLX';
        const notiRoutingKeyDLX = 'notificationRoutingKeyDLX';

        // 1. Create Exchange
        await channel.assertExchange(notiExchange, 'direct', { durable: true });

        // 2. Create queue
        const queueResult = channel.assertQueue(notiQueue, {
            exclusive: false, // cho phep truy cap vao cung mot luc hang doi
            deadLetterExchange: notiExchangeDLX,
            deadLetterRoutingKey: notiRoutingKeyDLX
        });

        // 3. Bind queue to exchange
        await channel.bindQueue(queueResult.queue, notiExchange)

        // 4. Send message to queue
        const msg = 'a new product 123';
        console.log(`Product messgae: ${msg}`);
        await channel.sendToQueue(notiQueue, Buffer.from(msg), {
            expiration: '10000'
        });

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 10000)
    } catch (error) {
        console.error(error);
    }
}

runProducer().catch(console.error);
