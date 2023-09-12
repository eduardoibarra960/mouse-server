// Importamos los módulos necesarios
var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');

// Creamos un servidor HTTP que sirva el archivo index.html
var server = http.createServer(function(req, res) {
  fs.readFile(__dirname + '/index.html', function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error al cargar el archivo index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
});

// Escuchamos en el puerto 3000
server.listen(process.env.PORT || 3000, function() {
  console.log('Servidor escuchando en el puerto 3000');
});

// Creamos un objeto socket.io para manejar las conexiones de los clientes
var io = socketio(server);

// Creamos un arreglo para almacenar la posición del mouse de cada cliente
var mousePositions = [];

// Escuchamos el evento 'connection' que se dispara cuando un cliente se conecta
io.on('connection', function(socket) {
  console.log('Un cliente se ha conectado');

  // Asignamos un identificador único al cliente
  var clientId = socket.id;

  // Escuchamos el evento 'mouseMove' que se dispara cuando el cliente mueve el mouse
  socket.on('mouseMove', function(data) {
    // Actualizamos la posición del mouse del cliente en el arreglo
    mousePositions[clientId] = data;

    // Emitimos el evento 'updateTable' a todos los clientes con el arreglo actualizado
    io.emit('updateTable', mousePositions);
  });

  // Escuchamos el evento 'disconnect' que se dispara cuando el cliente se desconecta
  socket.on('disconnect', function() {
    console.log('Un cliente se ha desconectado');

    // Eliminamos la posición del mouse del cliente del arreglo
    delete mousePositions[clientId];

    // Emitimos el evento 'updateTable' a todos los clientes con el arreglo actualizado
    io.emit('updateTable', mousePositions);
  });
});
