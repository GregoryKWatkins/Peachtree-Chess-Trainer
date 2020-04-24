import React from "react"
import styled from "styled-components"
import {Button} from "../../Stylesheets/components/Modals/ModuleSettingsModalStyling"
import Authenticate from "../../Authenticate"
import {Redirect} from 'react-router-dom'

const ButtonStyle = styled.div`
    background-color: rgb(235, 235, 235);
    float: left;
    margin-left: 5vw;
    margin-bottom: 5vh;
    padding: 2vh 2vh 2vh 2vh;
    width: 12vw;

    font-size: 1.7vh;
    border-radius: 2vh;
    box-shadow: 0 1vh 2vh 0 rgba(0,0,0,0.2), 0 2vh 3vh 0 rgba(0,0,0,.2);

    transition: 0.5s all ease-out;
    &:hover {
        box-shadow: 0 1vh 2vh 0 rgba(0,0,0,0.35), 0 2vh 3vh 0 rgba(0,0,0,.35);
    }
`;

export default class PricingCourse extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            triggerLoginRedirect: false
        }

        this.payPalCheckout = this.payPalCheckout.bind(this);
        this.chooseButton = this.chooseButton.bind(this);
        this.handleCourseModal = this.handleCourseModal.bind(this)
        this.handleClassModal = this.handleClassModal.bind(this)
        this.handleRenewModal = this.handleRenewModal.bind(this)
        this.handleExpandModal = this.handleExpandModal.bind(this)
    }

    checkLoggedIn() {
        if (!Authenticate.getAuthenticated()) {
            this.setState({triggerLoginRedirect: true})
        }
    }

    handleCourseModal(event) {
        this.checkLoggedIn();
        let modalCourseData = {
            courseName: this.props.courseName,
            courseID: this.props.courseID,
            courseDescription: this.props.courseDescription,
        }
        this.props.populateModal('course', this.props.coursePrice, modalCourseData)
    }
    handleClassModal(event) {
        this.checkLoggedIn();
        this.props.populateModal('class', this.props.coursePrice)
    }
    handleRenewModal(event) {
        this.checkLoggedIn();
        let modalClassData = []
        var classroom
        //gets all expired(disabled) classes and passes them into modalCourseData
        for (classroom in this.props.classroomData) {
            if (!this.props.classroomData[classroom].enabled) {
                modalClassData.push(this.props.classroomData[classroom])
            }
        }

        this.props.populateModal('renew', this.props.coursePrice, modalClassData)
    }
    handleExpandModal(event) {
        this.checkLoggedIn()
        let modalClassData = []
        var classroom
        //gets all active(enabled) classes and passes them into modalCourseData
        for (classroom in this.props.classroomData) {
            if (this.props.classroomData[classroom].enabled) {
                modalClassData.push(this.props.classroomData[classroom])
            }
        }
        this.props.populateModal('expand', this.props.coursePrice, modalClassData)
    }

    chooseButton() { //renamed from isClass, hope that's cool
        if (this.props.buttonType === "course") {
            return (
                <Button type= "button"
                        onClick= {this.handleCourseModal}
                        >
                    Buy Course
                </Button>
            );
        } else if (this.props.buttonType === "class") {
            return (
                <Button type= "button"
                        onClick= {this.handleClassModal}
                        >
                    Buy Class
                </Button>
            );
        } else if (this.props.buttonType === "renew") {
            return (
                <Button type= "button"
                        onClick={this.handleRenewModal}
                        >
                    Renew Class
                </Button>
            );
        } else if (this.props.buttonType === "expand") {
            return (
                <Button type= "button"
                        onClick={this.handleExpandModal}
                        >
                    Expand Class
                </Button>
            );
        }
    }

    payPalCheckout() {
        return (
            this.chooseButton()
        );
    }

    render() {
        if (this.state.triggerLoginRedirect) {
            return (<Redirect push to={{ pathname: '/login' }} />)
        }
        return (
            <ButtonStyle>
                <h3 style={{marginTop: 0, marginBottom: "1vh"}}> {this.props.courseName} </h3>

                <h4 style={{marginTop: 0, marginBottom: "1vh"}}> {this.props.coursePrice} </h4>

                <div style={{overflow: "auto", marginTop: 0, marginBottom: "1vh"}}>
                    {this.props.courseDescription}
                </div>

                <div style={{marginTop: 0, marginBottom: "1vh"}}>
                    {this.chooseButton()}
                </div>
            </ButtonStyle>
        )
    }
}