import React from 'react'

import Authenticate from "../Authenticate"

import {Forminputs, VerifyContainer, SubButton, Button} from "../Stylesheets/pages/PasswordRecoveryPageStyling.js"

class PasswordRecoveryModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            codeBox: '',
            newPasswordBox: '',
            vert: this.props.vert,
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleClose(event) {
        const vert = this.props.vert
        this.setState({
            vert: !vert
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        var username = this.props.username;
        var code = this.state.codeBox;
        var newPassword = this.state.newPasswordBox;

        var onSuccess2 = function(result) {
            alert("Password successfully changed. You will now be sent to the login page.");
            window.location.href = "/login";
        }

        var onFailure2 = function(error) {
            alert(error.message)
        }

        Authenticate.forgotPasswordPart2(username, code, newPassword, onSuccess2, onFailure2);
    }

    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.value

        this.setState({
        [name]: value
        });
    }

    render() {
        if (!this.props.vert) {
            return null;
        }
        return (
            <div>
                <VerifyContainer onSubmit={this.handleSubmit}>
                    <Forminputs
                        maxLength={50}
                        type={"text"}
                        name={"codeBox"}
                        placeholder={"Code"}
                        value={this.state.codeBox}
                        onChange={this.handleChange}
                    />
                    <Forminputs
                        maxLength={50}
                        type={"password"}
                        name={"newPasswordBox"}
                        placeholder={"New Password"}
                        value={this.state.newPasswordBox}
                        onChange={this.handleChange}
                    />
                    <SubButton
                        type={"submit"}
                        value={"Submit"}
                    />
                    <br />
                    {/*Close button to close modal*/}
                    <Button onClose={this.handleClose}
                        onClick={this.props.onClick}>
                        Close
                    </Button>

                </VerifyContainer>
            </div>
        )
    }
}

export default PasswordRecoveryModal