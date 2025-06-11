const amqp = require('amqplib');

const ORDER_QUEUE = 'order_queue';
const INVENTORY_RESPONSE_QUEUE = 'inventory_response_queue';

let channel;

async function conectarRabbitMQ() {
    try {
        const conexion = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await conexion.createChannel();

        await channel.assertQueue(ORDER_QUEUE, { durable : true });
        await channel.assertQueue(INVENTORY_RESPONSE_QUEUE, { durable : true });

        console.log('Conectado a RabbitMQ');

        channel.consume(ORDER_QUEUE, async (msg) => {
            const orden = JSON.parse(msg.content.toString());
            console.log('Pedido recibido, realizando validación de inventario: ', orden);

            const estaDisponible = Math.random() >= 0.5;

            const respuesta ={
                ordenId: orden.id,
                producto: orden.producto,
                cantidad: orden.cantidad,
                disponible: estaDisponible,
                timestamp: new Date().toISOString(),
            };

            channel.sendToQueue(INVENTORY_RESPONSE_QUEUE, Buffer.from(JSON.stringify(respuesta)), {
                persistent: true,
            });

            console.log('Resultado de la validación enviada: ', respuesta);

            channel.ack(msg);
        });
    } catch (error) {
        console.error('Error conectando a RabbitMQ: ', error);
        process.exit(1);
    }
}

module.exports = { conectarRabbitMQ };