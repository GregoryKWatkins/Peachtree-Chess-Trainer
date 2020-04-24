import React from "react"

import Database from "../Database"

import {BlockPicker} from "react-color"
import Select from 'react-select';
import {ModalBG, DefaultContainer, Button, GreenButton, RedButton} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling.js"

class AdminCurriculumModal extends React.Component {
    // receives as props:
    // toggleModal: used to toggle itself back off
    // selectedCurric: object containing all the relevant information for the selected curriculum
    // rerunQuery: for rerunning the database query after making a change to the backend (for the stuff on the curric creator page, not for the modal)
    // getAssignableModules: function that returns a list of modules that can be assigned ot this curric (already assigned to this or assigned to none)
    constructor(props) {
        super(props)

        let curric = this.props.selectedCurric
        if (curric != null) {
            this.state = {
                curricId: curric.curricId,
                curricName: curric.curricName,
                curricColor: curric.curricColor,
                curricDesc: curric.curricDesc,
                curricPiece: curric.curricPiece,
                curricPrice: curric.curricPrice,
                moduleIds: (!curric.moduleIds ? [] : curric.moduleIds), //null check
                initModuleIds: (!curric.moduleIds ? [] : curric.moduleIds), //module ids at start, kept the same
                published: curric.published,

                displayColorPicker: false
            }
        } else {
            // default values for a new curriculum
            this.state = {
                curricId: null,
                curricName: "Unnamed Curriculum",
                curricColor: "9DD1F1",
                curricDesc: "This describes the curriculum as presented on the pricing page.",
                curricPiece: "w_pawn",
                curricPrice: "$10.00",
                moduleIds: [],
                initModuleIds: [],
                published: false,

                displayColorPicker: false
            }
        }

        this.handleColorChange = this.handleColorChange.bind(this)
        this.handleIconTeamChange = this.handleIconTeamChange.bind(this)
        this.handleIconPieceChange = this.handleIconPieceChange.bind(this)
        this.handleChosenModulesChange = this.handleChosenModulesChange.bind(this)
        this.handleSubmitCurricChanges = this.handleSubmitCurricChanges.bind(this)
        this.handleCurricDelete = this.handleCurricDelete.bind(this)
        this.handlePublishedChange = this.handlePublishedChange.bind(this)
    }

    handleCurricDelete() {
        if (window.confirm("WARNING: PLEASE READ. Are you sure you would like to delete this curriculum? All modules that are part of this curriculum will remain, but anyone who has purchased this curriculum will lose access to it.")) {
            if (window.confirm("Are you absolutely sure?")) {
                let tempThis = this
                let onDeleteSuccess = function(result) {
                    alert("Curriculum deleted")
                    tempThis.props.toggleModal()
                    tempThis.props.rerunQuery()

                }
                let onDeleteFail = function(error) {
                    alert("Error: Deletion failed")
                }
                Database.deleteCurriculum(this.state.curricId, onDeleteSuccess, onDeleteFail)
            }
        }
    }

    //update state value for module name
    handleNameChange(event) {
        let newName = event.target.value
        this.setState({curricName: newName})
    }
    //update state value for module name
    handleDescChange(event) {
        let newDesc = event.target.value
        this.setState({curricDesc: newDesc})
    }
    //update state value for module name
    handlePriceChange(event) {
        let newPrice = event.target.value
        this.setState({curricPrice: newPrice})
    }

    //update state value for module name
    handleColorChange(color) {
        this.setState({curricColor: color.hex})
    }

    handleIconTeamChange(selectedOption) {
        let newTeam = selectedOption.value
        //replace first char of curricPiece with this new value
        let update = newTeam + this.state.curricPiece.substring(1)
        this.setState({curricPiece:update})
    }
    handleIconPieceChange(selectedOption) {
        let newPiece = selectedOption.value
        //replace rest of curricPiece with this new value
        let update = this.state.curricPiece.substring(0,2) + newPiece
        this.setState({curricPiece:update})
    }

    handleChosenModulesChange(selected) {
        let newModuleIds = []
        if (selected != null) {
            for (module of selected) {
                newModuleIds.push(module.value)
            }
        }
        this.setState({moduleIds: newModuleIds})
    }

    handlePublishedChange(event) {
        let published = (event.target.value === "true") //cast to bool
        if (published) {
            if (window.confirm("Publishing this curriculum will make it available for purchase. Are you sure you would like to publish?")) {
                this.setState({published: published})
            }
        } else {
            if (window.confirm("WARNING: Unpublishing this curriculum will pull it from the pricing page. It will also be removed from all classes, and anyone who has purchased it will lose access to it. Are you sure you would like to unpublish?")) {
                this.setState({published: published})
            }
        }

    }

    // apply module name update
    handleSubmitCurricChanges() {
        let state = this.state

        // find modules that need to be added and modules that should be removed
        // let modsToAdd = []
        // for (const newModule of state.moduleIds) {
        //     if (!state.initModuleIds.includes(newModule)) { // found a module to add
        //         modsToAdd.push(newModule)
        //     }
        // }
        // turns out we just need to re-add all modules currently assigned. Trying
        // to be smart about it by finding the diff just messes up the order
        let modsToAdd = this.state.moduleIds

        let modsToRemove = []
        for (const oldModule of state.initModuleIds) {
            if (!state.moduleIds.includes(oldModule)) { // found a module to remove
                modsToRemove.push(oldModule)
            }
        }

        let curricPrice = state.curricPrice.toString()
        if (!state.curricPrice.includes("$")) {
            curricPrice = "$" + curricPrice
        }

        let tempThis = this
        let onAddSuccess = function(result) {
            if (modsToRemove.length > 0 ) { // we try to remove modules
                Database.assignModules(onRemoveSuccess, onRemoveFail, modsToRemove, null) //now trigger removal of modules from curric
            } else { //we skip and go to updating the curriculum
                Database.editCurriculum(state.curricId, onUpdateCurricSuccess, onUpdateCurricFail, state.curricColor,
                        state.curricDesc, state.curricName, state.curricPiece, curricPrice, state.published)
            }
        }
        let onRemoveSuccess = function(result) {
            Database.editCurriculum(state.curricId, onUpdateCurricSuccess, onUpdateCurricFail, state.curricColor,
                                    state.curricDesc, state.curricName, state.curricPiece, curricPrice, state.published)
        }
        let onUpdateCurricSuccess = function(result) {
            alert("Updated curriculum successfully")
            tempThis.props.rerunQuery()
        }

        let onUpdateCurricFail = function(error) {
            alert("Error: Failed to update curriculum")
        }
        let onRemoveFail = function(error) {
            alert("Error: Failed to remove modules")
        }
        let onAddFail = function(error) {
            alert("Error: Failed to add modules")
        }

        // functional madness starts here
        if (modsToAdd.length > 0) {
            Database.assignModules(onAddSuccess, onAddFail, modsToAdd, state.curricId) //start by assign modules to curric
        } else if (modsToRemove.length > 0) {
            Database.assignModules(onRemoveSuccess, onRemoveFail, modsToRemove, null) //start by trigger removal of modules from curric
        } else { //skip all that and just update the curriculum
            Database.editCurriculum(state.curricId, onUpdateCurricSuccess, onUpdateCurricFail, state.curricColor,
                    state.curricDesc, state.curricName, state.curricPiece, curricPrice, state.published)
        }
    }

    handleColorToggle = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    }

    render() {
        let priceVal = Number(this.state.curricPrice.replace(/\$/g, ''))

        let piece = this.state.curricPiece.split("_")
        let chosenTeam = piece[0]
        let chosenPiece = piece[1]
        const teams = [
            {value: 'w', label: 'White'},
            {value: 'b', label: 'Black'}
        ]
        const pieces = [
            {value: 'pawn', label: 'Pawn'},
            {value: 'rook', label: 'Rook'},
            {value: 'bishop', label: 'Bishop'},
            {value: 'knight', label: 'Knight'},
            {value: 'queen', label: 'Queen'},
            {value: 'king', label: 'King'}
        ]
        // Select value for team
        if (chosenTeam === "w") {
            chosenTeam = teams[0]
        } else {
            chosenTeam = teams[1]
        }
        // Select value for piece
        for (const entry of pieces) {
            if (chosenPiece === entry.value) {
                chosenPiece = entry
            }
        }

        // get all modules assigned to this curric + all unassigned modules
        let assignableModules = this.props.getAssignableModules(this.state.curricId)
        let moduleChoices = [] //modules to select from
        let alreadyChosen = [] //the modules that are also already selected

        //first go through the modules that are already chosen, put those first so they show up according to their order
        let order = 1
        for (const alreadyPicked of this.state.moduleIds) { //alreadyPicked is a moduleId string
            //find the corresponding name for this
            //let name
            for (const choice of assignableModules) {
                if (choice.id === alreadyPicked) {
                    let entry = {value: alreadyPicked, label: order + ": " + choice.name }
                    // add this to Select value and options
                    moduleChoices.push(entry)
                    alreadyChosen.push(entry)
                    //remove this from assignable since we've dealt with it
                    let removalIndex = assignableModules.indexOf(choice)
                    assignableModules.splice(removalIndex, 1)
                    //update order number
                    order += 1
                }
            }
        }
        // now run through once more for the unassigned modules
        for (const assignable of assignableModules) {
            let entry = {value: assignable.id, label: assignable.name}
            moduleChoices.push(entry)
        }

        //Create list of assignments from database and show
        let content = (
            <div>
                <h2>Curriculum Settings:</h2>
                <div style={{display: "inling-block"}}>
                    <div style={{width: "50%", overflow:"hidden", float: "left"}}>
                        <p><strong>Name: </strong></p>
                        <textarea
                            style={{resize: "none", width:"80%", backgroundColor:"white", height: "100%", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                            rows="1"
                            cols="30"
                            value={this.state.curricName}
                            onChange={(event) =>
                                this.handleNameChange(event)}
                            name="curricName"
                            maxLength={50}
                            minLength="1"
                        ></textarea>
                    </div>

                    <div style={{width:"50%", marginLeft:"50%"}}>
                        <p><strong>Description: </strong></p>
                        <textarea
                            style={{resize: "none", width:"80%", backgroundColor:"white", height: "100%", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                            rows="3"
                            cols="50"
                            value={this.state.curricDesc}
                            onChange={(event) =>
                                this.handleDescChange(event)}
                            name="curricDesc"
                            minLength="1"
                        ></textarea>
                    </div>
                </div>

                <div style={{marginTop: 0}}>
                    <p><strong>Price: </strong></p>
                    $<input
                        type="number"
                        value={priceVal}
                        min="0.01"
                        step="0.01"
                        onChange={(event) =>
                            this.handlePriceChange(event)}
                        name="curricPrice"
                        minLength="1"
                    ></input>
                </div>

                <div>
                    <div>
                        <p><strong>Piece: </strong></p>
                        <div >
                            <div>
                                <Select
                                    value={chosenTeam}
                                    options={teams}
                                    onChange={this.handleIconTeamChange}
                                />
                            </div>
                            <div>
                                <Select
                                value={chosenPiece}
                                options={pieces}
                                onChange={this.handleIconPieceChange}
                                />
                            </div>
                        </div>

                    </div>

                    <div>
                        <p><strong>Assign Modules: </strong></p>
                        <Select
                        style={{height: "15vh"}}
                        value={alreadyChosen}
                        onChange={this.handleChosenModulesChange}
                        isMulti
                        options={moduleChoices}
                        />
                    </div>

                </div>







                <div>
                    <Button style={{marginTop:"2vh", marginBottom:"2vh", backgroundColor:this.state.curricColor}} onClick={this.handleColorToggle}>Select Color</Button>
                    {this.state.displayColorPicker
                        ? <BlockPicker
                            color={this.state.curricColor}
                            triangle="hide"
                            width="100"
                            colors={['#EFABFF', '#A5FFD6', '#FF7788', '#F3D250', '#FB6107']}
                            onChange={this.handleColorChange}
                         />
                        : null}
                </div>

                <div style={{marginBottom: "4vh"}}>
                    <p><strong>Published:</strong></p>
                    <input type="radio"
                        checked={this.state.published}
                        value={true}
                        onChange={this.handlePublishedChange}
                    /> Available
                    <input type="radio"
                        checked={!this.state.published}
                        value={false}
                        onChange={this.handlePublishedChange}
                    /> Hidden
                </div>


                {/**<div style={{overflowY:"auto", maxHeight: "250px", marginBottom:"2vh"}}>
                    {this.state.assignmentsData.map(assignment =>
                        <div key={assignment.assignment_number} style={{marginBottom:"1vh"}}>
                            <p style={{display:"inline-block", margin: 0}}><strong>{assignment.assignment_type.charAt(0).toUpperCase() +
                                assignment.assignment_type.substring(1)}</strong>
                                : {assignment.assignment_name != null
                                        ? assignment.assignment_name
                                        : "unnamed assignment"
                                }</p>
                            <Button onClick={() => this.handleAssignmentDelete(assignment.assignment_number)} style={{float:"right", marginRight:"10vw"}}>
                                Delete Assignment
                            </Button>
                            <Button onClick={() => this.handleAssignmentClick(assignment)} style={{float:"right"}}>
                                Edit
                            </Button>
                        </div>
                    )}
                </div>**/}
                <GreenButton onClick={() => this.handleSubmitCurricChanges()}>Save</GreenButton>
                <RedButton onClick={this.props.toggleModal}>Cancel</RedButton>
                <RedButton onClick={() => this.handleCurricDelete()}>Delete Curriculum</RedButton>
            </div>
        )

        return (
             <ModalBG style={{overflowY: "auto"}}>
                <DefaultContainer style={{height:"90%", marginTop:"4vh", paddingTop: "1vh"}}>
                    {content}
                </DefaultContainer>
            </ModalBG>
        )
    }
}

export default AdminCurriculumModal