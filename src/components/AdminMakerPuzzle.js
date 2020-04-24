import React from "react"

import Collapsible from 'react-collapsible'

import Database from "../Database"
import Chessboard from "chessboardjsx";

import {GreenButton, RedButton, Button} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"

//im sorry for this code, i had no time to write it
class AdminMakerPuzzle extends React.Component {

    //recieves as props
    //assignmentData: describes data for this assignment, if it already existed
    //selectedModuleName: the name of module we are creating this assignment for
    //selectedModuleId: the id of module we are creating this assignment for
    //newAssignmentNumber: number for new assignment are currently in the module
    constructor(props){
        super(props)

        let assignData = this.props.assignmentData

        let assignmentName
        let assignmentNumber
        let qList
        if (assignData != null) {
            assignmentName = assignData.assignment_name
            assignmentNumber = assignData.assignment_number
            qList = assignData.content
        } else {
            //set defaults
            assignmentNumber = this.props.newAssignmentNumber
            assignmentName = "Unnamed Puzzle"
            qList = [{
                question_number: 1,
                board_config: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
                objective: "Solve the tactics puzzle.",
                success: [],
                failure: [],
                generic_failure: "Incorrect move."
            }]
        }

        let questionZero = qList[0]
        this.state = ({
            assignName: assignmentName,
            assignNum: assignmentNumber,

            puzzleContent: qList, //list of questions json to work with

            position: questionZero.board_config,
            currNodeString: "0", //describes how to navigate problem tree to get to currently focused board state

            // fields for specific question/ answer details
            objective: questionZero.objective,
            genericFailure: questionZero.generic_failure,
            message: "", //used by answers, not questions

            revert: false //boolean to trick this stupid chessboard into updating if a move is undone
        })

        this.handleNameUpdate = this.handleNameUpdate.bind(this)
        this.handlePuzzleSubmit = this.handlePuzzleSubmit.bind(this)
        this.handleSwapSelectedNode = this.handleSwapSelectedNode.bind(this)

        this.handleObjectiveUpdate = this.handleObjectiveUpdate.bind(this)
        this.handleGenFailUpdate = this.handleGenFailUpdate.bind(this)
        this.handleMessageUpdate = this.handleMessageUpdate.bind(this)

        this.handleQuestionAdd = this.handleQuestionAdd.bind(this)
        this.handleQuestionDelete = this.handleQuestionDelete.bind(this)
        this.handleAnswerAdd = this.handleAnswerAdd.bind(this)
        this.handleAnswerDelete = this.handleAnswerDelete.bind(this)
        this.handleCreateSubQuestion = this.handleCreateSubQuestion.bind(this)
        this.handleStateParentReset = this.handleStateParentReset.bind(this)
        this.handlePositionChange = this.handlePositionChange.bind(this)
        this.handleRemoveSubQuestion = this.handleRemoveSubQuestion.bind(this)

        this.fixQuestionNumbers = this.fixQuestionNumbers.bind(this)
    }

    // crawls through qList and returns a reference to the question/answer described by the nodeString
    findQuestion(nodeString, qList) {
        let steps = nodeString.split('-')
        let qNum = steps[0]
        let currQuestion = qList[qNum]
        steps.splice(0, 1) //every time we take a step, we pop off part of the steps list

        // drill down into tree until we find the question/sub-question we want to change
        while (steps.length > 0) {
            let step = steps[0]
            let which = step.charAt(0)
            if (which === "c") { //correct branch
                if (currQuestion.success === undefined) {
                    currQuestion = currQuestion.child_question //may need to step down to child question to see answers
                }
                currQuestion = currQuestion.success[Number(step.charAt(1))]
            } else if (which === "i"){                    //incorrect branch
                if (currQuestion.failure === undefined) {
                    currQuestion = currQuestion.child_question //may need to step down to child question to see answers
                }
                currQuestion = currQuestion.failure[Number(step.charAt(1))]
            } else if (which === "p") { //subquestion prompt
                currQuestion = currQuestion.child_question
            }
            steps.splice(0, 1) //pop off step
        }
        return currQuestion
    }

    //describes how we got to the current board state in english
    getNodePathInEnglish() {
        let readable = this.state.currNodeString
        readable = readable.split("-")
        let output = "Question " + (Number(readable[0]) + 1).toString()
        if (readable.length === 1) {
            //handles top level questions
            return output + " Prompt"
        }
        readable.splice(0,1) //deal with 0th index
        for (const step of readable) {
            if (step.charAt(0) === "c") {
                output += "/Right " + (Number(step.charAt(1)) + 1)
            } else if (step.charAt(0) === "i") {
                output += "/Wrong " + (Number(step.charAt(1)) + 1)
            } else if (step.charAt(0) === "p") {
                output += "/Prompt"
            }
        }
        return output
    }

    // takes in string that describes how to navigate JSON to get to the described board state and displays it,
    // setting it as the current board state in the editor. Also update all relevant fields to this question
    // first number determines which question, then the rest describes
    // whether or not to take a correct or incorrect branch and which index
    handleSwapSelectedNode(nodeString) {
        let question = this.findQuestion(nodeString, this.state.puzzleContent)
        this.setState({position: question.board_config,
                       currNodeString: nodeString,
                       objective: question.objective,
                       genericFailure: question.generic_failure,
                       message: question.message
                   })
    }

    handleNameUpdate(event) {
        let newName = event.target.value
        this.setState({assignName: newName})
    }

    //form question list into valid json and send to the database
    //TODO: THERE CAN BE NO QUESTIONS WITH NO RIGHT ANSWERS!!!
    handlePuzzleSubmit() {
        let puzzleJson
        if (this.props.assignmentData != null) { //overwrite old questions
            puzzleJson = this.props.assignmentData
            puzzleJson.content = this.state.puzzleContent
            puzzleJson.assignment_name = this.state.assignName
        } else { //make brand new puzzle
            puzzleJson = {
                assignment_number : this.props.newAssignmentNumber,
                assignment_type: "puzzle",
                assignment_name: this.state.assignName,
                content: this.state.puzzleContent
            }

        }

        //ensure all questions/subquestions have correct answers
        for (const i in puzzleJson.content) {
            let question = puzzleJson.content[i]
            //check top level question
            if (question.success.length === 0) {
                alert("All questions and sub-questions must have at least one correct answer.")
                return
            }
            //check all sub-questions and recursive sub-questions
            if (!this.recurseCheckAllHaveCorrectAnswers(question.success)) {
                alert("All questions and sub-questions must have at least one correct answer.")
                return
            }
        }

        let onSubmitSucces = function(result) {
            alert("Assignment successfully saved")
        }
        let onSubmitFail = function(error) {
            alert("Failed to update database")
        }

        Database.updateAssignment(puzzleJson, this.props.selectedModuleId,
                                  onSubmitSucces, onSubmitFail)
    }

    // recursively check question tree to make sure all questions have right answers
    // return true for a good tree, return false for an invalid one.
    recurseCheckAllHaveCorrectAnswers(correctList) {
        for (const i in correctList) { //check every answer
            let correct = correctList[i]
            if (correct.child_question) { //if it has a sub-question

                if (correct.child_question.success.length === 0) { //check that there are correct answers in sub-question
                    return false
                }

                if (!this.recurseCheckAllHaveCorrectAnswers(correct.child_question.success)) { //check all sub-questions
                    return false
                }
            }
        }
        //made it through entire subtree, so this is good.
        return true
    }

    // for updating question-specific fields
    handleObjectiveUpdate(event) {
        let newObjective = event.target.value
        let qListCopy = JSON.parse(JSON.stringify(this.state.puzzleContent))
        let question = this.findQuestion(this.state.currNodeString, qListCopy)
        question.objective = newObjective
        //update visuals and tree
        this.setState({objective: newObjective, puzzleContent: qListCopy, revert:false})
    }
    handleGenFailUpdate(event) {
        let newMessage = event.target.value
        let qListCopy = JSON.parse(JSON.stringify(this.state.puzzleContent))
        let question = this.findQuestion(this.state.currNodeString, qListCopy)
        question.generic_failure = newMessage
        //update visuals and tree
        this.setState({genericFailure: newMessage, puzzleContent: qListCopy, revert:false})
    }

    // for updating answer-specific fields
    handleMessageUpdate(event) {
        let newMessage = event.target.value
        let qListCopy = JSON.parse(JSON.stringify(this.state.puzzleContent))
        let answer = this.findQuestion(this.state.currNodeString, qListCopy)
        answer.message = newMessage
        //update visuals and tree
        this.setState({message: newMessage, puzzleContent: qListCopy, revert:false})
    }

    handleQuestionAdd() {
        let qListCopy = JSON.parse(JSON.stringify(this.state.puzzleContent))
        let newQuestion = {
            question_number: qListCopy.length + 1,
            board_config: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            objective: "Solve the tactics puzzle.",
            success: [],
            failure: [],
            generic_failure: "Incorrect move."
        }
        qListCopy.push(newQuestion)
        this.setState({puzzleContent: qListCopy})
    }


    handleQuestionDelete(qIndex) {
        if (window.confirm("Are you sure you would like to delete this question? This question and all of its sub-questions will be deleted.")) {
            if (this.state.puzzleContent.length === 1) {
                alert("There cannot be zero questions in a tactics puzzle")
                return
            }
            let qListCopy = JSON.parse(JSON.stringify(this.state.puzzleContent))
            qListCopy.splice(qIndex, 1)
            //quiz structure has changed, so question numbers must be updated
            qListCopy = this.fixQuestionNumbers(qListCopy)
            // also change active boardstate to the 0th question to protect from editing a nonexistent question
            let safeBoardState = this.findQuestion("0", qListCopy)
            this.setState({puzzleContent: qListCopy,
                           currNodeString: "0",
                           position: safeBoardState.board_config,
                           objective: safeBoardState.objective,
                           genericFailure: safeBoardState.generic_failure})
        }
    }

    // nodeString: how to navigate to the question to add an answer to
    // isRight: whether we are adding an answer to the correct moves or incorrect moves (true-> correct move)
    handleAnswerAdd(nodeString, isRight) {
        let qListCopy = JSON.parse(JSON.stringify(this.state.puzzleContent))
        let question = this.findQuestion(nodeString, qListCopy)

        // we've found where we need to be. Now add another answer to the tree

        // let parentBoardState = question.board_config
        let parentBoardState
        if (question.child_question) {
            parentBoardState = question.child_question.board_config
        } else {
            parentBoardState = question.board_config
        }

        let newAnswer
        if (isRight) { //make new correct answer
            newAnswer = {
                board_config: parentBoardState, //just set equal to parent's to be modified.
                message: "Good job!"
            }
            if (question.success === undefined) {
                    question = question.child_question //may need to step down to child question to see answers
            }
            question.success.push(newAnswer) //add to correct answer list
        } else { //make new incorrect answer
            newAnswer = {
                board_config: parentBoardState,
                message: "Not quite, but don't give up!"
            }
            if (question.success === undefined) {
                    question = question.child_question //may need to step down to child question to see answers
            }
            question.failure.push(newAnswer) //add to incorrect answer list
        }

        this.setState({puzzleContent: qListCopy}) //apply changes
    }

    // deletes the answer at the specified nodeString
    // If the answer has sub-questions as children, they will obviously be deleted too
    // parentNodeString: defines where the parent of the answer to delete is
    // iSRight: true if this is a correct answer
    // ansIndex: index of the answer to delete
    // answerCount: how many answers of this type are there (used to prevent case where question has no answers)
    handleAnswerDelete(parentNodeString, isRight, ansIndex, answerCount) {
        if (isRight && answerCount === 1) {
            alert("There cannot be a question with no right answers")
            return
        }
        let qListCopy = JSON.parse(JSON.stringify(this.state.puzzleContent))
        let parentToDeleteFrom = this.findQuestion(parentNodeString, qListCopy)
        let warningText
        let answerToDelete
        if (isRight) {
            if (parentToDeleteFrom.success === undefined) {
                parentToDeleteFrom = parentToDeleteFrom.child_question //may need to step down to child question to see answers
            }
            answerToDelete = parentToDeleteFrom.success[ansIndex]
        } else {
            if (parentToDeleteFrom.failure === undefined) {
                parentToDeleteFrom = parentToDeleteFrom.child_question //may need to step down to child question to see answers
            }
            answerToDelete = parentToDeleteFrom.failure[ansIndex]
        }
        if (answerToDelete.child_question === undefined ) {
            warningText = "Are you sure you would like to delete this answer?"
        } else { //warn about deletion of sub questions
            warningText = "Are you sure you would like to delete this answer? All sub-questions will also be deleted."
        }

        if (isRight) { //delete correct answer
            if (window.confirm(warningText)) { //ask, then delete
                parentToDeleteFrom.success.splice(ansIndex, 1)
            } else {
                return // dont need to do anything, back out
            }
        } else { //delete incorrect answer
            if (window.confirm(warningText)) { //ask, then delete.
                parentToDeleteFrom.failure.splice(ansIndex, 1)
            } else {
                return // dont need to do anything, back out
            }
        }

        //if we deleted the answer, we should also switch to the parent as active board state to make sure
        //we cant modify a nonexistent board

        this.setState({puzzleContent: qListCopy, currNodeString: parentNodeString, position: parentToDeleteFrom.board_config})
    }

    // Takes an ordinary leaf answer and adds on a sub-question
    // nodeString: defines location of answer we want to add a subquestion to
    handleCreateSubQuestion(nodeString) {
        let qListCopy = JSON.parse(JSON.stringify(this.state.puzzleContent))
        let answerToConvert = this.findQuestion(nodeString, qListCopy)
        answerToConvert.child_question = {
            board_config: answerToConvert.board_config, //prompt
            objective: "New sub-question objective.",
            success: [],
            failure: [],
            generic_failure : "Incorrect move."
        }
        this.setState({puzzleContent: qListCopy})
    }

    // Removes a sub-question from an answer, converting it into a normal leaf answer
    // nodeString: defines location of answer we want to remove a subquestion from
    handleRemoveSubQuestion(nodeString) {
        if (window.confirm("This action will remove this answer's sub-question, but keep the answer. Continue?")) { //ask, then delete
            let qListCopy = JSON.parse(JSON.stringify(this.state.puzzleContent))
            let answerToConvert = this.findQuestion(nodeString, qListCopy)
            answerToConvert.child_question = null
            this.setState({puzzleContent: qListCopy, currNodeString: nodeString, position: answerToConvert.board_config})
        }
    }

    //resets the current question's board state to whatever the parent question's board was.
    // has the potential to invalidate children questions
    handleStateParentReset() {
        let qListCopy = JSON.parse(JSON.stringify(this.state.puzzleContent))

        let stepList = this.state.currNodeString.split('-')
        //need to check for invalidation for answers/ subquestions if this is a subquestion prompt
        if (stepList[stepList.length - 1] === 'p') {
            if (!this.checkIfInvalidateChildren(this.state.currNodeString, qListCopy)) {
                return //cancelling
            }
        }
        let currentQuestion = this.findQuestion(this.state.currNodeString, qListCopy)

        let parentNodeString
        if (stepList[stepList.length - 1] === 'p') {
            parentNodeString = this.state.currNodeString.slice(0, -2)
        } else {
            if (stepList.length >= 3) {
                // answers in subquestions should refer to their prompt, not their parent answer
                parentNodeString = this.state.currNodeString.slice(0, -3)
                parentNodeString += '-p'
            } else {
                // deal with top level questions
                parentNodeString = this.state.currNodeString.slice(0, -3)
            }
        }
        let parentQuestion = this.findQuestion(parentNodeString, qListCopy)

        //reset board state by modifying qListCopy (also update board visually)
        currentQuestion.board_config = parentQuestion.board_config
        // also turn off board lock because we've reset to parent
        currentQuestion.board_lock = false
        this.setState({puzzleContent: qListCopy, position: parentQuestion.board_config})
        // this.setState({puzzleContent: qListCopy, position: parentQuestion.board_config, boardLock: true})
    }

    // this function is called whenever the board state is changed by a user
    // We update the board visually as well as updating our question tree
    handlePositionChange(position) {
        let qListCopy = JSON.parse(JSON.stringify(this.state.puzzleContent))
        let questionToChange = this.findQuestion(this.state.currNodeString, qListCopy)
        let originalState = questionToChange.board_config

        // are we dealing with a subquestion prompt?
        let nodeStringCheck = this.state.currNodeString.split("-")
        if (nodeStringCheck[nodeStringCheck.length - 1] === "p") {
            //check if this change would invalidate children, cancel if user wants
            if (!this.checkIfInvalidateChildren(this.state.currNodeString, qListCopy)) {
                //explicitly set board state back to original state, cancels user's change
                this.setState({position:originalState, revert:true})
                return //cancelling
            }

        } else if (nodeStringCheck.length === 1){
            // For top level questions
            //check if this change would invalidate children, cancel if user wants
            if (!this.checkIfInvalidateChildren(this.state.currNodeString, qListCopy)) {
                //explicitly set board state back to original state, cancels user's change
                this.setState({position:originalState, revert: true})
                return //cancelling
            }
        } else {
            // For answers without subproblems
            //do nothing if board is locked
            if (questionToChange.board_lock) {
                alert('Multiple moves cannot be made in the same sub-problem. To modify this problem, click the "Reset" button.')
                //explicitly set board state back to original state, cancels user's change
                this.setState({position:originalState, revert: true})
                return
            }
            //do we need to turn on board lock? Only if we made a move in a subproblem
            if (nodeStringCheck.length > 1) { //we're in a subproblem
                questionToChange.board_lock = true
            }
        }

        let fen = this.objToFen(position)
        questionToChange.board_config = fen //update board position
        // this.setState({position: fen, puzzleContent: qListCopy, boardLock: lock})
        this.setState({position: fen, puzzleContent: qListCopy, revert: false})
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

    // check if a question/ sub-question has any children sub-questions.
    // If it does, warns the user that whatever they are doing will
    // delete the children. If they want to invalidate children,
    // deletes the children and returns true. Otherwise if they back out, return false
    // nodeString: location of the question that we need to check
    // qListCopy: copy of question list to modify if we should
    checkIfInvalidateChildren(nodeString, qListCopy) {
        let question = this.findQuestion(nodeString, qListCopy)
        //check if the child has any children
        if ((question.success && question.success.length !== 0) ||
            (question.failure && question.failure.length !== 0)) { //for top level question
            if (window.confirm("This question has answers depending on this board, so continuing this action will delete them. Is this acceptable?")) {
                question.success = []
                question.failure = []
                return true
            }
            return false
        } else if (question.child_question) { //for sub-question
            if (window.confirm("This answer has sub-questions, so continuing this action will delete them. Is this acceptable?")) {
                question.child_question = null
                return true
            }
            return false
        } else {
            return true
        }
    }

    // since questions can be added and deleted need to assign
    // valid question numbers when done editing the question list.
    fixQuestionNumbers(currQList) {
        for (let i = 0; i < currQList.length; i++) {
            currQList[i].question_number = i + 1
        }
        return currQList
    }

    // recursively construct file explorer-like structure for navigating the branching
    // nature of a tactics puzzle question on the frontend.
    // question: the json of the current question or subquestion being addressed
    // parentKey: identifier of parent, prepended to each question's key
    recurseGetPuzzleExplorer(question, parentKey) {
        let listItems = (

            <div style={{marginLeft: '1vw', padding:'1vh', marginTop: "1vh", width:"100%"}}>

                {parentKey.split("-").length === 1 //only show prompt state for top level questions
                    ?   <div style={{textAlign:"left"}}>
                            <h3><strong>Prompt State </strong></h3>
                            <h3><Button onClick={() => this.handleSwapSelectedNode(parentKey)}>View/Edit Board</Button> {parentKey === this.state.currNodeString ? "(Active)" : null}</h3>
                            <hr></hr>
                        </div>
                    :   <div>
                            <p><strong>Answer State: </strong><Button onClick={() => this.handleSwapSelectedNode(parentKey)}>View/Edit Board</Button></p>

                            <p><strong>Prompt State: </strong><Button onClick={() => this.handleSwapSelectedNode(parentKey + "-p")}>View/Edit Board</Button>{parentKey + "-p" === this.state.currNodeString ? "(Active)" : null}</p>

                            <RedButton onClick={() => this.handleRemoveSubQuestion(parentKey)}>Remove Sub-Question</RedButton>
                        </div>
                }

                <div style={{textAlign:"left"}}>
                    <h3><strong>Right Moves </strong></h3>
                    {question.success.map((right, index) => //make list for correct answers
                        <div style={{marginLeft: "1vw", marginBottom: "1vh"}}>
                            {right.child_question != null //does this answer have a sub-question?
                                ? <div style={{display:"inline-block", width: "95%"}}> {/**Has a sub question**/}
                                      <Collapsible trigger={"Answer " + (index + 1)} triggerStyle={{
                                        display: "block",
                                        fontWeight: "400",
                                        textDecoration: "none",
                                        color: "white",
                                        position: "relative",
                                        padding: "10px",
                                        background: "#00ac9d",
                                        width: "95%",
                                        cursor:"pointer"
                                    }}>
                                        <div style={{width:"98%", backgroundColor: "rgba(0,0,0,0.05)"}}>
                                            {this.recurseGetPuzzleExplorer(right.child_question, parentKey + "-c" + index)}
                                        </div>

                                      </Collapsible>
                                      {parentKey + "-c" + index === this.state.currNodeString ? "(Active)" : null}
                                  </div>
                                : <div> {/**No sub question**/}
                                    Answer {index + 1}
                                    <Button style={{marginRight:"1vw", marginLeft: "1vw"}} onClick={() => this.handleSwapSelectedNode(parentKey + "-c" + index)}>
                                        View/Edit Board
                                    </Button>
                                    <strong>{parentKey + "-c" + index === this.state.currNodeString ? "(Active)" : null}</strong>
                                    <RedButton style={{}} onClick={() => this.handleAnswerDelete(parentKey, true, index, question.success.length)}>
                                        Delete Answer
                                    </RedButton>
                                    <GreenButton onClick={() => this.handleCreateSubQuestion(parentKey + "-c" + index)}>
                                        Add Sub-Question
                                    </GreenButton>
                                  </div>
                            }
                        </div>
                    )}
                    <GreenButton style={{marginLeft: 0, marginTop: "2vh"}} onClick={() => this.handleAnswerAdd(parentKey, true)}>Add Correct Answer</GreenButton>
                </div>

                <hr></hr>

                <div style={{textAlign:"left"}}>
                    <h3><strong>Wrong Moves </strong></h3>
                    {question.failure.map((wrong, index) => //make list for wrong answers
                        <div style={{marginLeft:"1vw", marginBottom:"1vh"}}>
                            {wrong.child_question != null
                                ? <div style={{display:"inline-block", width: "95%"}}> {/**Has a sub question**/}
                                        <Collapsible trigger={"Answer " + (index + 1)} triggerStyle={{
                                            display: "block",
                                            fontWeight: "400",
                                            textDecoration: "none",
                                            color: "white",
                                            position: "relative",
                                            padding: "10px",
                                            background: "#00ac9d",
                                            width: "95%",
                                            cursor:"pointer"
                                        }}>
                                            <div style={{width: "98%", backgroundColor: "rgba(0,0,0,0.05)"}}>
                                                {this.recurseGetPuzzleExplorer(wrong.child_question, parentKey + "-i" + index)}``
                                            </div>

                                        </Collapsible>
                                        {wrong.child_question, parentKey + "-i" + index === this.state.currNodeString ? "(Active)" : null}
                                  </div>
                                : <div> {/**No sub question**/}
                                    Answer {index + 1}
                                    <Button style={{marginLeft: "1vw", marginRight: "1vw"}} onClick={() => this.handleSwapSelectedNode(parentKey + "-i" + index)}>
                                        View/Edit Board
                                    </Button>
                                    <strong>{wrong.child_question, parentKey + "-i" + index === this.state.currNodeString ? "(Active)" : null}</strong>
                                    <RedButton onClick={() => this.handleAnswerDelete(parentKey, false, index, question.failure.length)}>
                                        Delete Answer
                                    </RedButton>
                                    <GreenButton onClick={() => this.handleCreateSubQuestion(parentKey + "-i" + index)}>
                                        Add Sub-Question
                                    </GreenButton>

                                  </div>
                            }
                        </div>
                    )}
                    <GreenButton style={{marginLeft: 0, marginTop: "1vh"}} onClick={() => this.handleAnswerAdd(parentKey, false)}>Add Incorrect Answer</GreenButton>
                </div>
            </div>
        )

        return listItems
    }


    render() {
        let puzzleExplorerList = this.state.puzzleContent.map((question, qIndex) =>
            <Collapsible trigger={"Question " + question.question_number} triggerStyle={{
                display: "block",
                fontWeight: "400",
                textDecoration: "none",
                color: "white",
                position: "relative",
                padding: "10px",
                background: "#00ac9d",
                width: "100%",
                cursor:"pointer",
                marginTop:"1vh"
            }}>
                <div style={{backgroundColor: "rgba(0,0,0,0.05)"}}>
                    {this.recurseGetPuzzleExplorer(question, (question.question_number - 1).toString())}
                </div>

                <RedButton onClick={() => this.handleQuestionDelete(qIndex)}>Delete Question</RedButton>
            </Collapsible>
        )
        let nodeArray = this.state.currNodeString.split("-")

        return(
            <div>

                <div>
                    <div style={{float:"right", marginTop: "10%"}}>
                        <Collapsible trigger="Questions" open={true} triggerStyle={{
                        display: "block",
                        fontWeight: "400",
                        textDecoration: "none",
                        color: "white",
                        position: "relative",
                        padding: "10px",
                        background: "#00ac9d",
                        width: "100%",
                        cursor:"pointer",
                        minWidth: "33vw"
                    }}>
                            <div style={{backgroundColor: "rgba(0,0,0,0.05)"}}>
                                {puzzleExplorerList}
                                <GreenButton style={{marginLeft: 0, marginTop:"1vh"}}onClick={this.handleQuestionAdd}>Add Question</GreenButton>
                            </div>
                        </Collapsible>
                    </div>
                    <h1>Tactics Puzzle Creator - {this.props.selectedModuleName}</h1>
                    <label><strong><h2>Puzzle Name: </h2></strong></label>
                    <input
                        style={{resize: "none", paddingLeft:".5vw", width:"20%", backgroundColor:"white", height: "120%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                        value={this.state.assignName}
                        onChange={(event) =>
                            this.handleNameUpdate(event)}
                        name="quizName"
                        minLength="1"
                        maxLength={50}
                    >
                    </input>

                    {/* <p>Debug:<br/>
                    {this.state.position}<br/>
                    {this.state.currNodeString}</p> */}

                    {/**Put chessboard state related controls here**/}
                    <div>
                        <h1>Board Editor</h1>
                        <h3>Currently Editing {this.getNodePathInEnglish(this.state.currNodeString)}</h3>
                        <div key={this.state.position +
                            (this.state.revert
                                ? new Date().getTime()
                                : null)}
                        > {/**Hack to force chessboard state to update, due to bug with chessboard.jsx. I know that this isn't how keys should be used, but the alternative means rewriting this guy's whole module**/}
                            <Chessboard position={this.state.position}
                                        width={300}
                                        transitionDuration={150}
                                        sparePieces={true}
                                        dropOffBoard={'trash'}
                                        getPosition={this.handlePositionChange}
                        />
                    </div>
                        {/**<p>Label: </p>
                        <input
                            value={this.state.assignName}
                            onChange={(event) =>
                                this.handleNameUpdate(event)}
                            name="quizName"
                            minLength="1"
                        ></input>**/}

                        {/**Are we showing settings for a question or an answer**/}
                        {this.findQuestion(this.state.currNodeString, this.state.puzzleContent).objective !== undefined
                            ? //this is a question
                            <div>
                                <h3>Question Settings:</h3>
                                <p>Objective: </p>
                                <textarea
                                    style={{width:"40%", paddingTop:"1vh", paddingLeft: "1vw", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                                    rows="3"
                                    cols="30"
                                    value={this.state.objective}
                                    onChange={(event) =>
                                        this.handleObjectiveUpdate(event)}
                                    name="objective"
                                    minLength="1"
                                ></textarea>

                                <p>Generic Failure Message: </p>
                                <textarea
                                    style={{width:"40%", paddingTop:"1vh", paddingLeft: "1vw", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                                    rows="3"
                                    cols="30"
                                    value={this.state.genericFailure}
                                    onChange={(event) =>
                                        this.handleGenFailUpdate(event)}
                                    name="genericFailure"
                                    minLength="1"
                                ></textarea>

                            </div>
                            : //this is an answer
                            <div>
                                <h3>Answer Settings:</h3>
                                <p>Message: </p>
                                <textarea
                                    style={{width:"40%", paddingTop:"1vh", paddingLeft: "1vw", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                                    rows="3"
                                    cols="30"
                                    value={this.state.message}
                                    onChange={(event) =>
                                        this.handleMessageUpdate(event)}
                                    name="message"
                                    minLength="1"
                                ></textarea>
                            </div>
                        }

                        {nodeArray.length > 1
                            //only need to give option to reset to parent if it has a parent
                            ? <Button style={{marginBottom: "2vh"}} onClick={() => this.handleStateParentReset()}>
                                {nodeArray[nodeArray.length - 1] === 'p' //what text button should show
                                    ? "Reset Prompt Board to Answer's" //case where child prompt can be reset to what the previous parent answer
                                    : "Reset Answer Board to Prompt's" //case where child answer can be reset to previous parent prompt
                                }
                            </Button>
                            : null}

                    </div>


                </div>



                <GreenButton style={{marginLeft: 0, marginBottom: "1vh", marginTop: "1vh"}} onClick={this.handlePuzzleSubmit}>Submit Puzzle</GreenButton>
            </div>
        )

    }

}

export default AdminMakerPuzzle