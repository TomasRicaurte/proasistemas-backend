const amqp = require('amqplib');

const INVENTORY_RESPONSE_QUEUE = 'inventory_response_queue';
const ORDER_STATUS_QUEUE = 'order_status_queue';

let channel;

async function conectarRabbitMQ() {
    try {
        const conexion = await amqp.connect(process.env.RABBITQM_URL);
        channel = await conexion.createChannel();

        await channel.assertQueue(INVENTORY_RESPONSE_QUEUE, { durable : true});
        await channel.assertQueue(ORDER_STATUS_QUEUE, { durable : true });

        console.log('Conectado a RabbitMQ');

        channel.consume(INVENTORY_RESPONSE_QUEUE, async (msg) =>{
            const resultado = JSON.parse(msg.content.toString());
            console.log('La respuesta ha sido recibida desde el inventario: ', resultado);

            const estado = {
                ordenId: resultado.ordenId,
                estado: resultado.disponible ? 'DESPACHADO' : 'RECHAZADO',
                producto: resultado.producto,
                cantidad: resultado.cantidad,
                timestamp: new Date().toISOString(),
            };

            if (resultado.disponible) {
                console.log('El pedido fue despachado orden #', estado.ordenId );
            } else {
                console.log('El pedido fue rechazado por falta de inventario existente orden #', estado.ordenId);
            }
            
            channel.sendToQueue(ORDER_STATUS_QUEUE, Buffer.from(JSON.stringify(estado)),{
                persistent: true,
            });

            channel.ack(msg);

        })
    } catch (error) {
        console.error('Error conectando a RabbitMQ: ', error);
        process.exit(1);
    }
}

module.exports = { conectarRabbitMQ };