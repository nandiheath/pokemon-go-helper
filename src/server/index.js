'user strict';

// dependencies
const Hapi = require('hapi');
const Inert = require('inert');
const routes = require(appRoot + '/src/server/routes');
const settings = require(appRoot + '/src/server/settings');

// new server instance
const server = new Hapi.Server();

// static file serving
server.register(Inert, () => {});

// configure connection
server.connection({
	port: settings.get('hapi:port')
});

// add routes
server.route(routes);

server.state('pgohelper', {
	encoding: 'base64json',
	ttl: 3600 * 1000,
	isSecure: false,
	isHttpOnly: false,
});


// start server
server.start(() => {
	console.log('Server listening @ ' + server.info.uri);
})
