# SerialBot

A simple command line utility to communicate between a serial port (like the output of an Arduino) and a web browser via sockets.  This can be useful for visualization of hardware.  Currently, this is read-only and you cannot write to the serial port at the moment.

# Install

    npm install serialbot -g

# Use

List all available serial ports:

    serialbot list

Start the serialbot server, using a path from the `list` command:

    serialbot start /dev/cu.usbmodemXXX

This will make a connection to the serial port and start an HTTP server that allows for a socket connection via socket.io.

    <!DOCTYPE HTML>
    <html>
    <head>
      <title>SerialBot example</title>
    </head>
    <body>

      <!-- This is what is being served -->
      <script src="//localhost:8899/socket.io/socket.io.js"></script>

      <!-- Example connection -->
      <script type="text/javascript">
        // Connect to socket
        var serialbot = io.connect('//localhost:8899/');

        // Do something with the data
        serialbot.on('data', function(data) {
          console.log('Serial data received: ', data);
        });
      </script>
    </body>
    </html>

See the `examples` folder for some more extensive, but still basic examples for an HTML page and an Arduino sketch.

## Serial parsing

By default the serialport module just passes through the Buffer data.  This module uses the provided `serialport.parsers.readline('\n')` parser for serial reading by default, meaning that each data event will be separated by a new line.  If you need something different, feel free to use the module in a JS file.

## Options

Most options that are available to the serial port are available through the command line.  Use the `--help` option to see a full list

    serialbot --help
    serialbot start --help

## Using in code

This module can be used directly in your JS code if desired, even though this is not really the main reason for the module.  Something like the following should get your start.

    var serialbot = require('serialbot');
    var s = serialbot.start({
      serialPath: '/dev/cu.usbmodemXXX',
      serialPortOptions: {},
      httpPort: 8899
    });
    // `s` will then have the following properties
    // serialPort: The serialport object
    // httpServer: The http server object
    // socket: The socket.io object
