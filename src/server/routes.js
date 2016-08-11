'use strict';

var Joi = require('joi');
var controllers = require('./controllers');

var routes = [
	{
		method: 'POST',
		path: '/api/login',
		handler: controllers.login,
		config: {
			validate: {
				payload: {
					auth: Joi.object().keys({
						type: Joi.any().valid('google','ptc').required(),
						user: Joi.string().allow(''),
						pass: Joi.string().allow(''),
						token: Joi.string().allow(''),
					}),
					lat: Joi.number().required(),
					lnd: Joi.number().required(),
					alt: Joi.number().required()
				}
			},
			state: {
				parse: true, // parse and store in request.state
				failAction: 'error' // may also be 'ignore' or 'log'
			}
		}
	},
	{
		method: 'GET',
		path: '/api/player/inventory',
		handler: controllers.getInventory,
		config: {
			state: {
				parse: true, // parse and store in request.state
				failAction: 'error' // may also be 'ignore' or 'log'
			}
		}
	},
	{
		method: 'GET',
		path: '/bundle.js',
		handler: (request, reply) => {
			reply.file(appRoot + '/src/client/public/bundle.js');
		}	
	},
	{
		method: 'GET',
		path: '/index.css',
		handler: (request, reply) => {
			reply.file(appRoot + '/src/client/public/index.css');	
		}
	},
	{
		method: 'GET',
		path: '/assets/{param*}',
		handler: {
			directory: {
				path: appRoot + '/src/client/public/assets',
				listing: false,
				index: true
			}
		}
	},
	{
		method: 'GET',
		path: '/{path*}',
		handler: (request, reply) => {
			// Serve the debug html which use webpack dev server
			reply.file(appRoot + (process.env.NODE_ENV === "production" ? '/src/client/public/index.html' : '/src/client/public/debug.html'));
		}

	}
];

// export
module.exports = routes;
