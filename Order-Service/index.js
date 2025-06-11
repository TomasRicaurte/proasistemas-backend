const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const { conectarRabbitMQ, envioDeOrden, estadoQueue } = require('./rabbitmq');
const orderRoutes = require('./orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/', orderRoutes);

app.listen(PORT, async () => {
    await conectarRabbitMQ();
    estadoQueue();
    console.log('El servicio para las ordenes esta escuchando en el puerto', PORT);
});