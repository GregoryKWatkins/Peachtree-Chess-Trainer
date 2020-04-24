import React from "react"
import {Link, Redirect} from 'react-router-dom'

import GeneralNavbar from '../components/GeneralNavbar'
import { Forminputs, Background, PageConent, SubButton, LoginContainer} from "../Stylesheets/pages/LoginPageStyling.js"

import Authenticate from "../Authenticate"


class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {entry: "", password: "", logged: false, verifyRedirect: false, loading: false};

        /* Here we are binding the functions to fix errors with undefined variables
        and other warnings/errors I'm not sure about. */
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login=this.login.bind(this);
    }

    /* This function calls the authenticates signin method to log a user in. It
    is currently called in the handleSubmit function. */
    async login() {
        this.setState({loading: true})
        var signin;

        if (this.state.entry.includes('@')) { // If entry is an email, make it all lowercase.
            this.setState({entry: this.state.entry.toLowerCase()})
        }

        try {
            signin = await Authenticate.signin(this.state.entry, this.state.password);
        } catch(err) {
            if (err === "UserNotConfirmedException") {
                this.setState({verifyRedirect: true}) //redirect to VerificationPage
            }
        }

        if (signin) {
            this.setState({logged: true}); //Just so the page rerenders.
        }
        this.setState({loading: false})
    }

    /* This function currently is called by the labels in the form in the render
    method to handle when a person is typing in their username and password.
    It is what will change the entry and password variables in the state as
    the user types in the values. */
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    /* This function currently is called by the form in the render method to handle
    a submission of a username and password. */
    handleSubmit(event) {

        this.login();

        event.preventDefault(); /* This is so the page won't refresh when a user
        logs in which (for some reason) causes a Network Error.*/
    }

    render() {
        if (this.state.verifyRedirect) { //If user is not verified, redirect them to VerificationPage
            return (
                <Redirect push to={{ pathname: '/verification' }} />
            )
        }

        if (!Authenticate.getAuthenticated()) { //redirect to home if already authenticated
            return (
                <Background>
                    <PageConent>
                        <GeneralNavbar showWelcomeLink={true}/>
                        <div style={{width: "100%", display: "table"}}>
                        {/* Form which will hold the text input for the username/email
                        and password to be submitted for log in.*/}
                        <LoginContainer onSubmit={this.handleSubmit}>

                            <h1 style={{fontSize: 80, marginTop: -40, marginBottom: 30, textShadow: '3px 3px rgba(0,0,0,0.19)'}}>Login</h1>

                            {/* Input for username/email. type treats it as text and name
                            allows for the handleChange to update both values in the state */}
                            <label>
                                <Forminputs
                                maxLength={50}
                                type = "text"
                                name = "entry"
                                placeholder = "Username"
                                value = {this.state.entry}
                                onChange = {this.handleChange} />
                            </label>

                            <br />

                            {/* Input for password. type treats it as a password and name
                            allows for the handleChange to update both values in the state */}
                            <label>
                                <Forminputs
                                maxLength={50}
                                type = "password"
                                name = "password"
                                placeholder = "Password"
                                value = {this.state.password}
                                onChange = {this.handleChange} />
                            </label>

                            <div>
                                {/* Forgot password button */}
                                <Link to="/password_recovery" style={{textDecoration:'none', fontSize: 14}}>
                                    Forgot your password? Click here!
                                </Link>    
                            </div>
                            
                            <div>
                                {/* Button for submitting the form. type makes it a button to
                                submit the form. */}
                                <SubButton type="submit" value= "Login"/>

                                <div>
                                    {this.state.loading ? <h4> Attempting log-in, please wait... </h4> : null}

                                    {/* Link to the register page */}    
                                </div>
                                <div>
                                    <label>
                                        <Link to="/register" style={{textDecoration:'none'}}> Dont have an account? Register now! </Link>
                                    </label>     
                                </div>
                                   
                            </div>
                            
                        </LoginContainer>
                        </div>
                    </PageConent>
                </Background>
            )
        } else {
            return (
                <Redirect push to={{ pathname: '/home' }} />
            )
        }
    }
}

export default LoginPage