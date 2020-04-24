import React from "react"
import Database from "../Database"

import styled from "styled-components"

const GreenButton = styled.input`
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
    margin-bottom: 1vh;

    transition: 0.5s all ease-out;
    &:hover {
        box-shadow: 0 12px 16px 0 rgba(0,0,0,0.1), 0 17px 25px 0 rgba(0,0,0,0.1);
    }
`;

export default class AdminMakerVideo extends React.Component {

    //recieves as props
    //assignmentData: describes data for this assignment, if it already existed
    //selectedModuleName: the name of module we are creating this assignment for
    //selectedModuleId: the id of module we are creating this assignment for
    //newAssignmentNumber: the number of the next assignment in the module aka this one
    constructor(props){
        super(props)

        this.state = {
            vidLink: "",
            vidName: "",
            explanation: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.upload= this.upload.bind(this)
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    upload(event) {
        let assignmentJSON = {}

        if (this.props.assignmentData !== null && this.props.assignmentData !== undefined) {
            let retExplain = ""
            if (this.state.explanation !== "") {
                retExplain = this.state.explanation
            } else {
                retExplain = this.props.assignmentData.content[0].question_text
            }

            let retLink = ""
            if (this.state.vidLink !== "") {
                retLink= this.state.vidLink
            } else {
                retLink = this.props.assignmentData.content[0].video_link
            }

            let retName = ""
            if (this.state.vidName !== "") {
                retName = this.state.explanation
            } else {
                retName = this.props.assignmentData.assignment_name
            }

            assignmentJSON = {
                "assignment_number": this.props.assignmentData.assignment_number,
                "assignment_type": "video",
                "content": [{"question_number": 1,
                            "question_text": retExplain,
                                "video_link": retLink}],
                "assignment_name": retName
            }
        } else {
            assignmentJSON = {
                "assignment_number": this.props.newAssignmentNumber,
                "assignment_type": "video",
                "content": [{"question_number": 1, "question_text": this.state.explanation, "video_link": this.state.vidLink}],
                "assignment_name": this.state.vidName
            }
        }

        let tempThis = this
        let onSuccess = function(result) {
            alert("Upload Successful")
            tempThis.props.swapSub("main")
        }

        let onFailure = function(error) {
            alert("Upload Failed")
        }

        Database.updateAssignment(assignmentJSON, this.props.selectedModuleId, onSuccess, onFailure)

        event.preventDefault()
    }

    render() {
        return(
            <div>
                <h3>Video Creator - {this.props.selectedModuleName}</h3>

                <div style={{width: "100%", display: "table"}}>
                    <form onSubmit={this.upload} id="theForm">
                        <div>
                            <h3><strong>Video Name</strong></h3>
                        </div>
                        <label>
                            <input
                            maxLength={50}
                            style={{paddingLeft:".5vw", resize: "none", width:"40%", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                            type = "text"
                            name = "vidName"
                            placeholder = {(this.props.assignmentData !== null && this.props.assignmentData !== undefined) ?
                                this.props.assignmentData.assignment_name : null}
                            value = {this.state.vidName}
                            onChange = {this.handleChange} />
                        </label>

                        <br />

                        <div>
                            <h3><strong>Video Description</strong></h3>
                        </div>
                        <label>
                            <textarea
                            maxLength={500}
                            style={{paddingLeft:".5vw", resize: "none", width:"40%", backgroundColor:"white", height: "100%", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                            name = "explanation"
                            rows="3"
                            cols="50"
                            placeholder = {(this.props.assignmentData !== null && this.props.assignmentData !== undefined) ?
                                this.props.assignmentData.content[0].question_text : null}
                            value = {this.state.explanation}
                            onChange = {this.handleChange}
                            form="theForm">
                            </textarea>
                        </label>

                        <br />

                        <div>
                            <h3><strong> Video Link</strong></h3>
                        </div>
                        <label>
                            <input
                            maxLength={500}
                            style={{paddingLeft:".5vw", resize: "none", width:"40%", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                            type = "text"
                            name = "vidLink"
                            placeholder = {(this.props.assignmentData !== null && this.props.assignmentData !== undefined) ?
                                this.props.assignmentData.content[0].video_link : null}
                            value = {this.state.vidLink}
                            onChange = {this.handleChange} />
                        </label>

                        <br />

                        <GreenButton type="submit" value= "Upload Video"/>
                    </form>
                </div>
            </div>
        )

    }

}