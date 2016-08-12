import React from 'react';
import cookie from 'react-cookie';
import { Link } from 'react-router';
import { saveStateToCookie } from './../utils'

export default class App extends React.Component {

	componentWillMount(){
		this.startMonitorLocation();
	}

	componentWillUnmount(){
		clearInterval(this.monitorInterval);
	}



	startMonitorLocation(){
		if (this.monitorInterval != undefined)
			clearInterval(this.monitorInterval);

		// delay get location after 1 seconds
		setTimeout(this.updateLocation.bind(this) , 1000);


		this.monitorInterval = setInterval(this.updateLocation.bind(this) , 10000);
	}

	updateLocation(){
		// check for geolocation api
		if ("geolocation" in navigator) {
			// try to get geolocation
			navigator.geolocation.getCurrentPosition((position) => {

				const lat = position.coords.latitude;
				const lng = position.coords.longitude;

				if(lat && lng) {
					this.props.updateLocation(true , lat , lng);
					saveStateToCookie('app.location' , {geoApiAvaliable : true , lat : lat , lng : lng });
				} else {
					this.props.updateLocation(false , null , null);
				}
			} , (err) =>{
				this.props.updateLocation(false , null , null);
			});

		} else {
			this.props.updateLocation(false , null , null);
		}
	}
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
