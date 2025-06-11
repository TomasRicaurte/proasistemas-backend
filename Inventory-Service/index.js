require('dotenv').config();

const { conectarRabbitMQ } = require('./rabbitmq');

async function iniciar() {
    await conectarRabbitMQ();
    console.log('El servicio de inventario se esta ejecutando ...')
}

iniciar();