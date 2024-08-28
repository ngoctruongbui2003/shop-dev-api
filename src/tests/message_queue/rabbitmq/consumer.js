const amqp = require('amqplib');

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const chanel = await connection.createChannel();
        const queueName = 'test-topic';
        await chanel.assertQueue(queueName, { durable: true });

        chanel.consume(queueName, (messages) => {
            console.log(`message: ${messages.content.toString()}`);
        }, {
            noAck: true
        });
        
    } catch (error) {
        console.error(error);
    }
}

runConsumer().catch(console.error);
