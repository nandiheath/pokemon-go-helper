// action constants
export const LOGIN = 'LOGIN';
export const LOAD = 'LOAD';
export const ORDERBY = 'ORDERBY';
export const REQUEST_START = "REQUEST_START";
export const REQUEST_FINISH = "REQUEST_FINISH";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";

// login
import 'whatwg-fetch'; //polyfill for safari
export function login(auth,lat,lnd,alt) {
	return function(dispatch) {

		// create payload		
		const payload = {
			auth: auth,
			lat:lat,
			lnd:lnd,
			alt:alt	
		}

		dispatch(startRequest());

		// make request
		return fetch('/api/login', 
			{ 
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				credentials: 'same-origin',
				body: JSON.stringify(payload),
			}
		)
		.then((response) => {
			dispatch(finishRequest());
			if(response.ok) {
				//return response.json();
				return dispatch(loginSuccess());
			}
			else {
				throw `${response.status} ${response.statusText}`
			} // TODO improve error handing  'Incorrect username or password.'
		})
	}
}

export function fetchInventory(lat,lng){
	return function(dispatch) {

		dispatch(startRequest());

		// make request
		return fetch('/api/player/inventory',
			{
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'same-origin'
			}
		)
		.then((response) => {
				dispatch(finishRequest());

				if(response.ok) {
					// Mark the login success when reloading the page
					dispatch(loginSuccess());
					return response.json();
				}
				else { throw `${response.status} ${response.statusText}` } // TODO improve error handing  'Incorrect username or password.'
			})
		.then((data) => {
			if(data){
				return dispatch(load(data));
			}
			else { throw 'Error loading response data.'; }
		})
	}
}

export function startRequest(){
	return {
		type: REQUEST_START,
	}
}

export function finishRequest(){
	return {
		type: REQUEST_FINISH,
	}
}

export function loginSuccess(){
	return {
		type: LOGIN_SUCCESS
	}
}

export function loginFailed(){
	return {
		type: LOGIN_FAILED
	}
}

// load pokemon data
export function load(data) {
	return {
		type: LOAD,
		player: data.player,
		pokedex: data.pokedex,
		pokemon: data.pokemon,
		candy: data.candy,
		proto: data.proto	
	};
}

// sort list 
export function orderBy(page,by) {
	return {
		type: ORDERBY,
		page: page,	
		by: by 
	};
}
