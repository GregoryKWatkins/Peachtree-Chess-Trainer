import React from 'react'

import DatePicker from "react-datepicker";
import Select from 'react-select'

import "react-datepicker/dist/react-datepicker.css"
import {ModalBG, DefaultContainer, Button, Forminputs} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling.js"


class SetDateModal extends React.Component {

    constructor(props) {



        super(props)
        this.state = {
            releaseDate: null,
            dueDate: null,
            close: this.props.close,
            loaded: false,

            selectedStudentsOptions: null,
            selectedStudents: null
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setReleaseDate = this.setReleaseDate.bind(this)
        this.setDueDate = this.setDueDate.bind(this)
        this.assignAllStudents = this.assignAllStudents.bind(this)
        this.unassignAllStudents = this.unassignAllStudents.bind(this)
        this.setSelectedStudents = this.setSelectedStudents.bind(this)
    }

    componentDidMount() {
        let data = this.props.modalData

        let options = []
        for (const studentName of data.students) {
            options.push({value: studentName, label: studentName})
        }
        this.setState({
            releaseDate: new Date(data.start.start),
            dueDate: new Date(data.end.start),
            loaded: true,
            selectedStudentsOptions: options,
            selectedStudents: data.start.extendedProps.members
        })
    }

    handleClose(event) {
        const close = this.props.close
        this.setState({
            close: !close
        })
    }
    // Update display date for relaease date
    setReleaseDate(date) {
        this.setState({releaseDate: date})
    }
    // Update the displayed Date for the due date
    setDueDate(date) {
        this.setState({dueDate: date})
    }

    setSelectedStudents(selected) {
        this.setState({selectedStudents: selected})
    }

    handleSubmit(event) {
        event.preventDefault()
        let updateModule = this.props.modalData
        updateModule.start.setDates(this.state.releaseDate)
        updateModule.start.setExtendedProp('members', this.state.selectedStudents)
        updateModule.end.setDates(this.state.dueDate)
        updateModule.end.setExtendedProp('members', this.state.selectedStudents)
        this.props.sendUpdates(updateModule.start)
        // this.props.sendUpdates(updateModule.end)
        this.props.closeModal()
    }

    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.value

        this.setState({
        [name]: value
        });
    }

    assignAllStudents() {
        this.setState({selectedStudents: this.state.selectedStudentsOptions})
    }
    unassignAllStudents() {
        this.setState({selectedStudents: []})
    }

    render() {
        if (!this.props.close) {
            return null;
        }
        if (!this.state.loaded)
            return <p>loading</p>
        let data = this.props.modalData
        // can only release at least 1 day before due date
        let maxReleaseDate = new Date(this.state.dueDate)
        maxReleaseDate.setDate(maxReleaseDate.getDate() - 1)
        // can only be due at least 1 day after release date
        let minDueDate = new Date(this.state.releaseDate)
        minDueDate.setDate(minDueDate.getDate() + 1)
        return (

            <ModalBG>
                <DefaultContainer>
                    <div>
                        <div>
                            <h4> {data.start.title.slice(0, data.start.title.length - 12)} </h4>

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
                            <p style={{marginTop: "5vh"}}>Assigned to: </p>

                            <Select
                                style={{height: "15vh"}}
                                value={this.state.selectedStudents}
                                onChange={this.setSelectedStudents}
                                isMulti
                                options={this.state.selectedStudentsOptions}
                            />
                            <div>
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
                                    onClick={this.handleSubmit}
                                    value={"button"}>
                                    Update
                                </Button>
                                {/*Close button to close modal*/}
                                <Button onClick={this.props.closeModal}
                                    style={{marginLeft: "2vw", backgroundColor: "#FF4136", color: "white"}}
                                    type={'button'}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </DefaultContainer>
            </ModalBG>
        )
    }
}

export default SetDateModal