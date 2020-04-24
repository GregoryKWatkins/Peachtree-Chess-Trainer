import React from "react"

import Database from "../Database"
import * as Config from "../AWS/config"

import Collapsible from 'react-collapsible'

import {GreenButton, Button, RedButton} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"

class AdminMakerQuiz extends React.Component {
    //recieves as props
    //assignmentData: describes data for this assignment, if it already existed
    //selectedModuleName: the name of module we are creating this assignment for
    //selectedModuleId: the id of module we are creating this assignment for
    //newAssignmentNumber: number for new assignment are currently in the module

    constructor(props){
        super(props)

        let assignData = this.props.assignmentData

        let questionList
        let assignmentName
        let assignmentNumber
        if (assignData != null) {
            questionList = assignData.content
            assignmentName = assignData.assignment_name
            assignmentNumber = assignData.assignment_number
        } else {
            //set a default question list json to start with
            questionList = [
                {
                    question_number:1,
                    question_text:"",
                    answers: [
                        {
                            answer_text:"",
                            correct:true,
                            message:""
                        },
                        {
                            answer_text:"",
                            correct:false,
                            message:""
                        }
                    ]
                }
            ]
            //set a default assignment name
            assignmentNumber = this.props.newAssignmentNumber
            assignmentName = "Unnamed Quiz"
        }


        this.state = {
            //list of questions currently on page, changeable by user
            qList: questionList,
            assignName: assignmentName,
            assignNum: assignmentNumber
        }

        this.handleNameUpdate = this.handleNameUpdate.bind(this)
        this.handleQuestionTextUpdate = this.handleQuestionTextUpdate.bind(this)
        this.handleAnswerTextUpdate = this.handleAnswerTextUpdate.bind(this)
        this.handleAnswerCorrectUpdate = this.handleAnswerCorrectUpdate.bind(this)
        this.handleAnswerFeedbackUpdate = this.handleAnswerFeedbackUpdate.bind(this)
        this.handleAnswerDelete = this.handleAnswerDelete.bind(this)
        this.handleAddChoice = this.handleAddChoice.bind(this)
        this.handleAnswerShiftUp = this.handleAnswerShiftUp.bind(this)
        this.handleAnswerShiftDown = this.handleAnswerShiftDown.bind(this)
        this.handleQuestionAdd = this.handleQuestionAdd.bind(this)
        this.handleQuestionDelete = this.handleQuestionDelete.bind(this)
        this.handleImageUpload = this.handleImageUpload.bind(this)
        this.handleQuizSubmit = this.handleQuizSubmit.bind(this)
        this.fixQuestionNumbers = this.fixQuestionNumbers.bind(this)
        this.handleImageDelete = this.handleImageDelete.bind(this)
    }

    handleNameUpdate(event) {
        let newName = event.target.value
        this.setState({assignName: newName})
    }

    handleQuestionTextUpdate(event, qIndex) {
        let newText = event.target.value
        let qListCopy = JSON.parse(JSON.stringify(this.state.qList))
        qListCopy[qIndex].question_text = newText
        this.setState({qList: qListCopy})
    }

    handleAnswerTextUpdate(event, qIndex, ansIndex) {
        let newText = event.target.value
        let qListCopy = JSON.parse(JSON.stringify(this.state.qList))
        qListCopy[qIndex].answers[ansIndex].answer_text = newText
        this.setState({qList: qListCopy})
    }

    handleAnswerFeedbackUpdate(event, qIndex, ansIndex) {
        let newText = event.target.value
        let qListCopy = JSON.parse(JSON.stringify(this.state.qList))
        qListCopy[qIndex].answers[ansIndex].message = newText
        this.setState({qList: qListCopy})
    }

    handleAnswerCorrectUpdate(event, qIndex, ansIndex) {
        let newBool = (event.target.value === "true") //cast to bool
        let qListCopy = JSON.parse(JSON.stringify(this.state.qList))
        qListCopy[qIndex].answers[ansIndex].correct = newBool
        this.setState({qList: qListCopy})
    }

    handleAnswerDelete(qIndex, ansIndex) {
        //should always be at least 2 answers
        if (this.state.qList[qIndex].answers.length === 2) {
            alert("There cannot be fewer than 2 choices for a question")
            return
        }
        let qListCopy = JSON.parse(JSON.stringify(this.state.qList))
        qListCopy[qIndex].answers.splice(ansIndex, 1)
        this.setState({qList: qListCopy})
    }

    handleAddChoice(qIndex) {
        let qListCopy = JSON.parse(JSON.stringify(this.state.qList))
        qListCopy[qIndex].answers.push({
            answer_text: "",
            correct: false,
            message: ""
        })
        this.setState({qList: qListCopy})
    }

    handleAnswerShiftUp(qIndex, ansIndex) {
        let qListCopy = JSON.parse(JSON.stringify(this.state.qList))
        let questionInQuestion = qListCopy[qIndex]
        let swapAnswer1 = questionInQuestion.answers[ansIndex]
        let swapAnswer2 = questionInQuestion.answers[ansIndex - 1]
        questionInQuestion.answers[ansIndex] = swapAnswer2
        questionInQuestion.answers[ansIndex -1] = swapAnswer1
        this.setState({qList: qListCopy})
    }

    handleAnswerShiftDown(qIndex, ansIndex) {
        let qListCopy = JSON.parse(JSON.stringify(this.state.qList))
        let questionInQuestion = qListCopy[qIndex]
        let swapAnswer1 = questionInQuestion.answers[ansIndex]
        let swapAnswer2 = questionInQuestion.answers[ansIndex + 1]
        questionInQuestion.answers[ansIndex] = swapAnswer2
        questionInQuestion.answers[ansIndex + 1] = swapAnswer1
        this.setState({qList: qListCopy})
    }

    handleQuestionAdd() {
        let qListCopy = JSON.parse(JSON.stringify(this.state.qList))
        let newQuestion = {
            question_number: qListCopy.length + 1,
            question_text: "",
            question_image: null,
            answers: [
                { answer_text: "",
                  correct: false,
                  message: ""},
                { answer_text: "",
                  correct: false,
                  message: ""}
            ]
        }
        qListCopy.push(newQuestion)
        this.setState({qList: qListCopy})
    }

    handleQuestionDelete(qIndex) {
        if (window.confirm("Are you sure you would like to delete this question?")) {
            if (this.state.qList.length === 1) {
                alert("There cannot be zero questions in a quiz")
                return
            }
            let qListCopy = JSON.parse(JSON.stringify(this.state.qList))
            qListCopy.splice(qIndex, 1)
            //quiz structure has changed, so question numbers must be updated
            qListCopy = this.fixQuestionNumbers(qListCopy)
            this.setState({qList: qListCopy})
        }
    }

    //immediately send uploaded image to database
    handleImageUpload(event, qIndex) {
        let image = event.target.files[0]
        let newFileName = this.props.selectedModuleId + '-' + this.state.assignNum + '-' + qIndex + '-img'
        let tempThis = this
        let uploadOnSuccess = function(result) {
            let qListCopy = JSON.parse(JSON.stringify(tempThis.state.qList))
            qListCopy[qIndex].question_image = newFileName
            tempThis.setState({qList: qListCopy})
        }
        let uploadOnFail = function(error) {
            alert("Image failed to upload to database")        }

        Database.uploadImage(image, newFileName, uploadOnSuccess, uploadOnFail)
    }

    handleImageDelete(qIndex) {
        if (window.confirm("Are you sure you would like to delete this image?")) {
            let fileToDelete = this.props.selectedModuleId + '-' + this.state.assignNum + '-' + qIndex + '-img'
            let tempThis = this
            let deleteOnSuccess = function(result) {
                let qListCopy = JSON.parse(JSON.stringify(tempThis.state.qList))
                qListCopy[qIndex].question_image = null
                tempThis.setState({qList: qListCopy})
            }
            let deleteOnFail = function(error) {
                alert("Image failed to delete")
            }
            Database.deleteImage(fileToDelete, deleteOnSuccess, deleteOnFail)
        }
    }


    //form question list into valid json and send to the database
    handleQuizSubmit() {
        let quizJson
        if (this.props.assignmentData != null) { //overwrite old questions
            quizJson = this.props.assignmentData
            quizJson.content = this.state.qList
            quizJson.assignment_name = this.state.assignName
        } else { //make brand new quiz
            quizJson = {
                assignment_number : this.props.newAssignmentNumber,
                assignment_type: "quiz",
                assignment_name: this.state.assignName,
                content: this.state.qList
            }
        }

        let onSubmitSucces = function(result) {
            alert("Assignment successfully saved")
        }
        let onSubmitFail = function(error) {
            alert("Failed to update database")
        }

        Database.updateAssignment(quizJson, this.props.selectedModuleId,
                                  onSubmitSucces, onSubmitFail)
    }

    // since questions can be added, deleted, and moved, need to assign
    // valid question numbers when done editing the question list.
    fixQuestionNumbers(currQList) {
        for (let i = 0; i < currQList.length; i++) {
            currQList[i].question_number = i + 1
        }
        return currQList
    }

    render() {
        // construct list of each 'question'
        let questionList = this.state.qList.map((q, qIndex) =>
            <Collapsible trigger={"Question " + (q.question_number)} triggerStyle={{
                display: "block",
                fontWeight: "400",
                textDecoration: "none",
                color: "white",
                position: "relative",
                border: "1px solid white",
                padding: "10px",
                background: "#00ac9d",
                width: "70%",
                cursor:"pointer"}}>
                <div key={"q" + q.question_number} style={{textAlign: "center", padding: "2vh", backgroundColor: "#ebebeb", borderRadius: "1vh", border: "solid", borderColor: "#c0c0c0", marginBottom: "2vh", width: "50vw"}}>
                        {/**<h1 style={{marginTop: 0}}>Question {q.question_number}</h1>**/}

                        <h2 style={{marginBottom: 0}}>Prompt: </h2>
                        <textarea
                            style={{width:"80%", paddingTop:"1vh", paddingLeft: "1vw", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                            rows="6"
                            cols="110"
                            value={q.question_text}
                            onChange={(event) =>
                                this.handleQuestionTextUpdate(event, qIndex)}
                            name="questionText"
                            minLength="1"
                        >
                        </textarea>

                        <h2>Image: </h2>
                        {/**<p>Current Image: {q.question_image != null
                                         ? q.question_image
                                        : "no image"}
                        </p>**/}
                        {q.question_image != null
                            ? <img src={`${Config.imageURL + q.question_image}?${new Date().getTime()}`/**fool cache into refreshing**/}
                                alt=""
                                style={{maxWidth: '300px', maxHeight: '300px'}}/>
                            : <p>No image selected</p>}
                        <div>
                            <input type="file" name="file" onChange={(event) =>
                                    this.handleImageUpload(event, qIndex)}/>
                            {q.question_image != null
                                ? <RedButton onClick={() => this.handleImageDelete(qIndex)}>Delete Image</RedButton>
                                : null}
                        </div>


                        <h2>Answers</h2>
                        {q.answers.map((answer, ansIndex) =>
                            <div key={"a" + qIndex + "-" + ansIndex}
                            style={{marginLeft:"8%", width:"80%", paddingTop:"1vh", paddingBottom:"1vh", paddingLeft: "1vw", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}>
                                <div style={{float: "left", overflow:"hidden", width: "66%"}}>
                                    <div style={{float: "left", width:"33%", overflow:"hidden"}}>
                                        <p><strong>Choice:</strong></p>
                                        <textarea
                                            style={{width:"80%", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                                            rows="2"
                                            cols="50"
                                            value={answer.answer_text}
                                            onChange={(event) =>
                                                this.handleAnswerTextUpdate(
                                                    event, qIndex, ansIndex)}
                                            name="answerText"
                                            minLength="1"
                                        ></textarea>
                                    </div>

                                    <div style={{marginLeft:"33%", overflow:"hidden"}}>
                                        <p><strong>Correctness:</strong></p>
                                        <input type="radio"
                                            checked={answer.correct}
                                            value={true}
                                            onChange={(event) =>
                                                this.handleAnswerCorrectUpdate(
                                                    event, qIndex, ansIndex)}
                                        /> True
                                        <input type="radio"
                                            checked={!answer.correct}
                                            value={false}
                                            onChange={(event) =>
                                                this.handleAnswerCorrectUpdate(
                                                    event, qIndex, ansIndex)}
                                        /> False
                                    </div>
                                </div>


                                <div style={{marginLeft:"66%"}}>
                                    <p><strong>Feedback:</strong></p>
                                    <textarea
                                        style={{width:"80%", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                                        rows="4"
                                        cols="20"
                                        value={answer.message}
                                        onChange={(event) =>
                                            this.handleAnswerFeedbackUpdate(
                                                event, qIndex, ansIndex)}
                                        name="answerFeedback"
                                        minLength="1"
                                    ></textarea>
                                </div>

                                <div>
                                    <RedButton onClick={() => this.handleAnswerDelete(qIndex, ansIndex)}
                                    >Delete</RedButton>
                                    <button style={{marginRight:"1vw"}} disabled={ansIndex === 0}
                                            onClick={() => this.handleAnswerShiftUp(qIndex, ansIndex)}
                                    ><i style={{border: "solid black", borderWidth: "0 3px 3px 0", display: "inline-block", padding: "3px", transform: "rotate(-135deg)", WebkitTransform: "rotate(-135deg)"}}></i></button>
                                    <button disabled={ansIndex === q.answers.length - 1}
                                            onClick={() => this.handleAnswerShiftDown(qIndex, ansIndex)}
                                    ><i style={{border: "solid black", borderWidth: "0 3px 3px 0", display: "inline-block", padding: "3px", transform: "rotate(45deg)", WebkitTransform: "rotate(45deg)"}}></i></button>
                                </div>

                            </div>
                        )}
                        <GreenButton onClick={() => this.handleAddChoice(qIndex)}>Add Choice</GreenButton>
                        <RedButton onClick={() => this.handleQuestionDelete(qIndex)}>Delete Question</RedButton>
                </div>
            </Collapsible>
        )

        return(
            <div>
                <h1>New Quiz - {this.props.selectedModuleName}</h1>
                <div style={{marginBottom: "1vh"}}>
                    <label style={{fontSize:"18px"}}><strong>Quiz Name: </strong></label>
                    <input
                        value={this.state.assignName}
                        onChange={(event) =>
                            this.handleNameUpdate(event)}
                        name="quizName"
                        minLength="1"
                        maxLength={50}
                    >
                    </input>
                </div>

                {questionList}
                <div style={{marginTop:"1vh"}}>
                    <Button onClick={this.handleQuestionAdd}>Add Question</Button>
                </div>

                <div style={{marginTop: "4vh", marginBottom:"1vh"}}>
                    <GreenButton style={{marginLeft: 0}}onClick={this.handleQuizSubmit}>Submit Quiz</GreenButton>
                </div>

            </div>
        )

    }

}

export default AdminMakerQuiz