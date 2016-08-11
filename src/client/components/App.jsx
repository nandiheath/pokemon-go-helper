import React from 'react';
import cookie from 'react-cookie';
import { Link } from 'react-router';

export default class App extends React.Component {
	render() {
		const {
			props: { app }
		} = this;
		
		const isLoggedIn = app.loggedIn;
		const isLoading = app.isLoading;
		const currentPath = this.props.location.pathname;
		
		//show pokemon and recommendation links if logged in	
		return(
			<div className="app">
				<div className="loading" style={{
							display : isLoading ? "block" : "none"
					}}>
					<div className="spinner">
						<div className="double-bounce1"></div>
						<div className="double-bounce2"></div>
					</div>
				</div>
				{(isLoggedIn) ?
					<div className="app-header">
						{(currentPath === '/pokemon') ? 
							<Link to={'/pokemon'} className="app-header-link-current">POKÉMON</Link>
							:	
							<Link to={'/pokemon'} className="app-header-link">POKÉMON</Link>
						}
						{(currentPath === '/luckyegg') ? 
							<Link to={'/luckyegg'} className="app-header-link-current">LUCKYEGG</Link>
							:	
							<Link to={'/luckyegg'} className="app-header-link">LUCKYEGG</Link>
						}
					</div>
					: 
					''
				}
				{this.props.children}
			</div>
		);
	}
};
