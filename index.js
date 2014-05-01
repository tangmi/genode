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

input.press('left', function() {
	console.log('pressed left');
});

input.hold('left', function() {
	console.log('hold left');
});

input.release('left', function() {
	console.log('release left');
});

input.press('right', function() {
	console.log('press right');
});

input.hold('right', function() {
	console.log('hold right');
});

input.release('right', function() {
	console.log('release right');
});

gameloop.setGameLoop(function(delta) {
	input.handleInput();

});