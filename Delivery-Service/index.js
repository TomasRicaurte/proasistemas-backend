require('dotenv').config();

const { conectarRabbitMQ } = require('./rabbitmq');

async function inicio() {
    await conectarRabbitMQ();
    console.log('El servicio de delivery se esta ejecutando ...');
}

inicio();