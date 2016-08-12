import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Logo from './Logo.jsx';
import Form from './Form';
import Legal from './Legal';

class Login extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			props: { app, login , geoApiAvaliable}
		} = this;


		return(
			<div className="login">
				<Logo />
				<Form {...this.props}/>
				<Legal />
			</div>
		);
	}
}

export default Login;
