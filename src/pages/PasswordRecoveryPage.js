import React from 'react'

import GeneralNavbar from '../components/GeneralNavbar'
import Authenticate from "../Authenticate"
import PasswordRecoveryModal from "../components/PasswordRecoveryModal"

import {Background, PageContent, Forminputs, VerifyContainer, SubButton} from "../Stylesheets/pages/PasswordRecoveryPageStyling.js"

class PasswordRecoveryPage extends React.Component {

    /*
     *  vert toggles which input boxes are enabled or disabled
     *  true: only email enabled
     *  false: code and password enabled
    */
    constructor() {
        super()
        this.state = {
            emailBox: '',
            vert: true,
            stage: 0
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }

    toggleModal(event) {
        event.preventDefault()
        const vert = this.state.vert
            this.setState({
                emailBox: '',
                vert: !vert
            })
    }

    handleSubmit(event) {
        event.preventDefault()

        var username;

        if (this.state.stage === 0) {
            var thisPointer = this;
            username = this.state.emailBox;
            // vert: on true, show modal
            //      on false, hide modal
            var onSuccess = function(result) {
                //console.log(result)
                alert("A verification code has been sent to your email. Enter that code and your new password and submit again.");
                const vert = thisPointer.state.vert;
                thisPointer.setState({
                    vert: !vert
                    //stage: 1
                    //toggles the modal window
                })
           }

            var onFailure = function(error) {
                alert(error.message);
                //console.log(error);
           }

           Authenticate.forgotPasswordPart1(username, onSuccess, onFailure);
       }
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
        return (
            <Background>
                <PageContent>
                    <GeneralNavbar showWelcomeLink={true}/>
                    <VerifyContainer onSubmit={this.handleSubmit}>
                        <Forminputs
                            maxLength={50}
                            type={"text"}
                            name={"emailBox"}
                            placeholder={"Email or Username"}
                            value={this.state.emailBox}
                            disabled={!(this.state.vert)}
                            onChange={this.handleChange}
                        />
                        <SubButton
                            type={"submit"}
                            value={"Submit"}
                            disabled={!(this.state.vert)}
                        />
                    </VerifyContainer>
                    <PasswordRecoveryModal
                        onClick={this.toggleModal}
                        vert={!(this.state.vert)}
                        username={this.state.emailBox}
                    />
                </PageContent>

            </Background>
        )
    }
}

export default PasswordRecoveryPage