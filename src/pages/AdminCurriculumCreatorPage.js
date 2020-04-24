import React from "react"

import Authenticate from "../Authenticate"
import Database from "../Database"
import {Redirect} from 'react-router-dom'

import AdminModuleListing from "./../components/AdminModuleListing"
import AdminCurricListing from "./../components/AdminCurricListing"
import AdminSidebar from "./../components/AdminSidebar"
import AdminAssignmentsModal from './../components/AdminAssignmentsModal'
import AdminCurriculumModal from './../components/AdminCurriculumModal'
import AdminMakerVideo from './../components/AdminMakerVideo'
import AdminMakerPuzzle from './../components/AdminMakerPuzzle'
import AdminMakerQuiz from './../components/AdminMakerQuiz'
import AdminNavbar from '../components/AdminNavbar'
import ResourceUploader from '../components/ResourceUploader'

import {RedButton} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"

import styled from "styled-components"

import {GreenButton} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"

const Greyhr = styled.hr`
    display: block;
    height: 1px;
    border: 0;
    border-top: .2vh solid #c0c0c0;
    margin: 0 8vw 2vh 0;
    padding: 0;
`;
class AdminCurriculumCreatorPage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            //swaps between curriculum creator subwindows
            // main: shows list of curriculums and modules
            // puzzle: shows quiz assignment maker
            // quiz: shows video assignment maker
            // video: shows tactics puzzle creator
            // resource: shows resource pdf uploader
            subwindow: "main",

            modulesList: null, //list of all the modules
            selectedModule:null,
            showAssignmentsModal: false,
            newAssignmentNumber: 0, //number for a new assignment for the current module
            assignmentData:null,

            curricList: null,
            selectedCurric: null,
            showCurriculumModal: false,

            triggerLogout: false,

            queryFinished: false //are we done querying the database?
        }

        this.swapSubwindow = this.swapSubwindow.bind(this)
        this.setSelectedModule = this.setSelectedModule.bind(this)
        this.setSelectedCurric = this.setSelectedCurric.bind(this)
        this.toggleAssignmentsModal = this.toggleAssignmentsModal.bind(this)
        this.toggleCurriculumModal = this.toggleCurriculumModal.bind(this)
        this.goAssignmentSubwindow = this.goAssignmentSubwindow.bind(this)
        this.logout = this.logout.bind(this)
        this.handleCreateModule = this.handleCreateModule.bind(this)
        this.queryDatabase = this.queryDatabase.bind(this)
        this.getCurricAssignableModules = this.getCurricAssignableModules.bind(this)
        this.handleCreateCurric = this.handleCreateCurric.bind(this)

        this.queryDatabase()
    }

    queryDatabase() {
        // Query database for the modules list and curriculum list
        let tempThis = this
        let curricOnSuccess = function(result) {
            tempThis.setState({curricList: result.Data,
                               queryFinished: true, showCurriculumModal: false})
        }
        let curricOnFail = function(result) {
            tempThis.setState({curricList: null,
                               queryFinished: true})
            alert("Failed to populate curriculum list")
        }
        let moduleOnSuccess = function(result) {
            //console.log(result)
            tempThis.setState({modulesList: result.Data})
            Database.getAllCurriculums(curricOnSuccess,curricOnFail)
        }
        let moduleOnFail = function(result) {
            tempThis.setState({modulesList: null,
                           queryFinished: true})
            alert("Failed to populate module list")
        }
        Database.getAllModules(moduleOnSuccess, moduleOnFail)
    }

    //swap between subwindows
    swapSubwindow(nextSubwindow) {
        this.setState({subwindow: nextSubwindow})
    }

    // for assignment modal
    setSelectedModule(moduleId, moduleName){
        this.setState({selectedModule: {id:moduleId, name:moduleName}})
    }
    toggleAssignmentsModal() {
        this.setState({showAssignmentsModal: !this.state.showAssignmentsModal})
    }

    // for curriculum modal
    setSelectedCurric(curric) {
        this.setState({selectedCurric: curric})
    }
    toggleCurriculumModal() {
        this.setState({showCurriculumModal: !this.state.showCurriculumModal})
    }

    //Used to go to a specific assignment subwindow
    // assignType should be a valid subwindow string, e.g. quiz
    // if assignData/assignNum is null, it will be for a new assignment.
    // otherwise it will be to edit an existing assignment
    // newNumber is used to determine the assignment_number for new assignments.
    // It should be a unique number that no other assignment uses
    goAssignmentSubwindow(assignType, assignData=null, newNumber=null) {
        this.setState({assignmentData: assignData,
                       newAssignmentNumber: newNumber})
        this.swapSubwindow(assignType)
    }

    // //applies list of modules
    // //doesn't worry about assignments or anything, just the modules and their order
    // setModulesList(newList) {
    //     //TODO: change order of list in database and frontend when that works
    // }

    handleCreateModule() {
        let tempThis = this
        let onCreateSuccess = function(result) {
            tempThis.queryDatabase()
        }
        let onCreateFail = function(error) {
            alert("Error: module creation failed")
            //console.log(error)
        }

        Database.createModule(onCreateSuccess, onCreateFail, "NEW UNNAMED MODULE")
    }

    handleCreateCurric() {
        let tempThis = this
        let onCreateSuccess = function(result) {
            tempThis.queryDatabase()
        }
        let onCreateFail = function(error) {
            alert("Error: curriculum creation failed")
            //console.log(error)
        }

        Database.createCurriculum(onCreateSuccess, onCreateFail)
    }

    // returns a list of module names and id's that
    // are A. either currently assigned to the curriculum or
    // B. not assigned to any curriculum yet
    getCurricAssignableModules(curricId) {
        let assignables = []
        for (module of this.state.modulesList) {
            if (!module.curriculum || module.curriculum === curricId) { //unassigned or already assigned
                assignables.push(module)
            }
        }
        return assignables
    }

    logout() {
        Authenticate.signout();
        this.setState({triggerLogout:true})
    }

    render() {
        if (!this.state.queryFinished) {
            return(
                <div>
                    <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading" style={{marginLeft: "40vw", paddingTop: "30vh"}}/>
                </div>
            )
        }


        if (this.state.triggerLogout) {
            return (<Redirect push to={{ pathname: '/login' }} />)
        }

        // set up subwindow content
        let content
        let currSubwindow = this.state.subwindow
        if (currSubwindow === "main") {
            content = (
                <div>

                    <h2>Curriculums:</h2>
                    <div style={{padding: "2vh", backgroundColor: "#ebebeb", borderRadius: "1vh", border: "solid", borderColor: "#c0c0c0"}}>
                        {this.state.curricList.map(curric =>
                            <AdminCurricListing
                                key={curric.id}
                                curricId={curric.id}
                                curricName={curric.name}
                                curricColor={curric.color}
                                curricDesc={curric.description}
                                curricPiece={curric.piece}
                                curricPrice={curric.price}
                                moduleIds={curric.moduleIds}
                                published={curric.published}
                                toggleModal={this.toggleCurriculumModal}
                                setSelectedCurric={this.setSelectedCurric}
                            />
                        )}
                    </div>
                    <GreenButton style={{marginLeft: 0, marginTop: "2vh"}} onClick={this.handleCreateCurric}>Create New Curriculum</GreenButton>

                    <h2>Modules:</h2>
                    <div style={{padding: "2vh", backgroundColor: "#ebebeb", borderRadius: "1vh", border: "solid", borderColor: "#c0c0c0"}}>
                        {this.state.modulesList.map(aModule =>
                            <AdminModuleListing
                                key={aModule.id}
                                moduleId={aModule.id}
                                moduleName={aModule.name}
                                toggleModal={this.toggleAssignmentsModal}
                                setSelectedModule={this.setSelectedModule}
                            />
                        )}
                    </div>

                    <GreenButton style={{marginLeft: 0, marginTop: "2vh", marginBottom: "2vh"}} onClick={this.handleCreateModule}>Create New Module</GreenButton>
                </div>
            )
        } else if (currSubwindow === "puzzle") {
            content = (
                <div>
                    <AdminMakerPuzzle
                        assignmentData={this.state.assignmentData}
                        selectedModuleName={this.state.selectedModule.name}
                        selectedModuleId={this.state.selectedModule.id}
                        newAssignmentNumber={this.state.newAssignmentNumber}/>
                    <RedButton style={{marginLeft: 0}} onClick={() => this.swapSubwindow("main")}>Back</RedButton>
                </div>
            )
        } else if (currSubwindow === "quiz") {
            content = (
                <div>
                    <AdminMakerQuiz
                        assignmentData={this.state.assignmentData}
                        selectedModuleName={this.state.selectedModule.name}
                        selectedModuleId={this.state.selectedModule.id}
                        moduleLength={this.state.moduleLength}
                        newAssignmentNumber={this.state.newAssignmentNumber}/>
                    <RedButton style={{marginLeft: 0}} onClick={() => this.swapSubwindow("main")}>Back</RedButton>
                </div>
            )
        } else if (currSubwindow === "video") {
            content = (
                <div>
                    <AdminMakerVideo
                        assignmentData={this.state.assignmentData}
                        selectedModuleName={this.state.selectedModule.name}
                        selectedModuleId={this.state.selectedModule.id}
                        swapSub={this.swapSubwindow.bind(this)}
                        newAssignmentNumber={this.state.newAssignmentNumber}/>
                    <RedButton style={{marginLeft: 0}} onClick={() => this.swapSubwindow("main")}>Back</RedButton>
                </div>
            )
        } else if (currSubwindow === "resource") {
            content = (
                <div>
                    <ResourceUploader
                        selectedModuleName={this.state.selectedModule.name}
                        selectedModuleId={this.state.selectedModule.id}/>
                    <RedButton style={{marginLeft: 0}} onClick={() => this.swapSubwindow("main")}>Back</RedButton>
                </div>
            )
        }

        return (
            <div>
                <AdminNavbar />
                <div>
                    <AdminSidebar currPage={"creator"}/>
                    <div style={{marginLeft:"6.5vw", marginRight: "12.5vw", paddingLeft: "4vw", marginTop: 0, paddingTop: "2vh"}}>
                        <h1 style={{marginTop: 0}}> Curriculum Creator </h1>

                        <Greyhr />

                        {content}

                        {this.state.showAssignmentsModal
                            ? <AdminAssignmentsModal
                                toggleModal={this.toggleAssignmentsModal}
                                goAssignmentSubwindow={this.goAssignmentSubwindow}
                                selectedModule={this.state.selectedModule}
                                rerunQuery={this.queryDatabase}/>
                            : null }

                        {this.state.showCurriculumModal
                            ? <AdminCurriculumModal
                                toggleModal={this.toggleCurriculumModal}
                                selectedCurric={this.state.selectedCurric}
                                rerunQuery={this.queryDatabase}
                                getAssignableModules={this.getCurricAssignableModules}
                            />
                            : null }

                    </div>
                </div>
            </div>
        )
    }
}

export default AdminCurriculumCreatorPage