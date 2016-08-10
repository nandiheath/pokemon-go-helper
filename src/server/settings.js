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
	}
};

// set default settings
nconf.defaults(defaults);

// export
module.exports = nconf;
