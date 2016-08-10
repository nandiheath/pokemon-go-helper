import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import makeStore from './store';

import App from './containers/App';
import Login from './containers/Login';
import Pokemon from './containers/Pokemon';
import LuckyEgg from './containers/LuckyEgg';

// create store
const store = makeStore();

// routes
const routes = <Route path="/" component={App}>
	<IndexRedirect to="/pokemon" />
	<Route path="/login" component={Login} />
	<Route path="/luckyegg" component={LuckyEgg} />
	<Route path="/pokemon" component={Pokemon} />
</Route>

// render
ReactDOM.render(
	<Provider store={store}>
		<Router onUpdate={() => window.scrollTo(0,0)} history={browserHistory}>
			{routes}	
		</Router>	
	</Provider>,
	document.getElementById('app')
);

// debugging
let unsub = store.subscribe(() => {
	console.log('State change..');	
	console.dir(store.getState());
});
unsub(); //turn off
