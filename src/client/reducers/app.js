import * as types from '../action_creators.js';

const initialState = { loggedIn: false , pokemon: { orderBy: 'recent' }, luckyegg: { orderBy: 'evolutions' } };

function app(state = initialState, action) {
	console.log(state);
	switch (action.type) {
		
		case types.LOGIN_SUCCESS:
			return Object.assign({}, state, { loggedIn: true });
		case types.LOGIN_FAILED:
			return Object.assign({}, state, { loggedIn: false });
		case types.REQUEST_FINISH:
			return Object.assign({}, state, { isLoading: false });
		case types.REQUEST_START:
			return Object.assign({}, state, { isLoading: true });
		case types.ORDERBY:
			return Object.assign({}, state, { [action.page]: { orderBy: action.by } });	
		
		default: // default return on unknown action type
			return state;
	}
}

export default app;
