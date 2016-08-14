'use strict';

// libary for settings
const nconf = require('nconf');

// example config
const defaults = {
	hapi:{
		port:3000
	},
	cookie:{
		secure : false,
		domain : null
	},
	proxy : ""
};

// set default settings
nconf.defaults(defaults);

// export
module.exports = nconf;
