//display÷

var sdl = require('sdl');

// shit gets destroyed when it goes out of scope. hella interesting
var _window;

module.exports.init = function() {
	var title = "HELLO WORLD";
	var width = 640,
		height = 480;
	var fullscreen = false;

	sdl.init(sdl.INIT.VIDEO);
	sdl.init(sdl.INIT.EVERYTHING);

	_window = new sdl.Window(
		title,
		sdl.WINDOWPOS.CENTERED,
		sdl.WINDOWPOS.CENTERED,
		width,
		height,
		fullscreen);

	sdl.IMG.init(0);

	var surface = sdl.IMG.load('./res/icon.png');
	_window.setIcon(surface);

	// set window title + icon title
	// not supported?
	// sdl.WM.setCaption(title, title);
};