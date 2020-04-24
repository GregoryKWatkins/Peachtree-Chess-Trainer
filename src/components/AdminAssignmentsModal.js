import React from "react"

import Database from "../Database"
import {ModalBG, DefaultContainer, Button, GreenButton, RedButton} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling.js"

class AdminAssignmentsModal extends React.Component {
    // receives as props:
    // toggleModal: used to toggle itself back off
    // goAssignmentSubwindow: used to begin making/editing a selected assignment
    // selectedModule: which module is selected. How we tell what assignments to show
    //     contains 'id' and 'name'
    // rerunQuery: for rerunning the database query after making a change to the backend (for the stuff on the curric creator page, not for the modal)
    constructor(props) {
        super(props)

        this.state = {
            assignmentsData: null,
            newAssignmentNumber: 0, //assignment_number used if we make a new assignment
            queryFinished: false,
            moduleName: this.props.selectedModule.name,
            hasVideo: false  /* If already have a video assignment
            then add video just brings up editor for old assignment. */
        }

        this.runQuery = this.runQuery.bind(this)

        this.runQuery()
    }

    runQuery() {
        //query for assignment data about this module
        let tempThis = this
        let assignmentsOnSuccess = function(result) {
            //let's find out what the newAssignmentNumber would be if we end up making a new assignment
            let currNewNumber = 0
            for (const assign of result.Data) { // find the max
                if (assign.assignment_number > currNewNumber) {
                    currNewNumber = assign.assignment_number
                }
            }
            currNewNumber += 1 //add 1, now we know it's unique

            tempThis.setState({assignmentsData: result.Data,
                               newAssignmentNumber: currNewNumber,
                               queryFinished: true})
        }
        let assignmentsOnFail = function(result) {
            tempThis.setState({assignmentsData: null,
                               queryFinished: true})
            alert("Failed to populate assignment list")
        }
        Database.getModuleContent(this.props.selectedModule.id,
                assignmentsOnSuccess, assignmentsOnFail)
    }

    // if someone clicks an existing assignment
    handleAssignmentClick(assignment) {
        this.props.goAssignmentSubwindow(assignment.assignment_type,
                                             assignment, null)
        this.props.toggleModal()
    }
    // if someone clicks one of the make assignment buttons
    handleNewClick(assignType) {
        this.props.goAssignmentSubwindow(assignType,
                                         null, this.state.newAssignmentNumber)
        this.props.toggleModal()
    }

    handleAssignmentDelete(assignmentNumber) {
        if (window.confirm("Are you sure you would like to permanently delete this assignment?")) {
            let tempThis = this
            let moduleId = this.props.selectedModule.id
            let onDeleteSuccess = function(result) {
                alert("Assignment deleted")
                tempThis.runQuery()
            }
            let onDeleteFail = function(error) {
                alert("Error: Deletion failed")
            }
            Database.deleteAssignment(assignmentNumber, moduleId, onDeleteSuccess, onDeleteFail)
        }
    }

    handleModuleDelete() {
        if (window.confirm("Are you sure you would like to delete this module? All assignments that are part of this module will also be permanently lost.")) {
            let moduleId = this.props.selectedModule.id
            let tempThis = this
            let onDeleteSuccess = function(result) {
                alert("Module deleted")
                tempThis.props.toggleModal()
                tempThis.props.rerunQuery()
            }
            let onDeleteFail = function(error) {
                alert("Error: Deletion failed")
            }
            Database.deleteModule(moduleId, onDeleteSuccess, onDeleteFail)
        }
    }

    //update state value for module name
    handleModuleNameChange(event) {
        let newName = event.target.value
        this.setState({moduleName: newName})
    }
    // apply module name update
    handleSubmitNewModuleName() {
        let moduleId = this.props.selectedModule.id
        let newName = this.state.moduleName

        let tempThis = this
        let onRenameSuccess = function(result) {
            alert("Module renamed successfully")
            tempThis.props.rerunQuery()
        }
        let onRenameFail = function(error) {
            alert("Error: Deletion failed")
        }

        Database.editModule(moduleId, onRenameSuccess, onRenameFail, null, newName, null)
    }

    render() {
        let content
        if (!this.state.queryFinished) {
            content = (
                <div> <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading"/> </div>
            )

        } else {
            //Create list of assignments from database and show
            content = (
                <div>
                    <h2>Set Module Contents</h2>
                    <p><strong>Module Name:</strong></p>
                    <textarea
                        style={{resize: "none", width:"40%", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                        rows="1"
                        cols="50"
                        maxLength={50}
                        value={this.state.moduleName}
                        onChange={(event) =>
                            this.handleModuleNameChange(event)}
                        name="moduleName"
                        minLength="1"
                    ></textarea>
                    <Button style={{float:"right", marginRight: "5vw"}} onClick={() => this.handleSubmitNewModuleName()}>Change Name</Button>

                    <div style={{overflowY:"auto", maxHeight: "250px", marginBottom:"2vh"}}>
                        {this.state.assignmentsData.map(assignment =>
                            <div key={assignment.assignment_number} style={{marginBottom:"1vh"}}>
                                <p style={{display:"inline-block", margin: 0, width: "50%"}}><strong>{assignment.assignment_type.charAt(0).toUpperCase() +
                                    assignment.assignment_type.substring(1)}</strong>
                                    : {assignment.assignment_name != null
                                            ? assignment.assignment_name
                                            : "unnamed assignment"
                                    }</p>

                                <Button style={{}} onClick={() => this.handleAssignmentClick(assignment)}>
                                    Edit
                                </Button>

                                <RedButton style={{marginLeft: "1vw"}}onClick={() => this.handleAssignmentDelete(assignment.assignment_number)}>
                                    Delete
                                </RedButton>
                            </div>
                        )}
                    </div>

                    <div style={{textAlign:"center", marginBottom:"2vh"}}>
                        <div style={{marginBottom:"1vh"}}>
                            <GreenButton onClick={() => this.handleNewClick("video")}>New Video</GreenButton>
                            <GreenButton onClick={() => this.handleNewClick("quiz")}>New Quiz</GreenButton>
                        </div>
                        <div>
                            <GreenButton onClick={() => this.handleNewClick("puzzle")}>New Tactics Puzzle</GreenButton>
                            <GreenButton onClick={() => this.handleNewClick("resource")}>Add/Delete Coach Resource</GreenButton>
                        </div>

                    </div>

                    <div>
                        <RedButton onClick={this.props.toggleModal}>Cancel</RedButton>
                        <RedButton onClick={() => this.handleModuleDelete()}>Delete Module</RedButton>
                    </div>
                </div>
            )
        }

        return (
             <ModalBG >
                <DefaultContainer style={{height: "55vh"}}>
                    {content}
                </DefaultContainer>
            </ModalBG>
        )
    }
}

export default AdminAssignmentsModal