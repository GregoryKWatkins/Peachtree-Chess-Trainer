import React from 'react'

import Authenticate from "../Authenticate"
import Database from "../Database"
import {Link} from 'react-router-dom'

import {Forminputs, CoachContainer, DefaultContainer, ModalBG, RedButton} from "../Stylesheets/components/Modals/HomeCreateJoinModalStyling.js"
import {GreenButton} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"

class HomeCreateJoinModal extends React.Component {

    // There are two potential uses for this modal
    // Under Classes:
    //     1. A Coach who wants the options to join or purchase a class
    //     2. A Student who wants to join a class
    constructor(props) {
        super(props)
        this.state = {
            classCodeInput: '',
            enabled: this.props.enabled,
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleClassJoin = this.handleClassJoin.bind(this)
    }

    //handler for updating input with user keypresses
    handleInputChange(event) {
        this.setState({classCodeInput: event.target.value})
    }

    handleClassJoin(event) {
        let code = this.state.classCodeInput

        var thisTemp = this;
        var onSuccess = function(result) {
            alert(result)
            // hide the modal, we're done with it
            thisTemp.props.toggleModal()
            // we want to rerun the database call so we can display the new joined class
            thisTemp.props.runDatabaseQuery()
        }
        var onFailure = function(error) {
            alert(error);
            // hide the modal, we're done with it
            thisTemp.props.toggleModal()
            // we want to rerun the database call so we can display the new joined class
            thisTemp.props.runDatabaseQuery()
        }
        Database.joinClass(code, onSuccess, onFailure);
    }

    render() {
        if (!this.props.enabled) {
            return null;
        }

        let modalContents =
            <div>
                <h2 style={{fontSize: "2.4vh", paddingTop: "2vh", marginBottom: 0}}>To join a classroom, input your classroom code and click 'Join'</h2>
                <Forminputs
                    maxLength={5}
                    type={"text"}
                    name={"classCodeInput"}
                    placeholder={"Code"}
                    value={this.state.classCodeInput}
                    onChange={this.handleInputChange}
                />
                <div>
                    <GreenButton style={{marginTop: "1vh", width: "8vw"}} type="button" onClick={this.handleClassJoin}>
                        Join
                    </GreenButton>
                </div>
                {Authenticate.getUserType() === "Coach" ?
                    <div>
                        <h2 style={{fontSize: "2.4vh", paddingTop: "6vh", marginBottom: 0}}> To start a new classroom, click here </h2>
                        <Link to="/pricing">
                            <GreenButton style={{marginTop: "1vh", width: "8vw"}}>
                                New Class
                            </GreenButton>
                        </Link>
                    </div>
                    : null
                }

                <RedButton onClick={this.props.toggleModal} style={{marginTop: "10vh", width: "8vw"}}>
                    Close
                </RedButton>
            </div>

        return (
            <div>
                <ModalBG>
                    {Authenticate.getUserType() === "Coach" ?
                    <CoachContainer>{modalContents}</CoachContainer> :
                    <DefaultContainer>{modalContents}</DefaultContainer>}
                </ModalBG>
            </div>
        )
    }
}

export default HomeCreateJoinModal