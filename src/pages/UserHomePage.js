import React from "react"
import HomeNavbar from "../components/HomeNavbar"
import HomeSidebar from "../components/HomeSidebar"
import HomeSubCourses from "../components/HomeSubCourses"
import HomeSubSettings from "../components/HomeSubSettings"
import HomeCreateJoinModal from '../components/HomeCreateJoinModal'
import DistinctCourse from "../components/DistinctCourse"
import Database from "../Database"
import Notifications from "../components/Notifications"

class UserHomePage extends React.Component {
    constructor(props) {
        super(props)

        // Query the database to get this user's class/curriculum information
        this.runDatabaseQuery()

        this.state = {
            // default to showing the courses page, can currently swap between 'courses', 'settings', and 'distinctCourse'
            currentSubwindow: 'courses',
            // for specifying which class/curriculum to swap to
            distinctCourseInfo: null,

            // determines whether the join/add class modal should be displaying
            displayModal: false,

            finishedQuery: false, // has the database gotten back to us yet?
            classDataJson: null //store the class data we recieved
        }

        this.swapSubwindow = this.swapSubwindow.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.runDatabaseQuery = this.runDatabaseQuery.bind(this)

        this.refreshPage = this.refreshPage.bind(this)

    }

    // Given to distinct course as prop to refresh page when needed.
    refreshPage(newClassName) {
        var newClassInfo = this.state.distinctCourseInfo
        newClassInfo.name = newClassName
        this.setState({distinctCourseInfo: newClassInfo})
    }

    // Pass this function to the HomeSidebar so UserHomePage can swap pages
    // pass to HomeNavbar so it can reset back to default 'Courses' subwindow
    // and pass to HomeCourseCard so it can show whatever course was clicked
    // the courseInfo parameter is only ever used to specify which course/curriculum was clicked and should be shown
    swapSubwindow(swapTo, courseInfo=null){
        if (courseInfo != null) {
            this.setState({currentSubwindow: swapTo,
                            distinctCourseInfo: courseInfo})
        } else {
            this.setState({currentSubwindow: swapTo})
        }
    }

    // pass this function to the join class buttons so we can show the modal
    toggleModal() {
        this.setState({displayModal: !this.state.displayModal})
    }

    // query database to update page info
    runDatabaseQuery() {
        var thisTemp = this;
        var onSuccess = function(result) {
            //console.log(result)
            thisTemp.setState({finishedQuery: true,
                           classDataJson: result.Data});
        }
        var onFailure = function(error) {
            //console.log(error)
            thisTemp.setState({finishedQuery: true});
        }
        Database.getUserHomepageInfo(onSuccess, onFailure);
    }

    distinctDataChange(courseInfo) {
        this.setState({distinctCourseInfo: courseInfo})
    }


    render() {
        if (!this.state.finishedQuery) {
            return(
                <div> <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading" style={{marginLeft: "40vw", paddingTop: "30vh"}}/> </div>
            )
        } else if (this.state.finishedQuery) {
            let subWindow
            if (this.state.currentSubwindow === 'courses') {
                subWindow = <HomeSubCourses swapSubwindow={this.swapSubwindow}
                                            toggleModal={this.toggleModal}
                                            classDataJson={this.state.classDataJson}/>
            } else if (this.state.currentSubwindow === 'settings') {
                subWindow = <HomeSubSettings />
            } else if (this.state.currentSubwindow === 'distinctCourse') {
                subWindow = <DistinctCourse courseData={this.state.distinctCourseInfo} refreshPage={this.refreshPage}/>
            } else if (this.state.currentSubwindow === 'notifications') {
                subWindow = <Notifications />
            }

            return (
                <div>
                    <HomeCreateJoinModal enabled={this.state.displayModal}
                                         toggleModal={this.toggleModal}
                                         runDatabaseQuery={this.runDatabaseQuery}/>
                    <HomeNavbar showWelcomeLink={true} swapSubwindow={this.swapSubwindow} />
                    <div>
                        <HomeSidebar swapSubwindow={this.swapSubwindow} currentSubwindow={this.state.currentSubwindow}/>

                        <div style={{marginLeft: "4.5vw", paddingLeft: "4vw", marginTop: 0, paddingTop: "2vh"}}>
                            {subWindow}
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default UserHomePage