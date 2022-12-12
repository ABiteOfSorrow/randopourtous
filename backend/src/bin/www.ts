#!/usr/bin/env node

require("dotenv").config();
import http from 'http';
const debug = require('debug')('backend:server');
import WebSocket from 'ws';

import app from '../app';

let userModel = require('../models/user')
let randoModel = require('../models/rando')

const wss = new WebSocket.Server({ port: 8080 });

// TODO work in progress
wss.on('connection', function (ws) {
  ws.on('message', function (rawData) {

    const data = JSON.parse(rawData.toString());

    userModel.findOne({ token: data.token }, async (err, foundUser) => {

      if (!foundUser) {
        ws.send('User not found.')
        return;
      }
      let foundRando = await randoModel.findById(data.randoId);
      if (!foundRando) {
        console.log('Track not found.')
        ws.send('Rando not found.')
        return;
      }

      if (!foundRando.users.includes(foundUser._id)) {
        ws.send('User is not participating to track.')
        return;
      }

      foundRando.messages.push({
        text: data.message,
        createdAt: data.date,
        user: {
          _id: foundUser._id,
          name: foundUser.username
        }
      })
      await foundRando.save();

      wss.clients.forEach((client) => {

        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(foundRando));
        }
      });
    });

  });
});

/**
 * Get port from environment and store in Express.
 */
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
function normalizePort(val: string) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) return port;
  
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
    : 'port ' + addr?.port;
  debug('Listening on ' + bind);
}
