import React from 'react'
import {Redirect} from 'react-router-dom'

import GeneralNavbar from '../components/GeneralNavbar'
import Authenticate from "../Authenticate"
import {Background, PageContent, Forminputs, VerifyContainer, SubButton} from "../Stylesheets/pages/VerificationPageStyling.js"

class VerificationPage extends React.Component {
    constructor() {
        super()
        this.state = {
            usernameBox: '',
            codeBox: '',
            verified: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.resendVerify = this.resendVerify.bind(this)
    }

    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.value

        this.setState({
          [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        var thisPointer = this;
        var username = this.state.usernameBox;
        if (username === null || username.trim() === "") {
            alert("Username cannot be empty.");
            return;
        }
        var code = this.state.codeBox;

        function onSuccess(result) {
            //console.log(result);
            alert('Verification successful. You will now be redirected to the login page.');
            Authenticate.signout();
            thisPointer.setState({verified: true});
        }

        function onFailure(err) {
            console.log(err);
            alert("Error: " + err.message)
        }

        Authenticate.verify(username, code, onSuccess, onFailure);
    }

    resendVerify(event) {
        var username = this.state.usernameBox;
        if (username === null || username.trim() === "") {
            alert("Username cannot be empty.");
            return;
        }

        function onSuccess(result) {
            //console.log(result);
            alert('Email resent to ' + result);
        }

        function onFailure(err) {
            //console.log(err);
            alert("Error resending code: " + err.message);
        }

        Authenticate.resendVerification(username, onSuccess, onFailure);
    }

    render() {
        if (this.state.verified) {
            this.setState({verified: false});
            return <Redirect push to={{ pathname: '/login' }} />;
        } else {
            return (
                <Background>
                    <PageContent>
                        <GeneralNavbar showWelcomeLink={true}/>
                        <VerifyContainer onSubmit={this.handleSubmit}>
                            <h1 style={{fontSize: 20, marginTop: -40, marginBottom: 10}}>Check email for verification code</h1>
                            <label>
                                <Forminputs
                                    maxLength={50}
                                    type={"text"}
                                    name={"usernameBox"}
                                    placeholder={"Username"}
                                    value={this.state.usernameBox}
                                    onChange={this.handleChange}
                                />
                                <Forminputs
                                    maxLength={50}
                                    type={"text"}
                                    name={"codeBox"}
                                    placeholder={"Code"}
                                    value={this.state.codeBox}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <SubButton
                                type={"button"}
                                value={"Resend Code"}
                                onClick={this.resendVerify}
                            />
                            <SubButton
                                type={"submit"}
                                value={"Submit"}
                            />
                        </VerifyContainer>
                    </PageContent>
                </Background>
            )
        }
    }
}

export default VerificationPage