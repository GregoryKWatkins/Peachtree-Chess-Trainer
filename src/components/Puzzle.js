import React from 'react'
import Database from "../Database"
import Chessboard from "chessboardjsx"

import {GreenButton, RedButton} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"

export default class Puzzle extends React.Component {

    // Passed as props:
    // -moduleData: data on the module that this puzzle is in the assignment list of
    // -assignmentNum: number of the puzzle in the assignment list of the module
    // -assignmentInd: index of the puzzle in the assignment list of the module
    // -isClass: boolean for whether this puzzle is in a class or a course.
    // -code: the class code if it is a class
    // -swap: swapSubwindow function from Distinct Course
    constructor(props) {
        super(props)

        let listOfAs = null // This is the list of assignments in a module
        if (this.props.isClass) {
            listOfAs = JSON.parse(this.props.moduleData.module.moduleString)
        } else {
            listOfAs = JSON.parse(this.props.moduleData.moduleString)
        }
        let assignmentName = listOfAs[this.props.assignmentInd].assignment_name // Name of the assignment
        let qList = listOfAs[this.props.assignmentInd].content // This is the list of questions for this assignment

        let questionZero = qList[0]
        this.state = {
            finishedSending: false, // Boolean to show back button after database updates.
            assignName: assignmentName,

            puzzleContent: qList, //list of questions json to work with
            currentQuestion: 0, // Current index in the question list we are on

            oldPosition: questionZero.board_config, // This is for when we are undoing a move
            position: questionZero.board_config, // Current board position

            // fields for specific question/ answer details
            objective: questionZero.objective,
            genericFailure: questionZero.generic_failure,

            showSubmitButton: false, // Boolean to show submit button
            showResults: false, // Boolean to show results page

            numRight: 0, // Number of questions gotten correct

            isChild: false, // Boolean to show board for a child
            childSuc: [], // List to hold sub-question success array
            childFail: [], // List to hold sub-question failure array

            alreadyCompleted: false, // Boolean for if you already completed an assignment

            isFail: false
        }

        this.markComplete = this.markComplete.bind(this)
        this.handleQuestionSubmit = this.handleQuestionSubmit.bind(this)
        this.handleSubQuestionSubmit = this.handleSubQuestionSubmit.bind(this)
        this.nextQuestion = this.nextQuestion.bind(this)
        this.handlePositionChange = this.handlePositionChange.bind(this)
        this.handleReset = this.handleReset.bind(this)
    }

    // Function to mark puzzle as complete when finished
    markComplete() {
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

    handleQuestionSubmit() {
        let question = this.state.puzzleContent[this.state.currentQuestion]
        let message = ""
        let children = false
        // Checking for success children/messages
        for (let i = 0; i < question.success.length; i++) {
            if (this.state.position === question.success[i].board_config) {
                message = "Correct: " + question.success[i].message
                let child = question.success[i].child_question
                if (child !== undefined && child !== null) {
                    this.setState({position: child.board_config,
                        oldPosition: child.board_config,
                        objective: child.objective,
                        genericFailure: child.generic_failure,
                        childSuc: child.success,
                        childFail: child.failure,
                        isChild: true,
                        showSubmitButton: false})
                    children = true
                } else {
                    this.setState({numRight: this.state.numRight + 1})
                }
            }
        }

        //Checking for failure children/messages
        for (let i = 0; i < question.failure.length; i++) {
            if (this.state.position === question.failure[i].board_config) {
                message = "Incorrect: " + question.failure[i].message
                let child = question.failure[i].child_question
                if (child !== undefined && child !== null) {
                    this.setState({position: child.board_config,
                        oldPosition: child.board_config,
                        objective: child.objective,
                        genericFailure: child.generic_failure,
                        childSuc: child.success,
                        childFail: child.failure,
                        isChild: true,
                        isFail: true,
                        showSubmitButton: false})
                    children = true
                }
            }
        }

        if (message === "") {
            message = this.state.genericFailure
            this.setState({isFail: true})
        }
        alert(message)

        if (!children) {
            this.nextQuestion()
        }
    }

    nextQuestion() {
        // Add an isFail check here and just change position to currentQuestion and not change currentQuestion
        if (this.state.isFail) {
            this.setState({position: this.state.puzzleContent[this.state.currentQuestion].board_config,
                oldPosition: this.state.puzzleContent[this.state.currentQuestion].board_config,
                objective: this.state.puzzleContent[this.state.currentQuestion].objective,
                genericFailure: this.state.puzzleContent[this.state.currentQuestion].generic_failure,
                showSubmitButton: false,
                isFail: false})
            return
        } else if ((this.state.puzzleContent[this.state.currentQuestion + 1]) !== undefined && (this.state.puzzleContent[this.state.currentQuestion + 1]) !== null) {
            this.setState({currentQuestion: this.state.currentQuestion+1,
                position: this.state.puzzleContent[this.state.currentQuestion + 1].board_config,
                oldPosition: this.state.puzzleContent[this.state.currentQuestion + 1].board_config,
                objective: this.state.puzzleContent[this.state.currentQuestion + 1].objective,
                genericFailure: this.state.puzzleContent[this.state.currentQuestion + 1].generic_failure,
                showSubmitButton: false})
            return
        } else {
            this.setState({showResults: true})
            if (this.state.numRight !== this.state.puzzleContent.length) {
                this.setState({finishedSending: true})
            }
            return
        }
    }

    handleSubQuestionSubmit() {
        let message = ""
        // Checking for success
        for (let i = 0; i < this.state.childSuc.length; i++) {
            if (this.state.position === this.state.childSuc[i].board_config) {
                message = "Correct: " + this.state.childSuc[i].message
                let child = this.state.childSuc[i].child_question
                if (child !== undefined && child !== null) {
                    alert(message)
                    this.setState({position: child.board_config,
                        oldPosition: child.board_config,
                        objective: child.objective,
                        genericFailure: child.generic_failure,
                        childSuc: child.success,
                        childFail: child.failure,
                        showSubmitButton: false})
                    return
                }
            }
        }

        //Checking for failure messages
        for (let i = 0; i < this.state.childFail.length; i++) {
            if (this.state.position === this.state.childFail[i].board_config) {
                message = "Incorrect: " + this.state.childFail[i].message
                let child = this.state.childFail[i].child_question
                if (child !== undefined && child !== null) {
                    alert(message)
                    this.setState({position: child.board_config,
                        oldPosition: child.board_config,
                        objective: child.objective,
                        genericFailure: child.generic_failure,
                        childSuc: child.success,
                        childFail: child.failure,
                        isFail: true,
                        showSubmitButton: false})
                    return
                }
            }
        }

        if (message === "") {
            message = this.state.genericFailure
            this.setState({isFail: true})
        } else if (message.includes("Correct")) {
            this.setState({numRight: this.state.numRight + 1})
        }
        alert(message)

        // No more sub-questions so set isChild to false and get next question
        this.setState({isChild: false})
        this.nextQuestion()
    }

    // this function is called whenever the board state is changed by a user
    handlePositionChange(position) {
        let fen = this.objToFen(position)
        this.setState({position: fen})
        if (this.state.position !== this.state.puzzleContent[this.state.currentQuestion].board_config) {
            this.setState({showSubmitButton: true})
        }
    }

    handleReset() {
        this.setState({position: this.state.oldPosition, showSubmitButton: false})
    }

    render() {
        if (this.state.showResults) {
            if (!this.state.alreadyCompleted && this.state.numRight === this.state.puzzleContent.length) {
                this.markComplete()
            }
            return (
                <div>
                    <h2> Tactics Puzzle Results: </h2>
                    <p> Congratulations! You got {this.state.numRight} out of {this.state.puzzleContent.length} correct! </p>
                    {this.state.finishedSending ?
                        <RedButton onClick={this.props.swap.bind(this, 'assignmentList')}> Return to assignment list </RedButton>
                        : <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading"/> }
                </div>
            )
        } else if (this.state.isChild) {
            return (
                <div>
                    <h2> Tactics Puzzle: {this.state.assignmentName} </h2>
                    <p> Sub-Question of {this.state.currentQuestion + 1}: {this.state.objective} </p>
                    <div key={this.state.position +
                            (this.state.showSubmitButton
                                ? new Date().getTime(): null)}>
                        <Chessboard
                            position={this.state.position}
                            width={300}
                            transitionDuration={150}
                            dropOffBoard={'snapback'}
                            getPosition={this.handlePositionChange}
                            draggable={!this.state.showSubmitButton}/>
                    </div>
                    {this.state.showSubmitButton ?
                        <div style={{marginTop:"1vh"}}>
                            <GreenButton onClick={this.handleSubQuestionSubmit}> Submit Answer </GreenButton>
                            <GreenButton style={{backgroundColor: "#fcc10f", color: "black", border: "none"}} onClick={this.handleReset}> Undo Move </GreenButton>
                        </div>
                        : null}
                </div>
            )
        } else {
            return (
                <div>
                    <h2> Tactics Puzzle: {this.state.assignmentName} </h2>
                    <p> Question {this.state.currentQuestion + 1}: {this.state.objective} </p>
                    <div key={this.state.position +
                            (this.state.showSubmitButton
                                ? new Date().getTime()
                                : null)}> {/**Hack to force chessboard state to update, due to bug with chessboard.jsx. I know that this isn't how keys should be used, but the alternative means rewriting this guy's whole module**/}
                        <Chessboard
                            position={this.state.position}
                            width={300}
                            transitionDuration={150}
                            dropOffBoard={'snapback'}
                            draggable={!this.state.showSubmitButton}
                            getPosition={this.handlePositionChange}/>
                    </div>
                    {this.state.showSubmitButton ?
                        <div style={{marginTop:"1vh"}}>
                            <GreenButton style={{marginLeft: 0}} onClick={this.handleQuestionSubmit}> Submit Answer </GreenButton>
                            <GreenButton style={{backgroundColor: "#fcc10f", color: "black", border: "none"}} onClick={this.handleReset}> Undo Move </GreenButton>
                        </div>
                        : null}
                </div>
            )
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    /// FOLLOWING COPIED FROM CHESSBOARD.JSX MODULE
    // TO CONVERT A POSIITON OBJECT TO FEN STRING
    // position object to FEN string
    objToFen(obj) {
      let fen = '';
      let COLUMNS = 'abcdefgh'.split('');

      let currentRow = 8;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          let square = COLUMNS[j] + currentRow;

          // piece exists
          if (obj.hasOwnProperty(square)) {
            fen = fen + this.pieceCodeToFen(obj[square]);
          } else {
            // empty space
            fen = fen + '1';
          }
        }

        if (i !== 7) {
          fen = fen + '/';
        }

        currentRow = currentRow - 1;
      }

      // squeeze the empty numbers together
      fen = this.squeezeFenEmptySquares(fen);

      return fen;
    }
    pieceCodeToFen(piece) {
      let pieceCodeLetters = piece.split('');

      // white piece
      if (pieceCodeLetters[0] === 'w') {
        return pieceCodeLetters[1].toUpperCase();
      }

      // black piece
      return pieceCodeLetters[1].toLowerCase();
    }
    squeezeFenEmptySquares(fen) {
      return fen
        .replace(/11111111/g, '8')
        .replace(/1111111/g, '7')
        .replace(/111111/g, '6')
        .replace(/11111/g, '5')
        .replace(/1111/g, '4')
        .replace(/111/g, '3')
        .replace(/11/g, '2');
    }
////////////////////////////////////////////////////////////////////////////////
}
