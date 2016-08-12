import * as types from '../action_creators.js';
import { loadStateFromCookie } from '../utils';



const initialState = {
	loggedIn: false ,
	pokemon: loadStateFromCookie('app.pokemon' , { orderBy: 'recent' }),
	location: loadStateFromCookie('app.location' , { geoApiAvaliable : true , lat : 22.45392846177887 , lng :  114.00254913267258}),
	luckyegg: { orderBy: 'evolutions' } };


function getInitialState()
{
	return Object.assign({} , initialState , loadStateFromCookie());
}

function app(state = getInitialState() , action) {
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
		case types.LOCATION_UPDATE:
			if (action.success){
				return Object.assign({}, state , { location : { geoApiAvaliable : true , lat : action.lat , lng : action.lng}});
			}else
			{
				var newState =  Object.assign({}, state , Object.assign({} , state.location , { geoApiAvaliable : false}));
				if (action.lat)
					newState.location.lat = action.lat;

				if (action.lng)
					newState.location.lng = action.lng;
				return newState;
			}

		default: // default return on unknown action type
			return state;
	}
}

export default app;
