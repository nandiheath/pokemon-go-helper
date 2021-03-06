import React from 'react';
import { bindActionCreators } from 'redux'; 
import { connect } from 'react-redux';

import { filter } from '../action_creators.js';
import Pokemon from '../components/Pokemon';

const mapStateToProps = (state) => {
	return {
		app: state.app,	
		options: state.app.pokemon,
		pokemon: state.pokemon,
		pokedex: state.pokedex,
		proto: state.proto
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		filter: filter
	}, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Pokemon);
