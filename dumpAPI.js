var sdl = require('sdl');
var what = require('what');

var api = sdl;
for (var key in api) {
	var val = api[key];
	console.log(memberToString(api, key));

	if (typeof val == 'function') {

		var proto = val.prototype;
		for (var fnkey in proto) {
			console.log('  ' + fnkey);
		}

	} else if (typeof val == 'object') {
		for(var okey in val) {
			console.log('  ' + okey + ': ' + val[okey]);
		}
	}
}

function memberToString(o, key) {
	return key + ' (' + (typeof o[key]) + ')';
}