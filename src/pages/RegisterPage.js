import React from 'react'
import GeneralNavbar from '../components/GeneralNavbar'
import Authenticate from "../Authenticate"
import { Forminputs, Background, PageConent, SubButton, SelectInput, LoginContainer} from "../Stylesheets/pages/RegisterPageStyling.js"
import { Link, Redirect } from 'react-router-dom'


class RegisterPage extends React.Component {
	constructor() {
		super()
		this.state = {
			emailBox: '',
			usernameBox: '',
			passwordBox: '',
			accounttypeBox: '',
            ageBox: '',
            rankBox: '',
            nameBox: '',
            verified: false
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
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
        var password = this.state.passwordBox;
        var email = this.state.emailBox;
        var accountType = this.state.accounttypeBox;
        var age = this.state.ageBox;
        var rank = this.state.rankBox;
        var name = this.state.nameBox;

        if (username === null || username.trim() === "" || username.includes('@')) {
            alert("Invalid username. Username may not be empty or contain the '@' symbol. Please re-enter the username.")
            return;
        }

        if (email === null || email.trim() === "") {
            alert("Invalid email. Please re-enter the email.")
            return;
        }

        if (this.state.accountType === "coach" && rank.trim() === "") {
            alert("Invalid rank. Please re-enter the rank.")
            return;
        }

        if (this.state.accountType === "coach" && age.trim() === "") {
            alert("Invalid age. Please re-enter the age.")
            return;
        }

        var onSuccess = function(result) {
        	//var cognitoUser = result.user;
            //console.log("New user " + cognitoUser.getUsername() + " has been registered");
            alert('Registration successful. Please check your email inbox or spam folder for your verification code.');
            thisPointer.setState({verified: true})
        }

        var onFailure = function(error) {
        	alert(error.message);
            //console.log(error);
        }

        Authenticate.register(username, password, email, accountType, age, rank, name, onSuccess, onFailure);
	}

    returnPasswordStatement() {
        var hasNumber = /\d/ // Reg ex expression to identify if a string contains a number.
        var hasUpperCase = /[A-Z]/ // Reg ex expression to identify if a string contains an upper case letter.
        var hasLowerCase = /[a-z]/ // Reg ex expression to identify if a string contains a lower caseletter.

        if (this.state.passwordBox.length < 8) {
            return (
                <text style = {{color: 'red', fontSize: "2vh"}}>
                    Password must be at least 8 characters.
                </text>
            )
        } else if (!(hasNumber.test(this.state.passwordBox))) {
            return (
                <text style = {{color: 'red'}}>
                    Password must include a number.
                </text>
            )
        } else if (!(hasUpperCase.test(this.state.passwordBox))) {
            return (
                <text style = {{color: 'red'}}>
                    There must include at least one uppercase letter.
                </text>
            )
        } else if (!(hasLowerCase.test(this.state.passwordBox))) {
            return (
                <text style = {{color: 'red'}}>
                    There must include at least one lowercase letter.
                </text>
            )
        } else {
            return (
                <text style = {{color: 'green'}}>
                    Password meets all requirements.
                </text>
            )
        }
    }

    returnCoachAnalytics() {
        if (this.state.accounttypeBox === 'coach') {
            return (
                <label style={{marginBottom: 25}}>
                    <Forminputs
                        maxLength={50}
                        type={"number"}
                        min={"1"}
                        max={"150"}
                        name={"ageBox"}
                        placeholder={"Age"}
                        value={this.state.ageBox}
                        onChange={this.handleChange}
                    />

                    <Forminputs
                        maxLength={50}
                        type={"number"}
                        min={"0"}
                        max={"3000"}
                        name={"rankBox"}
                        placeholder={"Chess Elo Ranking"}
                        value={this.state.rankBox}
                        onChange={this.handleChange}
                    />

                    <Forminputs
                        minLength={1}
                        maxLength={50}
                        type={"text"}
                        name={"nameBox"}
                        placeholder={"Full Name"}
                        value={this.state.nameBox}
                        onChange={this.handleChange}
                    />
                </label>
            )
        }
    }

    render() {
        if (this.state.verified) {
            this.setState({verified: false});
            return (<Redirect push to={{ pathname: '/verification' }} />);
        } else {
            return (
                <Background>
                    <PageConent>
                        <GeneralNavbar showWelcomeLink={true}/>
                        <LoginContainer onSubmit={this.handleSubmit}>

                            <h1 style={{fontSize: "8vh", marginTop: -40, marginBottom: 10, textShadow: '3px 3px rgba(0,0,0,0.19)'}}>Register</h1>

                            <div>
                                <Forminputs
                                    minLength={10}
                                    maxLength={50}
                                    type={"email"}
                                    name={"emailBox"}
                                    placeholder={"Email"}
                                    value={this.state.emailBox}
                                    onChange={this.handleChange}
                                />
                            </div>

                            <div>
                                <Forminputs
                                    minLength={1}
                                    maxLength={50}
                                    type={"text"}
                                    name={"usernameBox"}
                                    placeholder={"Username"}
                                    value={this.state.usernameBox}
                                    onChange={this.handleChange}
                                />
                            </div>

                            <div>
                                <Forminputs
                                    maxLength={50}
                                    type={"password"}
                                    name={"passwordBox"}
                                    placeholder={"Password"}
                                    value={this.state.passwordBox}
                                    onChange={this.handleChange}
                                />
                            </div>

                            {this.returnPasswordStatement()} {/*For password requirements*/}

                            <div>
                                <SelectInput
                                    name={"accounttypeBox"}
                                    value={this.state.accounttypeBox}
                                    onChange={this.handleChange}
                                >
                                    <option value="" disabled selected hidden>Student or Coach?</option>
                                    <option value="student">Student</option>
                                    <option value="coach">Coach</option>

                                </SelectInput>
                            </div>

                            {this.returnCoachAnalytics()} {/*For coach analytic questions*/}

                            <SubButton
                                type={"submit"}
                                value={"Submit"}
                            />

                            <div>
                                <label>
                                    <Link to="/login" style={{textDecoration:'none', fontSize: "2vh"}}> Already have an account? Sign in here! </Link>
                                </label>
                            </div>
                        </LoginContainer>
                    </PageConent>
                </Background>
            );
        }
    }
}


export default RegisterPage