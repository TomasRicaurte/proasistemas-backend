
# PRUEBA TÉCNICA

## Empresa: Proasistemas
## Cargo: Desarrollador BackEnd

-----------------------------------------------------------------------------------------------------------------------------------------

## Solicitud de la prueba de ingreso

En la prueba se nos solicita implementar una solución para la recepción de pedidos para un software de compras online en la cual habrá 3 servicios (proyectos) interactuando en la recepción de los pedidos de manera asincronica, la comunicación entre los servicios sera por medio de colas se tendrá que informar al servicio order-service el estado del pedido por cada cambio que se ejecute.

-----------------------------------------------------------------------------------------------------------------------------------------

## Solución de la prueba de ingreso

Para dar la solución adecuada a este planteamiento se ha creado 3 microservicio usando JavaScript con el framework de Node.js, con el fin de generar un entorno más compatible con la forma de comunicación y control de mensajeria por cola RabbitMQ.

## Los microservicios y sus funciones

### Order service (recepción de pedidos) 
 > Se expone una API REST (POST /order) para la recepción de los estados mediante POSTMAN.
 > Las ordenes son publicadas en RabbitMQ (order_queue) y los deja en cola.
 > Escucha el estado final de la orden o el pedido (order_status_queue).

### Inventory service (validación de los pedidos)
 > Escucha la cola desde RabbitMQ (order_queue).
 > Genera una validación aleatoria de la disponibilidad del inventario.
 > Almacena y envia la respuesta del pedido (inventory_response_queue).

### Delivery service (Despacho de los pedidos)
 > Valida la respuesta del pedido (inventory_response_queue).
 > Si el pedido esta aprobado, lo despacha; en caso de estar rechazado, nos informa el motivo (simulado).
 > Guarda y publica el estado final de la orden (order_status_queue).

-----------------------------------------------------------------------------------------------------------------------------------------

## Tecnologias necesarias para su prueba

 > Node.js
  - Instalado previamente

 > Express (unicamente para el order-service)

 > RabbitMQ (para la comunicación entre los servicios)
  -Instalado y corriendo localmente (amqp://localhost:5672)

 > amqplib (cliente AMQP para Node.js)

 > dotenv (para el manejo de las variables de entorno)

 > nodemon (desarrollo y ejecución de los servicios)

## Como probar la API (POSTMAN)

 > Método: POST
 > URL: http://localhost:3000/order
 > Body (JSON): 
 {
    'Producto': 'producto del pedido',
    'cantidad': x
 }