import React from 'react'
import Database from "../Database"

import {Button, GreenButton, RedButton} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"

export default class PricingListing extends React.Component {

    // Passed as props:
    // -curriculumName: name of the curriculum we are listing
    // -curriculumPrice: price of the curriculum we are listing
    // -curriculumID: id of the curriculum we are listing
    // -test()

    constructor(props) {
        super(props)

        this.state = {
            showInput: false, // Boolean for whther or not to show input boxes
            newCurriculumPrice: this.props.curriculumPrice // If the user inputs a number, it is stored here
        }

        this.displayInput = this.displayInput.bind(this)
        this.changeCurriculumPricing = this.changeCurriculumPricing.bind(this)
    }

    // Function that changes state boolean to show input box
    displayInput() {
        this.setState({showInput: true})
    }

    // Function that changes state boolean to not show input box
    stopDisplay() {
        this.setState({showInput: false})
    }

    // Function to change curriculum to specified price
    changeCurriculumPricing(event) {
        let tempThis = this
        let newPrice = null
        if (!this.state.newCurriculumPrice.includes("$")) { // Basically checking if the admin changed the price/clicked the textbox
            if (!(this.state.newCurriculumPrice === "")) { // If the changed price is the empty string don't do anything.
                newPrice = "$" +  this.state.newCurriculumPrice
                if (!newPrice.includes(".")) {
                    newPrice += ".00"
                }
            }
        }

        let onSuccess = function(result) {
            alert("Pricing Change Successful.")
            tempThis.props.test()
        }

        let onFailure = function(error) {
            alert("Pricing Change Failed")
        }

        Database.editCurriculum(this.props.curriculumID, onSuccess, onFailure, null, null, null, null, newPrice)
    }

    // For inputting number into input box.
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <div>
                <h4 style={{marginBottom: 0}}> {this.props.curriculumName + " Current Price: " + this.props.curriculumPrice} </h4>
                {this.state.showInput ? null :
                <Button style={{marginTop: "1vw", marginBottom:"1.5vw"}} onClick={this.displayInput}> Change Curriculum Price </Button>}
                {!this.state.showInput ? null :
                    <div>
                        <input
                            min={0}
                            maxLength={10}
                            type = "number"
                            name = "newCurriculumPrice"
                            placeholder = "New Curriculum Price"
                            value = {this.state.newCurriculumPrice}
                            onChange = {this.handleChange.bind(this)} />
                        <GreenButton onClick={this.changeCurriculumPricing.bind(this)}> Submit Changes </GreenButton>
                        <RedButton onClick={this.stopDisplay.bind(this)}> Cancel </RedButton>
                    </div>}
            </div>
        )
    }
}