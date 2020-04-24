import React from "react"
import Database from "../Database"
import AdminSidebar from "./../components/AdminSidebar"
import AdminNavbar from '../components/AdminNavbar'
import PricingListing from '../components/PricingListing.js'

import {Button} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"

export default class AdminPricingPage extends React.Component {
    /* Need to be able to:
        * Update paypal key
        * Change pricing of
        - Buying a curriculum (Have to list all curriculums)
        - Buying a class
        - Renewing a class
        - Expanding a class
    */
    constructor(props){
        super(props)

        this.state = {
            newPayPalKey: "",
            newClassPrice: "",
            newRenewPrice: "",
            newExpandPrice: "",
            oldClassPrice: "",
            oldRenewPrice: "",
            oldExpandPrice: "",
            gotClassPricing: false,
            gotCurriculumPricing: false,
            currics: []
        }

        this.handleChange = this.handleChange.bind(this)
        this.changeClassPricing = this.changeClassPricing.bind(this)
        this.curriculumQuery = this.curriculumQuery.bind(this)
        this.classQuery = this.classQuery.bind(this)

        this.curriculumQuery()
        this.classQuery()
    }

    // Database query for curriculum data in order to show current prices of each.
    curriculumQuery() {
        if (this.state.gotCurriculumPricing) {
            this.setState({gotCurriculumPricing: false, currics: []})
        }
        let tempThis = this
        let onSuccess = function(result) {
            for (let i = 0; i < result.Data.length; i++) {
                let name = result.Data[i].name
                let price = result.Data[i].price
                let id = result.Data[i].id
                tempThis.state.currics.push(
                    <PricingListing
                        key={i}
                        curriculumName={name}
                        curriculumPrice={price}
                        curriculumID={id}
                        test={tempThis.curriculumQuery.bind(this)}>
                    </PricingListing>
                )
            }

            if (tempThis.state.currics.length === 0) {
                tempThis.state.currics.push(
                    <div key={0}>
                        No curriculums
                    </div>
                )
            }

            tempThis.setState({gotCurriculumPricing: true})
        }

        let onFailure = function(error) {
            console.log("Error: " + error)
        }

        Database.getAllCurriculums(onSuccess, onFailure)
    }

    // Database query for class data in order to show current prices for them.
    classQuery() {
        if (this.state.gotCurriculumPricing) {
            this.setState({gotClassPricing: false})
        }
        let tempThis = this

        let onSuccess = function(result) {
            let renewPrice;
            let newPrice;
            let expandPrice;
            for (let i = 0; i < result.length; i++) {
                if (result[i].option === "class_renew") {
                    renewPrice = result[i].price;
                }
                if (result[i].option === "class_new") {
                    newPrice = result[i].price;
                }
                if (result[i].option === "expand_class") {
                    expandPrice = result[i].price;
                }
            }

            tempThis.setState({gotClassPricing: true,
                newClassPrice: newPrice,
                newRenewPrice: renewPrice,
                newExpandPrice: expandPrice,
                oldClassPrice: newPrice,
                oldRenewPrice: renewPrice,
                oldExpandPrice: expandPrice})
        }

        let onFailure = function(error) {
            console.log("Error: " + error)
        }

        Database.getPricingInfo(onSuccess, onFailure)
    }

    /* Function to change class prices (renew/expand/buy) to specified prices.
    The values are assumed to be null if input is empty and current price is kept.*/
    changeClassPricing(event) {
        let tempThis = this

        let renewPrice = null
        if (!this.state.newRenewPrice.includes("$")) { // Basically checking if the admin changed the price/clicked the textbox
            if (!(this.state.newRenewPrice === "")) { // If the changed price is the empty string don't do anything.
                renewPrice = "$" +  this.state.newRenewPrice
                if (!this.state.oldRenewPrice.includes(".")) {
                    renewPrice += ".00"
                }
            }
        }

        let classPrice = null
        if (!this.state.newClassPrice.includes("$")) {
            if (!(this.state.newClassPrice === "")) {
                classPrice = "$" +  this.state.newClassPrice
                if (!this.state.oldClassPrice.includes(".")) {
                    classPrice += ".00"
                }
            }
        }

        let expandPrice = null
        if (!this.state.newExpandPrice.includes("$")) {
            if (!(this.state.newExpandPrice === "")) {
                expandPrice = "$" +  this.state.newExpandPrice
                if (!this.state.oldExpandPrice.includes(".")) {
                    expandPrice += ".00"
                }
            }
        }

        let onSuccess = function(result) {
            //console.log(result)
            alert("Pricing Change Successful.")
            tempThis.classQuery()
        }

        let onFailure = function(error) {
            alert("Pricing Change Failed")
            //console.log("Error: " + error)
        }

        Database.editPricingOptions(onSuccess, onFailure, renewPrice, classPrice, expandPrice)
    }

    updateKey(event) {
        let onSuccess = function(result) {
            //console.log(result)
            alert("Key Changed Successfully.")
        }

        let onFailure = function(error) {
            alert("Key Change Failed")
            //console.log("Error: " + error)
        }

        Database.updatePaypalKey(this.state.newPayPalKey, onSuccess, onFailure)
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        if (!this.state.gotClassPricing || !this.state.gotCurriculumPricing) {
            return(
                <div>
                    <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading" style={{marginLeft: "40vw", paddingTop: "30vh"}}/>
                </div>
            )
        } else {
            return (
                <div>
                    <AdminNavbar />
                    <AdminSidebar currPage={"pricing"}/>
                    <div style={{marginLeft:"8.5vw", marginRight: "12.5vw", paddingLeft: "4vw", marginTop: 0, marginBottom:0, paddingTop: "2vh", display: "inline-block"}}>

                        <div style={{textAlign:"center", marginBottom: "2vw"}}>
                            <h1>Pricing Settings</h1>
                        </div>

                        <div style={{float: "left", width: "40vw", overflow: "hidden"}}>
                            <div>
                                <h2 style={{marginTop:0}}> Curriculums: </h2>
                                {this.state.currics}
                            </div>
                        </div>


                        <div style={{marginLeft: "40vw"}}>
                            <div>
                                <h2 style={{marginTop: 0}}> Class Pricing: </h2>
                                <i> Note: Any field may be left blank if you don't wish to change
                                the pricing of it. </i>
                            </div>

                            <div style={{marginBottom:"1vh", marginTop:"2vh"}}>
                                <strong>New Class Price</strong>
                                <input
                                style={{marginLeft: "1vw", resize: "none", paddingLeft:".5vw", width:"30%", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                                min={0}
                                maxLength={10}
                                type = "number"
                                name = "newClassPrice"
                                placeholder = {"Current Price: " + this.state.oldClassPrice}
                                value = {this.newClassPrice}
                                onChange = {this.handleChange} />
                            </div>

                            <div style={{marginBottom:"1vh"}}>
                                <strong>New Renew Price</strong>
                                <input
                                style={{marginLeft: "1vw", resize: "none", paddingLeft:".5vw", width:"30%", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                                min={0}
                                maxLength={10}
                                type = "number"
                                name = "newRenewPrice"
                                placeholder = {"Current Price: " + this.state.oldRenewPrice}
                                value = {this.newRenewPrice}
                                onChange = {this.handleChange} />
                            </div>

                            <div style={{marginBottom:"1vh"}}>
                                <strong>New Expand Class Price</strong>
                                <input
                                style={{marginLeft: "1vw", resize: "none", paddingLeft:".5vw", width:"30%", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                                min={0}
                                maxLength={10}
                                type = "number"
                                name = "newExpandPrice"
                                placeholder = {"Current Price: " + this.state.oldExpandPrice}
                                value = {this.newExpandPrice}
                                onChange = {this.handleChange} />
                            </div>

                            <Button onClick={this.changeClassPricing}> Change Class Pricing </Button>

                            <div style={{marginTop:"6vh"}}>
                                <h3> PayPal Key: </h3>
                            </div>

                            <div>
                                <input
                                style={{resize: "none", paddingLeft:".5vw", width:"30%", backgroundColor:"white", height: "100%", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0"}}
                                type = "text"
                                name = "newPayPalKey"
                                placeholder = "New PayPal Key"
                                onChange = {this.handleChange} />

                                <Button style={{marginLeft: "1vw"}} onClick={this.updateKey}> Change PayPal Key </Button>
                            </div>
                        </div>

                    </div>
                </div>
            )
        }
    }
}