import React from 'react'

import DatePicker from "react-datepicker";
import Select from 'react-select'
import Database from '../Database'

import "react-datepicker/dist/react-datepicker.css"
import {ModalBG, DefaultContainer, Button, Forminputs} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling.js"



class ModuleSettingsModal extends React.Component {
    // Receives as props:
    // -moduleData: collection of data relevant to the selected module
    // -closeModule: a function that can be called to close the modal
    // -runModuleQuery: function passed from DistinctCourse, allows
    //    us to re-query the database after we changed it
    constructor(props) {
        super(props)
        let moduleData = this.props.moduleData

        // populate date fields from moduleData
        let releaseDate = moduleData.openTime
        let dueDate = moduleData.closeTime
        if (releaseDate === "") { // if module has no date assigned, just set it to a default
            releaseDate = "2020-01-01T00:00:00.000Z"
        }
        if (dueDate === "") {
            dueDate = "2020-01-01T00:00:00.000Z"
        }
        releaseDate = new Date(releaseDate)
        dueDate = new Date(dueDate)

        // put the list of 'Student' options in a form that
        // the Select component will understand
        let options = []
        for (const studentName of moduleData.allStudents) {
            options.push({value: studentName, label: studentName})
        }

        this.state = {
            releaseDate: new Date(releaseDate),
            dueDate: new Date(dueDate),

            selectedStudentsOptions: options,
            selectedStudents: moduleData.members,
        }

        this.setReleaseDate = this.setReleaseDate.bind(this)
        this.setDueDate = this.setDueDate.bind(this)
        this.setSelectedStudents = this.setSelectedStudents.bind(this)
        this.setSelectedStudents = this.setSelectedStudents.bind(this)
        this.assignAllStudents = this.assignAllStudents.bind(this)
        this.unassignAllStudents = this.unassignAllStudents.bind(this)
        this.saveChangesToDB = this.saveChangesToDB.bind(this)
        this.close = this.close.bind(this)
    }

    // Update the displayed Date for the release date
    setReleaseDate(date) {
        this.setState({releaseDate: date})
    }
    // Update the displayed Date for the due date
    setDueDate(date) {
        this.setState({dueDate: date})
    }
    // Update the selected Students who are assigned to this module
    setSelectedStudents(selected) {
        this.setState({selectedStudents: selected})
    }

    //functions for bulk student selection
    assignAllStudents() {
        this.setState({selectedStudents: this.state.selectedStudentsOptions})
    }
    unassignAllStudents() {
        this.setState({selectedStudents: []})
    }

    //Send changes to database
    // structured strangely because there are 2 updates to do
    // numbers added to make it easier to read
    saveChangesToDB() {
        let moduleData = this.props.moduleData
        let classCode = moduleData.classCode
        let moduleId = moduleData.id

        let tempThis = this
        function onSuccessSchedule(result) {
            // 2a: schedule update suceeded

            function onSuccessMembers(result){
                // 4a: members update suceeded
                // Done, so re-query database
                tempThis.props.runModuleQuery()
                tempThis.close()
            }
            function onFailureMembers(error){
                // 4b: members update failed
                alert(error)
                // Done, so re-query database
                tempThis.props.runModuleQuery()
                tempThis.close()
            }

            // 3: Now update Student members
            let membersArr = tempThis.state.selectedStudents
            Database.setModuleMembers(classCode, moduleId,
                membersArr, onSuccessMembers, onFailureMembers)
        }
        function onFailureSchedule(error) {
            // 2b: schedule update failed
            alert(error)
        }

        //1: Update schedule
        let releaseDate = this.state.releaseDate
        let dueDate = this.state.dueDate
        Database.rescheduleModule(classCode, moduleId, releaseDate,
            dueDate, onSuccessSchedule, onFailureSchedule)

    }

    close() {
        this.props.closeModule()
    }

    render() {
        let data = this.props.moduleData
        // can only release at least 1 day before due date
        let maxReleaseDate = new Date(this.state.dueDate.getTime())
        maxReleaseDate.setDate(maxReleaseDate.getDate() - 1)
        // can only be due at least 1 day after release date
        let minDueDate = new Date(this.state.releaseDate.getTime())
        minDueDate.setDate(minDueDate.getDate() + 1)

        return (
            <ModalBG>
                <DefaultContainer>
                    <h2 style={{marginBottom: "3vh"}}>Module Settings</h2>
                    <h3 style={{marginBottom:0, fontWeight: "bold"}}>Module {data.module.order}: {data.module.name}</h3>
                    <h3 style={{marginTop:0, fontWeight: "bold"}}>Curriculum: {data.curricName}</h3>

                    <div>
                        <div style={{float: "left", width: "50%"}}>
                            <p style={{marginTop: 0, marginBottom: 0}}>Release Date: </p>
                            <DatePicker style={{marginTop: 0, width:'12vw'}}
                            customInput={<Forminputs style={{marginTop: 0, width:'12vw', textAlign: "center"}}/>}
                            selected={this.state.releaseDate}
                            onChange={this.setReleaseDate}
                            maxDate={maxReleaseDate}
                            showTimeSelect
                            timeFormat="h:mm aa"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            />
                        </div>

                        <div>
                            <p style={{marginBottom: 0}}>Due Date: </p>
                            <DatePicker style={{marginTop: 0, width:'12vw'}}
                            customInput={<Forminputs style={{marginTop: 0, width:'12vw', textAlign: "center"}}/>}
                            selected={this.state.dueDate}
                            onChange={this.setDueDate}
                            minDate={minDueDate}
                            showTimeSelect
                            timeFormat="h:mm aa"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            />
                        </div>
                    </div>


                    <p style={{marginTop: "5vh"}}>Assigned to: </p>

                    <Select
                        style={{height: "15vh", width: "30vw"}}
                        value={this.state.selectedStudents}
                        onChange={this.setSelectedStudents}
                        isMulti
                        options={this.state.selectedStudentsOptions}
                    />
                    <div style={{marginTop: "1vh"}}>
                        <Button
                            style={{width: "12vw"}}
                            onClick={this.assignAllStudents}
                            value={"button"}>
                            Assign all students
                        </Button>
                        <Button
                            style={{width: "12vw", marginLeft: "2vw"}}
                            onClick={this.unassignAllStudents}
                            value={"button"}>
                            Unassign all students
                        </Button>
                    </div>

                    <div style={{marginTop: "6vh"}}>
                        <Button
                            style={{backgroundColor:"#00CC00", color: "white"}}
                            onClick={this.saveChangesToDB}
                            value={"button"}>
                            Save
                        </Button>
                        <Button
                            style={{marginLeft: "2vw", backgroundColor: "#FF4136", color: "white"}}
                            onClick={this.close}
                            value={"button"}>
                            Cancel
                        </Button>
                    </div>
                </DefaultContainer>
            </ModalBG>
        )
    }

}

export default ModuleSettingsModal