//input÷

var assert = require('assert');

var EventEmitter = require('events').EventEmitter;

var sdl = require('sdl');

var fromScanCode = (function(scancodes) {
	var data = {};
	for (name in scancodes) {
		var scancode = scancodes[name];
		data[scancode] = name.toLowerCase();
	}

	return function(code) {
		return data[code];
	};
})(sdl.SCANCODE);

var events = {
	press: new EventEmitter(),
	hold: new EventEmitter(),
	release: new EventEmitter()
};

// key=keyname, value=actionname
var bindings = {};

// key=keyname, value=true if existant
var keysDown = {};

function handleInput() {
	var e;
	while (e = sdl.pollEvent()) {
		if (e.type == 'QUIT') {
			// quit when asked
			// TODO: make this a user defined event?
			sdl.quit();
			process.exit(0);
		}

		var keyName = fromScanCode(e.scancode);
		var action = bindings[keyName];
		if (!action) {
			continue;
		}

		if (e.type == 'KEYDOWN' && e.repeat == false) {
			// handle "press" event
			events.press.emit(action);
			keysDown[keyName] = true;
		}
		if (e.type == 'KEYUP') {
			// handle "release" event
			events.release.emit(action);
			delete keysDown[keyName];
		}
	}

	// enumerate over all the held keys
	for (var keyName in keysDown) {
		// handle the "hold" event
		var action = bindings[keyName];
		if (!action) {
			continue;
		}
		events.hold.emit(action);
	}
}

function bind(key, action) {
	bindings[key] = action;
	return this;
}

function on(typeAndAction, fn) {
	var parts = typeAndAction.split(/\s+/g);
	assert.equal(parts.length, 2, 'action should be in the form "[press|hold|release] <actionname>"');
	var type = parts[0];
	var action = parts[1];

	assert(events.hasOwnProperty(type), 'event type must be "press|hold|release"');

	events[type].addListener(action, fn);
	return this;
}

var type;
for (type in events) {
	// add .press, .hold, .release
	(function(type) {
		// use a closure because javascript scoping
		module.exports[type] = function(action, fn) {
			events[type].addListener(action, fn);
			return this;
		};
	})(type);
}

module.exports.bind = bind;
module.exports.on = on;
module.exports.handleInput = handleInput;
