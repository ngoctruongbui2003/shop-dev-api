const amqp = require('amqplib');
const messages = "Hello, RabbitMQ!";

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const chanel = await connection.createChannel();
        const queueName = 'test-topic';
        await chanel.assertQueue(queueName, { durable: true });

        chanel.sendToQueue(queueName, Buffer.from(messages));
        console.log(`message: ${messages} sent to queue: ${queueName}`);
    } catch (error) {
        console.error(error);
    }
}

runProducer().catch(console.error);
