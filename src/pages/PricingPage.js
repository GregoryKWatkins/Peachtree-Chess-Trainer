import React from "react"
import PricingCourse from  "../components/courses/PricingCourse"
import GeneralNavbar from '../components/GeneralNavbar'
import {Background, PageConent} from "../Stylesheets/pages/PricingPageStyling.js"
import Database from "../Database"
import Authenticate from "../Authenticate"
import PricingPurchaseModal from '../components/PricingPurchaseModal'


class PricingPage extends React.Component {
    constructor(props) {
        super(props)

        // Query the database to get this user's class/curriculum information
        var thisTemp = this;
        var onSuccess = function(result) {
            thisTemp.setState({finishedQuery: true,
                            courseData: result.Data.Curriculum,
                            classData: result.Data.Classes})
        }
        var onFailure = function(error) {
            thisTemp.setState({finishedQuery: true});
        }

        if (Authenticate.getCurrentUser() == null) {
            Database.getAnonymousPricingInfo(onSuccess, onFailure);
        } else {
            Database.getUserHomepageInfo(onSuccess, onFailure);
        }

        var onSuccess2 = function(result) {
            let renewPrice;
            let newPrice;
            let expandPrice;
            for (let i = 0; i < result.length; i++) {
                if (result[i].option === "class_renew") {
                    renewPrice = result[i].price;
                }
                if (result[i].option === "class_new") {
                    newPrice = result[i].price;
                }
                if (result[i].option === "expand_class") {
                    expandPrice = result[i].price;
                }
            }

            thisTemp.setState({finishedQuery2: true,
                           priceRenewData: renewPrice,
                           priceNewData: newPrice,
                           priceExpandData: expandPrice});
        }
        var onFailure2 = function(error) {
            thisTemp.setState({finishedQuery2: true});
        }
        Database.getPricingInfo(onSuccess2, onFailure2);

        this.state = {
            logout: false,
            finishedQuery: false, // has the database gotten back to us yet?
            finishedQuery2: false,
            priceNewData: "",
            priceRenewData: "",
            priceExpandData: "",
            courseData: null, //store the class data we recieved
            classData: null,

            // information for modal state
            displayModal: false,
            modalType: 'class',   //can be course (for student/coach), class (for coach), renew (for coach), or expand (for coach)
            modalCourseData: null, //optionally included in case the modal is of type 'course'
            modalClassData: null //optionally included in case the modal if of type 'renew'
        }

        this.toggleModal = this.toggleModal.bind(this)
        this.populateModal = this.populateModal.bind(this)
        this.displayClasses = this.displayClasses.bind(this)
    }

    displayCourses() {

        var coursesArray = this.state.courseData;
        var list = [];
        var boughtAllClasses = true;
        for (var i = 0; i < coursesArray.length; i++) {
            if (coursesArray[i].enabled === false) {
                boughtAllClasses = false;
            }
        }
        if (boughtAllClasses) {
            return <h6> You have purchased all curriculums! </h6>
        }
        for (i = 0; i < (this.state.courseData.length); i++) {
            let course = coursesArray[i]
            if (course.enabled === false && course.published) { //only show unpurchased and published
                list.push(
                    <PricingCourse
                        key={i}
                        courseName= {course.name}
                        coursePrice= {course.price}
                        courseID= {course.id}
                        courseDescription= {course.description}
                        populateModal={this.populateModal}
                        buttonType={"course"}/>)
            }
        }

        return list
    }

    displayClasses() {
        var userType = Authenticate.getUserType()
        if (userType === null || userType !== "Student") {

            return (
                <div style={{overflow:'auto'}}>
                            <h2 style={{fontSize: "1em", marginTop: 0, marginBottom: "4vh"}}>Coach Classes</h2>

                            <PricingCourse courseName= {"Coach Classroom"}
                                        coursePrice= {this.state.priceNewData}
                                        courseDescription= {"This is a classroom for a coach!"}
                                        courseID= {"coach"}
                                        populateModal={this.populateModal}
                                        buttonType={"class"}/>

                            <PricingCourse courseName= {"Classroom Renewal"}
                                        coursePrice= {this.state.priceRenewData}
                                        courseDescription= {"This renews an expired classroom!"}
                                        courseID= {"coach"}
                                        classroomData={this.state.classData}
                                        populateModal={this.populateModal}
                                        buttonType={"renew"}/>
                            <PricingCourse courseName= {"Expand Classroom Size"}
                                        coursePrice= {this.state.priceExpandData}
                                        courseDescription= {"This expands the maximum number of students in a classroom!"}
                                        courseID= {"coach"}
                                        classroomData={this.state.classData}
                                        populateModal={this.populateModal}
                                        buttonType={"expand"}/>
                </div>
            );
        }
    }

    // pass this function to the modal so we can hide the modal again when we are done with it
    toggleModal() {
        this.setState({displayModal: !this.state.displayModal})
    }

    //pass this to purchase buttons so we can display the modal custom to the button that was clicked
    populateModal(type, price, courseData=null) {
        this.setState({displayModal: true,
                       modalType: type,
                       modalCourseData: courseData,
                       price: price})
    }

    render() {
        if (!this.state.finishedQuery || !this.state.finishedQuery2) {
            return(
                <div> <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading" style={{marginLeft: "40vw", paddingTop: "30vh"}}/> </div>
            )
        } else {
            return (
                <Background>
                    <PricingPurchaseModal enabled={this.state.displayModal}
                                            toggleModal={this.toggleModal}
                                            modalType={this.state.modalType}
                                            modalCourseData={this.state.modalCourseData}
                                            price={this.state.price}/>
                    <PageConent>
                        <GeneralNavbar showWelcomeLink={true}/>

                        <div style={{paddingTop: "4vh"}}>
                            <h1 style={{fontSize: "1.5em", marginTop: 0}}> Pricing Page </h1>

                            <h2 style={{fontSize: "1em"}}>Student Curriculums</h2>

                            <div style={{overflow:'auto'}}>
                                {this.displayCourses()}
                            </div>
                            <div>
                                {this.displayClasses()}
                            </div>

                        </div>

                    </PageConent>
                </Background>

            )
        }
    }
}

export default PricingPage