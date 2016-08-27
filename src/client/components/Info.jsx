import React from 'react';
import { Link } from 'react-router';
import {browserHistory} from 'react-router';

export default class Info extends React.Component {

    goToPokemon(){
        browserHistory.push('/pokemon');
    }

    goToLogin(){
        browserHistory.push('/login');
    }

    render() {


        //show pokemon and recommendation links if logged in
        return(
            <div className="pokemon">
                <div className="login-logo">Pokemon Go Helper</div>
                <div style={{textAlign : 'center'}}>
                    <button className="login-form-body-button-google" onClick={this.goToPokemon}>Manual Input</button>
                    <br />
                    <button className="login-form-body-button-google" onClick={this.goToLogin}>Unoffical API</button>
                </div>

                <div className="login-legal">
                    <div className="login-legal-text">This is a unofficial hobby project offered with no warranty of any kind.</div>
                    <div className="login-legal-text">The unofficial API used to log into your account could result in a account ban.</div>

                </div>
            </div>
        );
    }
};
