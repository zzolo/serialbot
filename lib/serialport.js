#! /usr/bin/env node

/**
 * Main file for serial port.  This creates a function that can
 * be used ina  script, though our main use case is with
 * the command line.
 */
var socketIO = require('socket.io');
var serialport = require('serialport');
var http = require('http');

/**
 * Main serialport function to start server.
 *
 * options:
 *   serialPath: Path to serial port, such as /dev/tty-usbserial1
 */
function start(options) {
  // Defaults
  options.httpPort = options.httpPort || 8899;
  options.serialPortOptions = options.serialPortOptions || {};
  options.serialPortOptions.parser =
    options.serialPortOptions.parser || serialport.parsers.readline('\n');

  // Check
  if (!options.serialPath) {
    throw 'Serial path not given.';
  }

  // Variable to hold socket

  // Connect to serial port
  var serialPort = new serialport.SerialPort(options.serialPath, options.serialPortOptions);

  // Create HTTP server
  var httpServer = http.createServer();

  // Connect to socket.io and use http server
  var socket = socketIO(httpServer);

  // Once socket is connected, listen and respond to serial events.
  socket.on('connection', function(socket) {
    serialPort.on('open', function() {
      socket.emit('event', { type: 'serial-open' });
    });

    serialPort.on('close', function() {
      socket.emit('event', { type: 'serial-close' });
    });

    serialPort.on('data', function(data) {
      socket.emit('data', data);
    });

    serialPort.on('error', function(error) {
      socket.emit('event', { type: 'serial-error', error: error });
    });
  });

  // Start HTTP server
  httpServer.listen(options.httpPort);

  // Return objects that are used
  return {
    serialPort: serialPort,
    httpServer: httpServer,
    socket: socket
  };
}

/**
 * Function to list all serial ports.  Takes a callback that recieves
 * error and ports (comName, pnpId, manufacturer)
 */
function list(done) {
  return serialport.list(done);
}

// Exports
module.exports = {
  start: start,
  list: list
}
