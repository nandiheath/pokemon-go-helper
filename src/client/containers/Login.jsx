import React from 'react';
import { bindActionCreators } from 'redux'; 
import { connect } from 'react-redux';
import { login , updateLocation } from '../action_creators.js';

import Login from '../components/Login';

const mapStateToProps = (state) => {
	return {
		app: state.app
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		login: login,
		updateLocation: updateLocation
	}, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login);

