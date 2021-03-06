import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Logo from './Logo.jsx';
import Form from './Form';
import Legal from './Legal';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render() {
		const {
			props: { app, login }
		} = this;
	
		return(
			<div className="login">
				<Logo />
				<Form login={login} />
				<Legal />
			</div>
		);
	}
}

export default Login;
