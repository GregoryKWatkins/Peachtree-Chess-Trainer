import React from 'react'
import YouTubePlayer from 'react-player/lib/players/YouTube'

import Database from "../Database"

import {Button, GreenButton} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"


export default class Video extends React.Component {

    // Passed as props:
    // -isClass: true if module from class, false if module from cirriculum
    // -moduleData: data on the module that this video is in the assignment list of
    // -assignmentNum: number of the quiz in the assignment list of the module
    constructor(props) {
        super(props)
        this.state = {
            finishedSending: false,
            alreadyCompleted: false,
        }

        this.onEnded = this.onEnded.bind(this)
    }


    videoError() {
        alert('an error occurred loading the video')
    }

    onEnded() {
        if (!this.state.alreadyCompleted) {
            this.updateDB()
        }
    }

    updateDB() {
        this.setState({alreadyCompleted: true})
        let thisPointer = this

        let onSuccess = function(result) {
            thisPointer.setState({finishedSending: true})
        }

        let onFailure = function(error) {
            console.log("Error: " + error)
        }

        if (this.props.isClass) {
            Database.assignmentCompleted(this.props.moduleData.id, this.props.assignmentNum, onSuccess, onFailure, this.props.code)
        } else {
            Database.assignmentCompleted(this.props.moduleData.id, this.props.assignmentNum, onSuccess, onFailure)
        }

    }

    render() {
        var listOfAssignment = null
        var videoAssignment = null
        if (this.props.isClass) {
            listOfAssignment = JSON.parse(this.props.moduleData.module.moduleString)
        } else {
            listOfAssignment = JSON.parse(this.props.moduleData.moduleString)
        }

        // console.log("ASSIGNMENTLIST")
        // console.log(listOfAssignment)

        videoAssignment = listOfAssignment[this.props.assignmentInd]

        if (videoAssignment === null) {
            return alert('an error occurred, please reload the page and try again')
        }

        let prevButton = false
        let nextButton = false
        var prevAssignment
        var nextAssignment

        if (this.props.assignmentInd > 0) {
            prevButton = true
            prevAssignment = listOfAssignment[this.props.assignmentInd - 1]
        }
        if (this.props.assignmentInd + 1 < listOfAssignment.length) {
            nextButton = true
            nextAssignment = listOfAssignment[this.props.assignmentInd + 1]
        }

        var navButtons
        navButtons = (
            <div>
                {prevButton ?
                    <button
                        onClick={this.props.swap.bind(this, prevAssignment.assignment_type, true, prevAssignment.assignment_number, this.props.assignmentInd - 1)}>
                        prevAssignment
                    </button> : null}
                <Button
                    style={{marginTop:"1vh"}}
                    onClick={this.props.swap.bind(this, 'assignmentList')}> Return to assignment list
                </Button>
                {nextButton ?
                    <GreenButton
                        onClick={this.props.swap.bind(this, nextAssignment.assignment_type, true, nextAssignment.assignment_number, this.props.assignmentInd + 1)}>
                        Next Assignment
                    </GreenButton> : null}
            </div>
        )

        return (
            <div>
                <div>
                    <h4> {videoAssignment.assignment_name} </h4>
                    <p> {videoAssignment.content[0].question_text} </p>
                </div>
                <YouTubePlayer
                  url={videoAssignment.content[0].video_link}
                  controls={true}
                  onError={this.videoError}
                  onEnded={this.onEnded}
                />
                {navButtons}
            </div>
        )
    }
}


