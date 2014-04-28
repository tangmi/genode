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
var bindings = {};
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
	// console.log('bound %s to %s', key, action);
	return this;
}

function on(action, fn) {
	var parts = action.split(/\s+/g);
	assert.equal(parts.length, 2, 'action should be in the form "[press|hold|release] <actionname>"');
	var type = parts[0];
	var actionName = parts[1];

	assert(events.hasOwnProperty(type), 'event type must be "press|hold|release"');

	// console.log('add listener for %s %s', type, actionName);
	events[type].addListener(actionName, fn);
	return this;
}

module.exports.bind = bind;
module.exports.on = on;
module.exports.handleInput = handleInput;

/*
var EventEmitter = require('events').EventEmitter;

var keypress = require('keypress');


function InputManager(readStream) {
	this.bindings = {};
	this.events = new EventEmitter();

	// make `process.stdin`, for example, begin emitting "keypress" events
	keypress(readStream);

	// listen for the "keypress" event
	readStream.on('keypress', (function(ch, key) {
		var eventName = this.bindings[key.name];
		if (eventName) {
			this.events.emit(eventName);
		}

		// quit on ^C (interrupt)
		if (key && key.ctrl && key.name == 'c') {
			process.exit();
			// readStream.pause();
		}
	}).bind(this));

	readStream.setRawMode(true);
	readStream.resume();
}

InputManager.prototype.bind = function(eventName, keyName) {
	this.bindings[keyName] = eventName;
	return this;
}

InputManager.prototype.on = function(eventName, fn) {
	this.events.on(eventName, fn);
	return this;
}

// Exports
module.exports.createInputManager = function(stream) {
	return new InputManager(stream);
};

module.exports.debug = function() {
	keypress(process.stdin);
	process.stdin.on('keypress', function(ch, key) {
		console.log('got "keypress"', key);
		if (key && key.ctrl && key.name == 'c') {
			process.exit();
		}
	});
	process.stdin.setRawMode(true);
	process.stdin.resume();
}
*/