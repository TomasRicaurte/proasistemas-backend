const amqp = require('amqplib');
//const { throws } = require('assert');
//const { buffer } = require('stream/consumers');

const ORDER_QUEUE = 'order_queue';
const STATUS_QUEUE = 'order_status_queue';

let channel;

async function conectarRabbitMQ() {
    try {
        const conexion = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await conexion.createChannel();

        await channel.assertQueue(ORDER_QUEUE, {durable: true});
        await channel.assertQueue(STATUS_QUEUE, {durable: true});

        console.log('Conectando con RabbitMQ');
    } catch (err) {
        console.error('Error conectando con RabbitMQ', err);
        process.exit(1);
    }     
}

async function envioDeOrden(orden) {
    if(!channel){
        throw new Error('RabbitMQ no está conectado.');
    }

    channel.sendToQueue(ORDER_QUEUE, Buffer.from(JSON.stringify(orden)),{
        persistent: true,
    });
}

function estadoQueue(){
    if(!channel) return;
    channel.consume(STATUS_QUEUE, (msg) => {
        const status = JSON.parse(msg.content.toString());
        console.log('El estado actualizado del pedido: ', status);
        channel.ack(msg);
    });
}

module.exports = { conectarRabbitMQ, envioDeOrden, estadoQueue };