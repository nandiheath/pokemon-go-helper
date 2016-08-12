import React from 'react';
import { bindActionCreators } from 'redux'; 
import { connect } from 'react-redux';
import { updateLocation } from '../action_creators.js';

import App from '../components/App';

const mapStateToProps = (state) => {
	return {
		app: state.app
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		updateLocation: updateLocation
	}, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);

