import React from 'react'
import Select from 'react-select'
import ClassSidebar from "./ClassSidebar"
import ModuleListing from './ModuleListing'
import ModuleSettingsModal from './ModuleSettingsModal'
import Database from '../Database'
import Authenticate from '../Authenticate'
import CalendarModal from './CalendarModal'
import AssignmentList from './AssignmentList'
import QuizAssignment from './QuizAssignment'
import Puzzle from './Puzzle'
import Video from './Video'
import ResourceListing from './ResourceListing.js'
import styled from "styled-components"
import {Link} from 'react-router-dom'
import { RedButton, GreenButton, Button } from '../Stylesheets/components/Modals/ModuleSettingsModalStyling'

const Greyhr = styled.hr`
    display: block;
    height: 1px;
    border: 0;
    border-top: .2vh solid #c0c0c0;
    margin: 0 8vw 2vh 0;
    padding: 0;
`;

const GreenInput = styled.input`
    background-color:#35b858;
    border-radius:23px;
    border:1px solid #18ab29;
    display:inline-block;
    cursor:pointer;
    color:#ffffff;
    font-family:Arial;
    font-size:16px;
    padding:5px 12px;
    text-decoration:none;
    text-shadow:0px 1px 0px #2f6627;
    margin-right: 1vw;
    margin-top: 1vh;

    transition: 0.5s all ease-out;
    &:hover {
        box-shadow: 0 12px 16px 0 rgba(0,0,0,0.1), 0 17px 25px 0 rgba(0,0,0,0.1);
    }
`;
class DistinctCourse extends React.Component {
    // Props passed in:
    // -courseData: object containing details about this specific course. Does NOT contain specific module data, however
    // -currentSubwindow: string that specifies which subwindow this component should display
    //        currently consists of modules, resources, classSettings
    constructor(props) {
        super(props)

        this.state = {
            // Boolean to switch between showing change class name box
            changeClassName: false,

            // Box to input class name for change class name.
            classBox: '',

            // array to kick indivisual students from class.
            selectedStudents: [],

            // Determines if it is a 'class' or 'curriculum'. Class  by default
            courseType: 'class',

            /* default to showing the modules page, can currently swap between 'modules',
            'resources', 'classSettings', 'classScheduler', 'announcements',
            'assignmentList', 'puzzle', 'quiz', and 'video' */
            currentSubwindow: 'modules',

            // contains all module data for this course
            finishedDatabaseQuery: false,
            allModuleData: null,

            // whether or not to display the module settings modal
            enableModuleModal: false,
            moduleModalData: null, //specific data for whatever module 'options' was selected

            moduleAccessData: null, // data for module that user is accessing

            announcement: "", // Used to hold announcement that coach is writing/posting

            assignmentNumber: 0, // The number of the assignment in the module's assignemnt list
            assignmentIndex: 0, // The index of the assignment in the module's assignemnt list
        }

        this.swapSubwindow = this.swapSubwindow.bind(this)
        this.triggerModuleModal = this.triggerModuleModal.bind(this)
        this.closeModuleModal = this.closeModuleModal.bind(this)
        this.handleChangeClass = this.handleChangeClass.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.setSelectedStudents = this.setSelectedStudents.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleKickStudents = this.handleKickStudents.bind(this)
        this.handleKickMembers = this.handleKickMembers.bind(this)
        this.runModuleQuery = this.runModuleQuery.bind(this)
        this.accessModule = this.accessModule.bind(this)
        this.handleSubmitAnnouncement = this.handleSubmitAnnouncement.bind(this)
        this.getModules = this.getModules.bind(this)

        // begin db query for all module data
        if ("id" in this.props.courseData) {
            this.state.courseType = "curriculum"
        }
        this.runModuleQuery()
    }

    runModuleQuery() {
        // Grab the module data for this specific curriculum OR class
        var courseData = this.props.courseData
        var tempThis = this

        let onSuccess = function(result) {
            tempThis.setState({finishedDatabaseQuery: true,
                               allModuleData: result})
        }

        let onFailure = function(error) {
            console.log("Error: " + error)
        }

        if (this.state.courseType === "class") {
            Database.getClassPageInfo(courseData.code, onSuccess, onFailure)
        } else if (this.state.courseType === "curriculum") {
            Database.getCurriculumPageInfo(courseData.id, onSuccess, onFailure)
        }
    }

    // Using the module data we have stored, sort and categorize all modules in the proper order for display
    getSortedModuleComponents() {
        var schedules = this.state.allModuleData.Data.Schedule
        var modules = this.state.allModuleData.Data.Curriculum

        // first we need to match each schedule to its curriculum and module data
        for (var schedule of schedules) {
            // check if this is a module that hasn't been assigned to a curriculum yet
            // if it hasn't, remove it from this list because we should ignore it
            if (!schedule.curriculum) {
                schedules.splice(schedules.indexOf(schedule), 1)
                continue
            }

            //get curriculum that this schedule is a member of to narrow it down
            var memberOf = schedule.curriculum
            var curricModules = null
            var curricName = null
            for (var i = 0; i < Object.keys(modules).length; i++) {
                var curriculum = Object.values(modules[i])[0] //an array of module objects
                if (curriculum.length === 0 || curriculum[0].moduleString === "[]") {
                    continue;
                }
                //check a module in the curriculum to see if this is the correct curriculum
                if (curriculum[0].curriculum === memberOf) {
                    curricModules = curriculum
                    // also grab the name of the curriculum, we will need that later
                    curricName = modules[i].Name
                    break
                }
            }

            if (curricModules === null) {
                continue
            }

            //now that we have the curriculum that contains the module,
            // search again for the module
            for (i = 0; i < curricModules.length; i++) {
                var currModule = curricModules[i]
                if (currModule.id === schedule.id) { //we've found the module
                    //store the module information inside the schedule object
                    schedule.module = currModule
                    //also store the name of the curriculum in the schedule
                    schedule.curricName = curricName
                    //also store a list of the students for the ModuleSettingsModal
                    //to eventually work with
                    schedule.allStudents = this.state.allModuleData.Data.Students
                    // also store the class code for whatever class we're in, for
                    // changing settings
                    schedule.classCode = this.props.courseData.code
                }
            }
        }

        //next we need to categorize all schedules into 4 types
        // 1: the schedules that do not have a due date or release date assigned
        // 2: the schedules that are not yet released (currDate < releaseDate < dueDate)
        // 3: the schedules that have passed their due date (releaseDate < dueDate < currDate)
        // 4: the schedules that are released and due in the future (releaseDate < currDate < dueDate)

        var unassigned = []
        var unreleased = []
        var past = []
        var assigned = []
        var currDate = Date.now()
        // define categorizing function
        function dateCategorizer(schedule) {
            if (schedule.openTime === "" || schedule.closeTime === "") { //unassigned modules
                unassigned.push(schedule)
                return
            }
            var releaseDate = new Date(schedule.openTime)
            var dueDate = new Date(schedule.closeTime)
            if (currDate < releaseDate) { // future, unreleased assignments
                unreleased.push(schedule)
            } else if (dueDate < currDate) { // past assignments
                past.push(schedule)
            } else { // currently assigned schedules
                assigned.push(schedule)
            }
        }
        schedules.forEach(elem => dateCategorizer(elem))

        // Then sort every container appropriately (from earliest to latest)
        var releaseDateComparator = function(scheduleA, scheduleB) {
            return new Date(scheduleA.openTime) - new Date(scheduleB.openTime)
        }
        var dueDateComparator = function(scheduleA, scheduleB) {
            return new Date(scheduleA.closeTime) - new Date(scheduleB.closeTime)
        }
        unreleased.sort(releaseDateComparator)
        past.sort(dueDateComparator)
        assigned.sort(dueDateComparator)

        // If the user is a coach, should be able to view all modules.
        let isCoach = false
        if (Authenticate.getUserType() === "Coach") {
            isCoach = true
        }

        //Finally, turn every module into a ModuleListing component and return
        unassigned = unassigned.map((element, index) =>
            <ModuleListing
              key={"unassigned" + index}
              triggerModuleModal={this.triggerModuleModal}
              moduleData={element}
              accessModule={this.accessModule}
              enabled={isCoach}
              progress={this.state.allModuleData.Data.Progress}/>
        )
        unreleased = unreleased.map((element, index) =>
            <ModuleListing
              key={"unreleased" + index}
              triggerModuleModal={this.triggerModuleModal}
              moduleData={element}
              accessModule={this.accessModule}
              enabled={isCoach}
              progress={this.state.allModuleData.Data.Progress}/>
        )
        past = past.map((element, index) =>
            <ModuleListing
              key={"past" + index}
              triggerModuleModal={this.triggerModuleModal}
              moduleData={element}
              accessModule={this.accessModule}
              enabled={true}
              progress={this.state.allModuleData.Data.Progress}/>
        )
        assigned = assigned.map((element, index) =>
            <ModuleListing
              key={"assigned" + index}
              triggerModuleModal={this.triggerModuleModal}
              moduleData={element}
              accessModule={this.accessModule}
              enabled={true}
              progress={this.state.allModuleData.Data.Progress}/>
        )

        return [unassigned, unreleased, past, assigned]
    }

    // Compare function for sorting modules by order
    compareModules(a, b) {
        return a.order - b.order
    }

    // Used to display modules for a curriculum (not a class)
    getCurriculumModules() {
        var curriculumData = this.state.allModuleData.Data // Gives two arrays Modules and Progress
        curriculumData.Modules.sort(this.compareModules) // Modules is now sorted by order

        var modules = []
        let noUncompleted = true
        for (let i = 0; i < curriculumData.Modules.length; i++) {

            // Loops are a check to see if the curriculum is unlocked for a student or complete.
            let mayAccess = false

            for (let j = 0; j < curriculumData.Progress.length; j++) {
                if ((curriculumData.Progress[j].module === curriculumData.Modules[i].id)
                    && !curriculumData.Progress[j].completed
                    && noUncompleted) {
                    mayAccess = true
                    noUncompleted = false
                } else if ((curriculumData.Progress[j].module === curriculumData.Modules[i].id)
                    && curriculumData.Progress[j].completed) {
                    mayAccess = true
                }
            }

            modules.push(<ModuleListing
              key={"assigned" + i}
              triggerModuleModal={this.triggerModuleModal}
              moduleData={curriculumData.Modules[i]}
              isCurriculum={true}
              accessModule={this.accessModule}
              enabled={mayAccess}
              progress={this.state.allModuleData.Data.Progress}/>)
        }

        return modules
    }

    // Pass this function to the ClassSidebar and the AssignmentList
    swapSubwindow(swapTo, isAssignment, assignmentNum, assignmentInd){
        this.setState({finishedDatabaseQuery: false})
        this.runModuleQuery()

        this.setState({currentSubwindow: swapTo})

        if (isAssignment) {
            this.setState({assignmentNumber: assignmentNum, assignmentIndex: assignmentInd})
        }
    }

    //turn the ModuleSettingsModal on within this component
    triggerModuleModal(moduleData) {
        this.setState({enableModuleModal: true,
                       moduleModalData: moduleData})
    }
    closeModuleModal() {
        this.setState({enableModuleModal: false})
    }

    // onClick function that will be passed in to ModuleListing
    accessModule(allow, isClass, isAssigned, moduleData) {
        if (allow && isAssigned) {
            this.setState({currentSubwindow: "assignmentList", moduleAccessData: moduleData})
        } else {
            if (isClass) {
                if (isAssigned === false) {
                    alert("You are not assigned to this module")
                } else {
                    alert("This module has not yet been released.")
                }
            } else {
                alert("You have not unlocked this module yet. Complete the previous module to unlock it.")
            }
        }
    }

    /*
    * class name update
    * newClassName is new class name
    * classCode is the code for the class
    */
    handleSubmit(event) {
        event.preventDefault();
        var newClassName = this.state.classBox;
        var classCode = this.props.courseData.code;

        var thisTemp = this;

        var onSuccess = function(result) {
            alert(result)
            thisTemp.handleChangeClass();
            thisTemp.props.refreshPage(newClassName)
        }
        var onFailure = function(error) {
            alert(error);
        }

        Database.changeClassName(classCode, newClassName, onSuccess, onFailure);
    }

    // handles the changing of class name
    handleChangeClass(event) {
        this.setState({
            changeClassName: !this.state.changeClassName,
            classBox: ''
        });
    }

    // update state or text box fields
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    // handles selecting students to be kicked from class
    setSelectedStudents(selected) {
        this.setState({selectedStudents: selected})
    }

    /*
     * default kick students method to remove all students from the class
     * goes through member JSON and grabs usernames into removelist
     * calls kickStudents with all students list
     */
    handleKickStudents(event) {
        let tempThis = this
        if (window.confirm('Are you sure you want kick all members (including co-coaches)? All student progress will be lost.')) {
            let onSuccess = function(result) {
                alert("All members have been removed from your class")
                tempThis.setState({selectedStudents: []})
                tempThis.runModuleQuery()
            }

            let onFailure = function(error) {
                console.log("Error: " + error)
                alert("Error: " + error)
            }

            Database.kickAllMembers(this.props.courseData.code, onSuccess, onFailure)
        }
    }

    handleKickMembers(event) {
        let kickList = []
        for (const student of this.state.selectedStudents) {
            kickList.push(student.value)
        }
        let tempThis = this
        if (window.confirm('You have selected students:  ' + kickList +'. Are you sure you want kick these students? Their progress will be lost.')) {
            let onSuccess = function(result) {
                alert(kickList + " have been removed from your class")
                tempThis.setState({selectedStudents: []})
                tempThis.runModuleQuery()
            }

            let onFailure = function(error) {
                console.log("Error: " + error)
            }

            Database.kickMembers(this.props.courseData.code, kickList, onSuccess, onFailure)
        }
    }

    /* This function currently is called by the form in the render method to handle
    a submission of an announcement. */
    handleSubmitAnnouncement(event) {
        let onSuccess = function(result) {
            alert("Announcement successfully made and may be viewed in Notifications.")
        }

        let onFailure = function(error) {
            console.log("Error: " + error)
        }

        Database.createAnnouncement(this.props.courseData.code, this.state.announcement, onSuccess, onFailure)

        event.preventDefault(); /* This is so the page won't refresh when a user
        submits (for some reason) causes a Network Error.*/
    }

    /* Returns a list of the resources PDFs in a specific module. For resource
    subwindow.
    */
    getModules() {
        let currics = this.state.allModuleData.Data.Curriculum
        let listOfModulePDFs = []

        for (let i = 0; i < currics.length; i++) {
            let modules = Object.values(currics[i])[0]
            for (let j = 0; j < modules.length; j++) {
                listOfModulePDFs.push(
                    <ResourceListing moduleName={modules[j].name} moduleId={modules[j].id}/>
                )
            }
        }

        return listOfModulePDFs
    }


    render() {
        if (!this.state.finishedDatabaseQuery) {
            return <div> <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading"/> </div>
        }

        if (this.state.courseType === "class") {
            //get all the modules categorized and sorted by release/due date
            // var unassigned, unreleased, past, assigned
            var sortedModules = this.getSortedModuleComponents()
            var unassignedModules = sortedModules[0]
            var unreleasedModules = sortedModules[1]
            var pastModules = sortedModules[2]
            var assignedModules = sortedModules[3]

            var data = this.props.courseData
            var classname = data.name
            var content
            if (this.state.currentSubwindow === 'modules') {
                content = (
                    <div style={{marginRight:"12vw"}}>
                        <div>
                            <div style={{padding: "2vh", backgroundColor: "#ebebeb", borderRadius: "1vh", border: "solid", borderColor: "#c0c0c0"}}>
                                <h2 style={{marginTop:0}}> Current Modules </h2>
                                {assignedModules}

                                <h2> Past Modules </h2>
                                {pastModules}


                                <h2> Future Modules </h2>
                                {unreleasedModules}
                                {unassignedModules}
                            </div>
                        </div>
                    </div>
                )
            } else if (this.state.currentSubwindow === 'resources') {
                content = (
                    <div>
                        <h3>
                            Resources
                        </h3>
                        {this.getModules()}
                    </div>
                )
            } else if (this.state.currentSubwindow === 'announcements') {
                content = (
                    <div>
                        <h4>
                            Make an announcement below (There is a limit of 20 announcements for a class before the oldest announcements are deleted):
                        </h4>
                        <form id= "theForm" onSubmit= {this.handleSubmitAnnouncement}>
                            <textarea rows="30"
                                cols="50"
                                form= "theForm"
                                value = {this.state.announcement}
                                onChange = {this.handleChange}
                                name= "announcement"
                                minLength={"5"}
                                maxLength={"300"}>
                            </textarea>

                            <div>
                                <GreenInput type= "submit" value= "Add Announcement"/>
                            </div>
                        </form>
                    </div>
                )
            } else if (this.state.currentSubwindow === 'classSettings') {
                let courseData = this.props.courseData
                let students = this.state.allModuleData.Data.Students
                let options = []
                for (const studentName of students) {
                    options.push({value: studentName, label: studentName})
                }

                let numCoaches = 0
                if (courseData.subCoaches !== undefined && courseData.subCoaches) {
                    for (const coach of courseData.subCoaches) {
                        if (coach === ",") {
                            numCoaches++
                        }
                    }
                    numCoaches++
                }
                let currCapacity = options.length + numCoaches


                content = (
                    <div>
                        <div>
                            <p style={{fontWeight: "bold", marginBottom: 0}}>Current Class Name:</p>
                            <p style={{marginTop: 0}}>{courseData.name}</p>

                            <p style={{fontWeight: "bold", marginBottom: 0}}>Join Class Codes:</p>
                            <p style={{marginTop: 0, marginBottom: 0}}> This code is for co-coaches to join your class. </p>
                            <p style={{marginTop: 0}}> <strong> Coach Code: </strong> {courseData.code}</p>

                            <p style={{marginTop: 0, marginBottom: 0}}> This code is for students to join your class. </p>
                            <p style={{marginTop: 0}}> <strong> Students Code: </strong> {courseData.studentCode}</p>

                            <p style={{fontWeight: "bold", marginBottom: 0}}>Class Capacity:</p>
                            <p style={{marginTop: 0, marginBottom: 0}}> Current Class Size: {currCapacity} </p>
                            <p style={{marginTop: 0, marginBottom: 0}}> Maximum Class Capacity: {courseData.maxSize} </p>
                            <Link to="/pricing">
                                <GreenButton style={{marginLeft: 0, marginBottom:"1vh"}} name={"Expand Classroom Size"} value={"button"}>
                                    Expand Classroom Size
                                </GreenButton>
                            </Link>
                            <div>
                                {/*conditional render based on changeClassName value */}
                                {this.state.changeClassName &&
                                    <form onSubmit={this.handleSubmit}>
                                        <input
                                            style={{fontSize:"1.7vh", height: "2vh", marginBottom:"1vh"}}
                                            type={"text"}
                                            name={"classBox"}
                                            value={this.state.classBox}
                                            placeholder={"new class name"}
                                            onChange={this.handleChange}
                                            minLength={"5"}
                                            maxLength={"30"}
                                        />
                                        <input
                                            style={{
                                                backgroundColor:"#35b858",
                                                borderRadius:"23px",
                                                border:"1px solid #18ab29",
                                                display:"inline-block",
                                                cursor:"pointer",
                                                color:"#ffffff",
                                                fontFamily:"Arial",
                                                fontSize:"16px",
                                                padding:"5px 12px",
                                                textDecoration:"none",
                                                textShadow:"0px 1px 0px #2f6627",
                                                marginLeft: "1vw",
                                                marginRight: "1vw",
                                                marginBottom:"1vh"}}
                                            type={"submit"}
                                            value={"Submit"}
                                        />
                                    </form>
                                }
                                <Button style={{marginBottom: "1vh"}} onClick={this.handleChangeClass} name={"Change Class Name"} value={"button"}>
                                    {this.state.changeClassName ? 'Cancel' : 'Change Class Name'}
                                </Button>
                            </div>

                            <RedButton style={{marginLeft: 0}} onClick={(event) => this.handleKickStudents()} name={"Kick All Students"} value={"button"}>
                                Kick All Class Members
                            </RedButton>

                            <div style={{width:"50%"}}>
                                <p style={{marginBottom: 0}}>Select students to remove from class</p>
                                <Select
                                    style={{height: "15vh", width:"50%"}}
                                    value={this.state.selectedStudents}
                                    onChange={this.setSelectedStudents}
                                    isMulti
                                    options={options}
                                />
                            </div>
                            <RedButton style={{marginLeft:0, marginTop:"1vh"}} onClick={(event) => this.handleKickMembers()} name={"Kick Selected Students"} value={"button"}>
                                Kick Selected Students
                            </RedButton>
                        </div>
                    </div>
                )
            } else if (this.state.currentSubwindow === 'classScheduler') {
                content = (
                    <div style={{width: "60vw", height: "60vh"}}>
                        <CalendarModal
                            schedule={this.state.allModuleData.Data.Schedule}
                            curriculums={this.state.allModuleData.Data.Curriculum}
                            classCode={this.props.courseData.code}
                            allModuleData={this.state.allModuleData}
                            runModuleQuery={this.runModuleQuery}
                        />
                    </div>
                )
            } else if (this.state.currentSubwindow === 'assignmentList') {
                content = (
                    <div style={{width: "45vw", height: "45vh"}}>
                        <AssignmentList
                        moduleData={this.state.moduleAccessData}
                        isClass={true}
                        swap={this.swapSubwindow}
                        progress={this.state.allModuleData.Data.Progress}/>
                    </div>
                )
            } else if (this.state.currentSubwindow === 'quiz') {
                content = (
                    <div style={{width: "45vw", height: "45vh"}}>
                        <QuizAssignment moduleData={this.state.moduleAccessData}
                        isClass={true}
                        assignmentNum={this.state.assignmentNumber}
                        assignmentInd={this.state.assignmentIndex}
                        code={this.props.courseData.code}
                        swap={this.swapSubwindow}
                        retake={false}/>
                    </div>
                )
            } else if (this.state.currentSubwindow === 'puzzle') {
                content = (
                    <div style={{width: "45vw", height: "45vh"}}>
                        <Puzzle moduleData={this.state.moduleAccessData}
                        isClass={true}
                        assignmentNum={this.state.assignmentNumber}
                        assignmentInd={this.state.assignmentIndex}
                        code={this.props.courseData.code}
                        swap={this.swapSubwindow}/>
                    </div>
                )
            } else if (this.state.currentSubwindow === 'video') {
                content = (
                    <div style={{width: "45vw", height: "45vh"}}>
                        <Video moduleData={this.state.moduleAccessData}
                        isClass={true}
                        code={this.props.courseData.code}
                        swap={this.swapSubwindow}
                        assignmentNum={this.state.assignmentNumber}
                        assignmentInd={this.state.assignmentIndex}/>
                    </div>
                )
            }

            return (
                <div>
                    <h1 style={{marginTop: 0}}> {classname} </h1>

                    <Greyhr />

                    {Authenticate.getUserType() === "Coach" ?
                        <div>
                            <ClassSidebar swapSubwindow={this.swapSubwindow} currentSubwindow={this.state.currentSubwindow}/>
                            <div style= {{marginLeft: "14vw"}}>
                                {content}

                                {this.state.enableModuleModal
                                    ? <ModuleSettingsModal
                                        moduleData={this.state.moduleModalData}
                                        closeModule={this.closeModuleModal}
                                        runModuleQuery={this.runModuleQuery}
                                      />
                                    : null}
                            </div>
                        </div> :
                        <div>
                            {content}
                        </div>
                    }
                </div>
            )
        } else if (this.state.courseType === "curriculum") {
            var modules = this.getCurriculumModules()

            data = this.props.courseData
            var curriculumName = data.name
            if (this.state.currentSubwindow === 'modules') {
                content = (
                    <div style={{marginRight:"12vw"}}>
                        <div style={{padding: "2vh", backgroundColor: "#ebebeb", borderRadius: "1vh", border: "solid", borderColor: "#c0c0c0"}}>
                            <div>
                                <h2 style={{marginTop: 0}}>Modules</h2>
                                {modules}
                            </div>
                        </div>
                    </div>
                )
            } else if (this.state.currentSubwindow === 'assignmentList') {
                content = (
                    <div style={{width: "45vw", height: "45vh"}}>
                        <AssignmentList moduleData={this.state.moduleAccessData}
                        isClass={false}
                        swap={this.swapSubwindow}
                        progress={this.state.allModuleData.Data.Progress}/>
                    </div>
                )
            } else if (this.state.currentSubwindow === 'quiz') {
                content = (
                    <div style={{width: "45vw", height: "45vh"}}>
                        <QuizAssignment
                        moduleData={this.state.moduleAccessData}
                        isClass={false}
                        assignmentNum={this.state.assignmentNumber}
                        assignmentInd={this.state.assignmentIndex}
                        swap={this.swapSubwindow}
                        retake={false}/>
                    </div>
                )
            } else if (this.state.currentSubwindow === 'puzzle') {
                content = (
                    <div style={{width: "45vw", height: "45vh"}}>
                        <Puzzle
                        moduleData={this.state.moduleAccessData}
                        isClass={false}
                        assignmentNum={this.state.assignmentNumber}
                        assignmentInd={this.state.assignmentIndex}
                        swap={this.swapSubwindow}/>
                    </div>
                )
            } else if (this.state.currentSubwindow === 'video') {
                content = (
                    <div style={{width: "45vw", height: "45vh"}}>
                        <Video moduleData={this.state.moduleAccessData}
                        isClass={false}
                        assignmentNum={this.state.assignmentNumber}
                        assignmentInd={this.state.assignmentIndex}
                        swap={this.swapSubwindow}/>
                    </div>
                )
            }

            return (
                <div>
                    <h1 style={{marginTop: 0}}> {classname} {curriculumName}</h1>

                    <Greyhr />

                    <div>
                        {content}
                    </div>
                </div>
            )
        }
    }
}

export default DistinctCourse