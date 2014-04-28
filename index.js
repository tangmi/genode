var gameloop = require('node-gameloop');


var display = require('./lib/display');
var input = require('./lib/input');

display.init();

input
	.bind('left', 'left')
	.bind('right', 'right')
	.bind('up', 'up')
	.bind('down', 'down')
	.bind('space', 'jump');

input.on('press left', function() {
	console.log('pressed left');
});

input.on('hold left', function() {
	console.log('hold left');
});

gameloop.setGameLoop(function(delta) {
	input.handleInput();

});