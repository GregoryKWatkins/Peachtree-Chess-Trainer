import React from 'react'
import PaypalExpressBtn from 'react-paypal-express-checkout'
import Select from 'react-select'
import {Redirect} from 'react-router-dom'
import Database from "../Database"
import Authenticate from "../Authenticate"
import {DefaultContainer, Button, ModalBG} from "../Stylesheets/components/Modals/PricingPurchaseModalStyling.js"


class PricingPurchaseModal extends React.Component {

    // takes as props:
    //    enabled : determines whether or not the modal should currently be visible
    //    modalType : can be 'course' (for student/coach), 'class' (for coach), or 'renew' (for coach)
    //    modalCourseData: optionally included in case the modal is of type 'course'
    constructor(props) {
        super(props)

        this.state = {
            enabled: this.props.enabled,
            expandClassroomId: '',   //stores the id of the classroom chosen by user
            renewClassroomId: '',    //stores the id of the classroom chosen by user

            expandSelected: null,    //stores which value should currently be shown in the Select
            renewSelected: null,     //stores which value should currently be shown in the Select

            triggerRedirect: false,
            finished: false,
            key: ''
        }

        this.payPalExpress = this.payPalExpress.bind(this);
        this.handleExpandChange = this.handleExpandChange.bind(this)
        this.handleRenewChange = this.handleRenewChange.bind(this)
        this.getID = this.getID.bind(this)

        this.getID() // This should grab ID from databse and put it in the state.
    }

    handleExpandChange(event) {
        //set state to the code of the selected class
        this.setState({expandClassroomId: event.value,
                      expandSelected: event})
    }

    handleRenewChange(event) {
        //set state to the code of the selected class
        this.setState({renewClassroomId: event.value,
                      renewSelected: event})
    }

    payPalExpress() {
        // Most of the following code is from https://www.npmjs.com/package/react-paypal-express-checkout\
        var thisTemp = this;
        const onSuccess = (payment) => {
            // Congratulation, it came here means everything's fine!
            // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data

            if (this.props.modalType === "course") {
                var onSuccess2 = function(result) {
                    thisTemp.setState({triggerRedirect: true})
                }
                var onFailure2 = function(error) {
                    alert(error);
                    thisTemp.setState({triggerRedirect: true})
                }
                Database.addCourse(this.props.modalCourseData.courseID, onSuccess2, onFailure2);
            } else if (this.props.modalType === "class") {
                var onSuccess3 = function(result) {
                    thisTemp.setState({triggerRedirect: true})
                }
                var onFailure3 = function(error) {
                    alert(error);
                    thisTemp.setState({triggerRedirect: true});
                }
                Database.createClass(Authenticate.getCurrentUser().username, onSuccess3, onFailure3);
            } else if (this.props.modalType === "renew") {
                var onSuccess4 = function(result) {
                    thisTemp.setState({triggerRedirect: true})
                }
                var onFailure4 = function(error) {
                    alert(error)
                    thisTemp.setState({triggerRedirect: true})
                }
                Database.renewClass(this.state.renewClassroomId, onSuccess4, onFailure4);
                // Can probably get class code from the chosen class in the dropdown we make.
            } else if (this.props.modalType === "expand") {
                var onSuccess5 = function(result) {
                    thisTemp.setState({triggerRedirect: true})
                }
                var onFailure5 = function(error) {
                    alert(error)
                    thisTemp.setState({triggerRedirect: true})
                }
                Database.expandClassSize(this.state.expandClassroomId, onSuccess5, onFailure5);
                // Can probably get class code from the chosen class in the dropdown we make.
            }
        }

        const onCancel = (data) => {
            // User pressed "cancel" or close Paypal's popup!
            console.log('The payment was cancelled!', data);
            // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
        }

        const onError = (err) => {
            // The main Paypal's script cannot be loaded or somethings block the loading of that script!
            console.log("Error!", err);
            // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
            // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
        }

        let shipping = 1; // 1 means no shipping address
        let env = 'sandbox'; // you can set here to 'production' for production
        let currency = 'USD'; // or you can set this value from your props or state
        let total = parseFloat(this.props.price.substring(1)); // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
        // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/

        const client = {
            sandbox:    this.state.key,
            /* Currently just grabs the paypal key from database (no distingushment
            between sandbox or production currently)*/
            production: 'YOUR-PRODUCTION-APP-ID' // Will swap this with databse call when site is live.
        }
        // In order to get production's app-ID, you will have to send your app to Paypal for approval first
        // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
        //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
        // For production app-ID:
        //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/
        // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!

        if ((this.props.modalType === "class" || this.props.modalType === "course")
                || ((this.props.modalType === "expand"
                || this.props.modalType === "renew")
                && this.state.classroomId !== "")) {
                return (
                    <div>
                        <PaypalExpressBtn
                            env={env}
                            client={client}
                            currency={currency}
                            total={total}
                            shipping= {shipping}
                            onError={onError}
                            onSuccess={onSuccess}
                            onCancel={onCancel} />
                    </div>
                    );
            }
    }

    getID() {
        let thisTemp = this

        let onSucc = function(result) {
            thisTemp.setState({finished: true, key: result.Data})
        }

        let onFail = function(error) {
            console.log("Error: " + error)
        }

        Database.getPayPalKey(onSucc, onFail)
    }

    render() {
        if (!this.props.enabled) {
            return null;
        }

        if (this.state.triggerRedirect) {
            return ( <Redirect push to={{ pathname: '/home' }} />)
        }

        if (parseFloat(this.props.price.substring(1)) === 0) { // If the class/curriculum/renew/expand is currently free to purchase
            let thisTemp = this
            if (this.props.modalType === "course") {
                var onSuccess2 = function(result) {
                    alert("You have received a free curriculum. Go to home page to see it.")
                    thisTemp.setState({triggerRedirect: true});
                }
                var onFailure2 = function(error) {
                    alert(error);
                    thisTemp.setState({triggerRedirect: true});
                }
                Database.addCourse(this.props.modalCourseData.courseID, onSuccess2, onFailure2);
            } else if (this.props.modalType === "class") {
                var onSuccess3 = function(result) {
                    alert("You have received a free class. Go to home page to see it.")
                    thisTemp.setState({triggerRedirect: true});
                }
                var onFailure3 = function(error) {
                    alert(error);
                    thisTemp.setState({triggerRedirect: true});
                }
                Database.createClass(Authenticate.getCurrentUser().username, onSuccess3, onFailure3);
            } else if (this.props.modalType === "renew") {
                var onSuccess4 = function(result) {
                    alert("You have received a free renewal. Go to home page to see it.")
                    thisTemp.setState({triggerRedirect: true});
                }
                var onFailure4 = function(error) {
                    alert(error)
                    thisTemp.setState({triggerRedirect: true});
                }
                Database.renewClass(this.state.renewClassroomId, onSuccess4, onFailure4);
                // Can probably get class code from the chosen class in the dropdown we make.
            } else if (this.props.modalType === "expand") {
                var onSuccess5 = function(result) {
                    alert("You have received a free class expansion. Go to home page to see it.")
                    thisTemp.setState({triggerRedirect: true});
                }
                var onFailure5 = function(error) {
                    alert(error);
                    thisTemp.setState({triggerRedirect: true});
                }
                Database.expandClassSize(this.state.expandClassroomId, onSuccess5, onFailure5);
                // Can probably get class code from the chosen class in the dropdown we make.
            }
        } else {
            let payButton = this.payPalExpress();
            let modalContents
            if (this.props.modalType === 'course') {
                //grab details about the course that was clicked
                let courseName = this.props.modalCourseData.courseName
                let coursePrice = this.props.price
                //let courseID = this.props.modalCourseData.courseID
                let courseDescription = this.props.modalCourseData.courseDescription

                modalContents = (
                    <div>
                        <div style={{fontSize: "2.4vh", paddingTop: "1vh", marginBottom: "2vh"}}>
                            <p>You are purchasing the following Course for your own personal use.</p>
                            <p><strong>Name:</strong> {courseName}</p>
                            <p><strong>Price: </strong>{coursePrice}</p>
                            <p><strong>Description:</strong> {courseDescription}</p>
                            <p>Please click the button below to confirm your payment.</p>
                        </div>
                        {payButton}
                    </div>
                )
            } else if (this.props.modalType === 'class') {
                modalContents = (
                    <div>
                        <h2 style={{fontSize: "2.4vh", paddingTop: "2vh", marginBottom: "2vh"}}>
                            You are choosing to set up a new Classroom for your students. Please click the button below to confirm your payment.
                        </h2>
                        {payButton}
                    </div>
                )
            } else if (this.props.modalType === 'renew') {
                let classData = this.props.modalCourseData
                let options = []
                for (const classroom of classData) {
                    options.push({value: classroom.code, label: classroom.name})
                }

                modalContents = (
                    <div>
                        <h2 style={{fontSize: "2.4vh", paddingTop: "2vh", marginBottom: "2vh"}}>
                            You are choosing to renew an expired Classroom. Please select the Classroom you would like to renew from the dropdown.
                            Please click the button below to confirm your payment.
                        </h2>

                        <Select
                            value={this.state.renewSelected}
                            onChange={this.handleRenewChange}
                            options={options}
                            placeholder={"Choose class to renew"}
                        />
                        <div style={{marginTop:"9vh", zIndex:1}}>
                            {this.state.renewSelected !== null ? payButton : null}
                        </div>

                    </div>
                )
            } else if (this.props.modalType === 'expand') {
                let classData = this.props.modalCourseData
                let options = []
                for (const classroom of classData) {
                    if (classroom.maxSize < 80) {
                        options.push({value: classroom.code, label: classroom.name})
                    }
                }

                modalContents = (
                    <div>
                        <h2 style={{fontSize: "2.4vh", paddingTop: "2vh", marginBottom: "2vh"}}>
                            You are choosing to expand the size of a classroom by 10 students.
                            This can only be done for classes with less than 80 students.
                            Please select the Classroom you would like to expand from the dropdown.
                            Please click the button below to confirm your payment.
                        </h2>

                        <Select
                            style={{}}
                            value={this.state.expandSelected}
                            onChange={this.handleExpandChange}
                            options={options}
                            placeholder={"Choose class to expand"}
                        />
                        <div style={{marginTop:"9vh", zIndex:1}}>
                            {this.state.expandSelected !== null ? payButton : null}
                        </div>

                    </div>
                )
            }

            return (
                <div>
                    <ModalBG>
                        <DefaultContainer>
                            {this.state.finished ? modalContents : <div> <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading"/>  </div>}
                            <Button onClick={this.props.toggleModal} style={{marginTop: "1vh", backgroundColor: "#FF4136", color: "white"}}>
                                Close
                            </Button>
                        </DefaultContainer>
                    </ModalBG>
                </div>
            )
        }
    }
}

export default PricingPurchaseModal