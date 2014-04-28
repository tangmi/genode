//net.server÷

var net = require('net');

net.createServer(function(c) {
	console.log('client connected');

	c.on('end', function() {
		console.log('client disconnected');
	});

	c.write('hello\r\n');

	// c.pipe(c);

	c.on('data', function(data) {
		console.log(data.toString());
	});

}).listen(8124, function() { //'listening' listener
	console.log('server bound');
});