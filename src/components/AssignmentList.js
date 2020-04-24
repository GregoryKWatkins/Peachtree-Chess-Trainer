import React from 'react'
import styled from 'styled-components'
import Authenticate from '../Authenticate'

import {RedButton} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"

export default class AssignmentList extends React.Component {

    // Passed as props:
    // -progress: progress array for all modules and their asssignments
    // -moduleData: data on the module that this assignment list is for
    // -isClass: boolean on whether the module is a class or not
    // -swap: function to swap the subwindow to either a quiz, puzzle, or video

    constructor(props) {
        super(props)

        this.checkName = this.checkName.bind(this)
    }

    checkName(mod) {
        if (mod.module === this.props.moduleData.id) {
            return mod
        }
    }

    render() {
        const AssignmentDiv = styled.div`
            padding-left: 1vw;
            background-color: white;
            margin-bottom: 2vh;
            border: solid;
            border-radius: 1vh;
            border-width: .25vh;
            border-color: #c0c0c0;
            cursor: pointer;
        `;

        const AssignmentDivCompleted = styled.div`
            padding-left: 1vw;
            background-color: rgb(53,184,88,.6);
            margin-bottom: 2vh;
            border: solid;
            border-radius: 1vh;
            border-width: .25vh;
            border-color: #c0c0c0;
            cursor: pointer;
        `;

        var listOfAssignment = null
        if (this.props.isClass) {
            listOfAssignment = JSON.parse(this.props.moduleData.module.moduleString)
        } else {
            listOfAssignment = JSON.parse(this.props.moduleData.moduleString)
        }
        let toDisplay = []
        let prog = null

        // Here I will grab the array for this specific modules progress to use in the loop.
        if (this.props.isClass && (this.props.progress !== null) && (Authenticate.getUserType() !== "Coach") && (Authenticate.getUserType() !== "Admin")) {
            prog = this.props.progress.u_progress.find(this.checkName).assignments
        } else if (!this.props.isClass && (this.props.progress !== null) && (Authenticate.getUserType() !== "Admin")) {
            prog = this.props.progress.find(this.checkName).assignments
        }

        if (Authenticate.getUserType() === "Coach" && this.props.isClass) {
            for (let i = 0; i < listOfAssignment.length; i++) {
                toDisplay.push(
                    <div>
                        <AssignmentDiv key={i} onClick={this.props.swap.bind(this, listOfAssignment[i].assignment_type, true, listOfAssignment[i].assignment_number, i)}>
                            <div style={{marginLeft: "1vw"}}>
                                <div>
                                    <p><strong>Assignment:</strong> {i + 1}</p>
                                </div>
                                <div>
                                    <p><strong>Type:</strong> {listOfAssignment[i].assignment_type}</p>
                                </div>
                            </div>
                        </AssignmentDiv>
                    </div>
                )
            }
        } else {
            for (let i = 0; i < listOfAssignment.length; i++) {
                toDisplay.push(
                    <div>
                        {(prog !== null) && (Authenticate.getUserType() !== "Admin") && prog[i].assignment_completed ?
                        <AssignmentDivCompleted key={i} onClick={this.props.swap.bind(this, listOfAssignment[i].assignment_type, true, listOfAssignment[i].assignment_number, i)}>
                            <div style={{marginLeft: "1vw"}}>
                                <div>
                                    <p><strong>Assignment:</strong> {i + 1}</p>

                                </div>
                                <div>
                                    {console.log(listOfAssignment[i].assignment_type)}
                                    <p><strong>Type:</strong> {listOfAssignment[i].assignment_type}</p>
                                </div>
                                <div>
                                    <p><strong> Completed: </strong> {(prog !== null) && (Authenticate.getUserType() !== "Admin") && prog[i].assignment_completed ? 'Yes' : 'No'} </p>
                                </div>
                            </div>

                        </AssignmentDivCompleted> :
                        <AssignmentDiv key={i} onClick={this.props.swap.bind(this, listOfAssignment[i].assignment_type, true, listOfAssignment[i].assignment_number, i)}>
                            <div>
                                <p><strong>Assignment:</strong> {i + 1}</p>
                            </div>
                            <div>
                                <p><strong>Type:</strong> {listOfAssignment[i].assignment_type}</p>
                            </div>
                            <div>
                                <p><strong> Completed: </strong> {(prog !== null) && (Authenticate.getUserType() !== "Admin") && prog[i].assignment_completed ? 'Yes' : 'No'} </p>
                            </div>
                        </AssignmentDiv>}
                    </div>
                )
            }
        }

        return (
            <div style={{padding: "2vh", backgroundColor: "#ebebeb", borderRadius: "1vh", border: "solid", borderColor: "#c0c0c0"}}>
                <h2 style={{marginTop:0}}> Assignments </h2>
                {toDisplay}
                <RedButton style={{marginLeft: 0}} onClick={this.props.swap.bind(this, 'modules')}> Return to module list </RedButton>
            </div>
        )
    }
}
