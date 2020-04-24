import React from 'react'
import Quiz from 'react-quiz-component'
import * as Config from "../AWS/config"
import Database from "../Database"

import {Button} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"

export default class QuizAssignment extends React.Component {

    // Passed as props:
    // -moduleData: data on the module that this quiz is in the assignment list of
    // -assignmentNum: number of the quiz in the assignment list of the module
    // -assignmentInd: index of the quiz in the assignment list of the module
    // -isClass: boolean for whether this quiz is in a class or a course.
    // -code: the class code if it is a class
    // -swap: swapSubwindow function from Distinct Course
    // -retake: boolean for whether or not this quiz is a retaking of incorrect questions
    // -retakeQuestions: list of indices incorrect question numbers
    constructor(props) {
        super(props)

        this.state = {
            finishedSending: false, // Boolean to show back button after database updates.
            alreadyCompleted: false, // Boolean for if they already completed this assignment.
        }

        this.updateDB = this.updateDB.bind(this)
    }

    // Function to mark puzzle as complete when finished
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
        const renderCustomResultPage = (obj) => {
            if (obj.numberOfQuestions !== obj.numberOfCorrectAnswers) {
                /* Only given the answers to each question and the correct answer
                so I have to find the questions that were incorrect and add them
                to the new quiz assignment. */
                let retakes = []

                for (let i = 0; i < obj.questions.length; i++) {
                    if (obj.questions[i].correctAnswer !== obj.userInput[i].toString()) {
                        retakes.push(obj.questions[i].question)
                    }
                }

                return (
                    <QuizAssignment moduleData={this.props.moduleData}
                    isClass={this.props.isClass}
                    assignmentNum={this.props.assignmentNum}
                    assignmentInd={this.props.assignmentInd}
                    swap={this.props.swap}
                    retake={true}
                    code={this.props.isClass ? this.props.code : null}
                    retakeQuestions={retakes}/>
                )
            }

            if (!this.state.alreadyCompleted) {
                this.updateDB()
            }

            return (
                <div>
                    <h4>
                        Congratulations! You've completed the quiz!
                    </h4>
                    {this.state.finishedSending ?
                    <Button onClick={this.props.swap.bind(this, 'assignmentList')}> Return to assignment list </Button>
                      : <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading"/>}
                </div>
            )
        }

        var listOfAssignment = null
        if (this.props.isClass) {
            listOfAssignment = JSON.parse(this.props.moduleData.module.moduleString)
        } else {
            listOfAssignment = JSON.parse(this.props.moduleData.moduleString)
        }
        let queries = listOfAssignment[this.props.assignmentInd].content

        let quiz = {
          "quizTitle": listOfAssignment[this.props.assignmentInd].assignment_name,
          "questions": []
        }

        let step = 0
        for (let i = 0; i < queries.length; i++) {
            if (!this.props.retake || (queries[i].question_text === this.props.retakeQuestions[step])) {
                step++
                let correctInd = [] // Index of the correct answer
                for (let j = 0; j < queries[i].answers.length; j++) {
                    if (queries[i].answers[j].correct) {
                        correctInd.push(j + 1)
                    }
                }

                let type = ""
                let correctIndex = null
                if (correctInd.length > 1) {
                  type = "multiple"
                  correctIndex = correctInd
                } else {
                  type = "single"
                  correctIndex = "" + correctInd[0]
                }

                let answers = []
                let explanation = ""
                for (let j = 0; j < queries[i].answers.length; j++) {
                    answers.push(queries[i].answers[j].answer_text)
                    explanation += "Answer " + (j + 1) + ": " + queries[i].answers[j].message + " \n"
                }


                // HAVE TO DO THIS UGLY IF STATEMENT BECAUSE JSON
                if (queries[i].question_image !== undefined && queries[i].question_image !== null) {
                    quiz.questions.push(
                        {
                          "question": queries[i].question_text,
                          "questionType": "text",
                          "questionPic": `${Config.imageURL + queries[i].question_image}?${new Date().getTime()}`,
                          "answerSelectionType": type,
                          "answers": answers,
                          "correctAnswer": correctIndex,
                          "messageForCorrectAnswer": "Correct",
                          "messageForIncorrectAnswer": "Incorrect",
                          "explanation": explanation
                        }
                    )
                } else {
                    quiz.questions.push(
                        {
                          "question": queries[i].question_text,
                          "questionType": "text",
                          "answerSelectionType": type,
                          "answers": answers,
                          "correctAnswer": correctIndex,
                          "messageForCorrectAnswer": "Correct",
                          "messageForIncorrectAnswer": "Incorrect",
                          "explanation": explanation
                        }
                    )
                }
            }
        }

        return (
            <div>
                {this.props.retake ?
                <Quiz quiz={quiz} showInstantFeedback={true} continueTillCorrect={true} showDefaultResult={false} customResultPage={renderCustomResultPage} retake={true}/>
                : <Quiz quiz={quiz} showInstantFeedback={true} continueTillCorrect={true} showDefaultResult={false} customResultPage={renderCustomResultPage}/>
                }
            </div>
        )
    }
}
