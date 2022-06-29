#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('backend:server');
var http = require('http');

let userModel = require('../models/user')
let randoModel = require('../models/rando')

/**
 * Get port from environment and store in Express.
 */

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// work in progress
wss.on('connection', function (ws) {
  ws.on('message', function (data) {

    console.log('onmessag')
    data = data.toString();

    //console.log(data)
    data = JSON.parse(data);

    //console.log('token is ', data.token);
    userModel.findOne({ token: data.token }, async (err, foundUser) => {

      console.log('0')
      if (!foundUser) {
        console.log('User not found')
        ws.send('User not found')
        return;
      }
      console.log('1')
      let foundRando = await randoModel.findById(data.randoId);
      console.log('2')
      if (!foundRando) {
        console.log('Rando not found')
        ws.send('Rando not found')
        return;
      }
      console.log("3")
      if (!foundRando.users.includes(foundUser._id)) {
        console.log("User not participating")
        ws.send('User is not participating to rando.')
        return;
      }
      console.log('1')
      foundRando.messages.push({
        text: data.message,
        createdAt: data.date,
        user: {
          _id: foundUser._id,
          name: foundUser.username
        }
      })
      let savedRando = await foundRando.save();
      console.log(JSON.stringify(savedRando))
      //console.log(JSON.stringify(foundUser))

      console.log('message reçu')

      wss.clients.forEach(function each(client) {

        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(foundRando));
          // console.log('data', data);
        }
      });
    });

  });
});



var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);



/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
