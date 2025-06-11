const express = require('express');
const router = express.Router();
const { envioDeOrden } = require('./rabbitmq');

router.post('/orden', async (req, res) =>{
    const { producto, cantidad } = req.body;

    if (!producto || !cantidad) {
        return res.status(400).json({error: 'Faltan datos del pedido.'})
    }

    const orden = {
        id : Math.floor(Math.random() * 100000),
        producto,
        cantidad,
        createdAt: new Date().toISOString(),
    };

    try {
        await envioDeOrden(orden);
        res.status(202).json({ message: 'La orden fue enviada con éxito ', orden })
    } catch (error) {
        console.error('Ocurrio un error enviando la orden: ', error);
        res.status(500).json({error: 'Error interno en los servidores.'})
    }
});

module.exports = router;