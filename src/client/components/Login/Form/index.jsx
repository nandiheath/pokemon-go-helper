import React from 'react';
import { browserHistory } from 'react-router';
import LoginButton from './LoginButton.jsx';
import { saveStateToCookie } from './../../../utils'

const GOOGLE_AUTH_PATH =  "https://accounts.google.com/o/oauth2/auth?client_id=848232511240-73ri3t7plvk96pj4f85uj8otdat2alem.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&scope=openid%20email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email";
class Form extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			token: '',
			password: '',
			type: '',
			alt: 0 ,
			isGoogleLogin : true
		}; 
	
		//binds
		this.handleUserChange = this.handleChange.bind(this,'user');
		this.handlePasswordChange = this.handleChange.bind(this,'password');
		this.handleTokenChange = this.handleChange.bind(this , 'token');

		this.loginWithGoogle = this.onLoginClick.bind(this,'google');
		this.loginWithPTC = this.onLoginClick.bind(this,'ptc');
	}



	componentWillMount() {
		

	}



	handleCheckboxChange(type , event){
		switch (type) {
			case "google":
				this.setState({ isGoogleLogin: event.target.checked });
					break;
			case "ptc" :
				this.setState({ isGoogleLogin: !event.target.checked });
					break;
			default:
				break;
		}
	}

	handleLatChange(e)
	{
		var loc = {
			lat : parseFloat(e.target.value),
			lng : this.props.app.location.lng
		}

		this.props.updateLocation(false , loc.lat , loc.lng)
		saveStateToCookie('app.location' , {geoApiAvaliable : false , lat : loc.lat , lng : loc.lng });
	}
	handleLndChange(e){
		var loc = {
			lat : this.props.app.location.lat,
			lng : parseFloat(e.target.value)
		}

		this.props.updateLocation(false , loc.lat , loc.lng)
		saveStateToCookie('app.location' , {geoApiAvaliable : false , lat : loc.lat , lng : loc.lng });
	}

	handleChange(type, event) {

		// handle change	
		switch (type) {
  			case 'user':
				this.setState({ user: event.target.value });
    				break;
			case 'password':
				this.setState({ password: event.target.value });
    				break;
			case 'lat':
				this.setState({ lat: event.target.value });
    				break;
			case 'lnd':
				this.setState({ lnd: event.target.value });
    				break;
			case 'token':
				this.setState({token : event.target.value});
					break;
  			default:
				break;
		}
	}


	handleGoogleAuthButtonClicked(){
		window.open(GOOGLE_AUTH_PATH);
	}

	onLoginClick(type){
			
		const user = this.state.user; 
		const pass = this.state.password; 
		const {token} = this.state;

		var auth = {
			type : type
		}

		auth.user = user;
		auth.pass = pass;
		auth.token = token;

		// login	
		this.props.login(auth)
		.then(() => { 
			browserHistory.push('/pokemons');
		})
		.catch((e) => { 
			console.dir(e);	
			alert('ERROR: ' + e); 
		});
	}

	render() {
		const {
			props: { app : { location : {geoApiAvaliable , lat , lng}}},
			state: { isGoogleLogin }
		} = this;


		return(
			<div className="login-form">	
				<span className="login-form-header">Sign in with</span>
				<div className="login-form-body" >
					<div>
						<input type="checkbox" checked={isGoogleLogin} onChange={this.handleCheckboxChange.bind(this ,"google")} /><span className="login-box-checkbox">Google</span>
						<input type="checkbox" checked={!isGoogleLogin} onChange={this.handleCheckboxChange.bind(this , "ptc")} /><span className="login-box-checkbox">PTC</span>
					</div>
					{isGoogleLogin? '' : <input className="login-form-body-input" type="text" placeholder="Username" value={this.state.user} onChange={this.handleUserChange} />}
					{isGoogleLogin? '' : <input className="login-form-body-input" type="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange} />}
					{isGoogleLogin? <input className="login-form-body-input" type="token" placeholder="Authorization code" value={this.state.token} onChange={this.handleTokenChange} /> : ''}

					{(geoApiAvaliable) ? '' : <input className="login-form-body-input" type="text" placeholder="Latitude" defaultValue={lat} onBlur={this.handleLatChange.bind(this)} />}
					{(geoApiAvaliable) ? '' : <input className="login-form-body-input" type="text" placeholder="Longitude" defaultValue={lng} onBlur={this.handleLndChange.bind(this)} />}
					{(geoApiAvaliable) ? '' : <span className="login-form-location-text">Location service unavaliable. Please input the coordinates manually.</span>}

					{isGoogleLogin ? <button className="login-form-body-button-ptc" onClick={this.handleGoogleAuthButtonClicked}>Google Authenticate</button> : ''}
					{isGoogleLogin ? <LoginButton type={'google'} click={this.loginWithGoogle} /> : ''}
					{isGoogleLogin ? '' : <LoginButton type={'ptc'} click={this.loginWithPTC} />}
				</div>
			</div>	
		);			
	}
}

export default Form;
