import React from "react"
import Authenticate from '../Authenticate'

import {Button} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"

class HomeSubSettings extends React.Component {
    constructor() {
        super()
        this.state = {
            changePassword: false,
            changePasswordBox1: '',
            changePasswordBox2: '',
            previousPassword: '',
            attributeList: [],
            pastAttributeList: [],
            finishedQuery: false
        }
        this.handlePassword = this.handlePassword.bind(this)
        this.updateAttributeList = this.updateAttributeList.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.confirmChange.bind(this)
        this.revertChange.bind(this)
        this.listAttributes = this.listAttributes.bind(this)
    }

    async componentDidMount() {
        var thisPointer = this
        var onSuccess = function(result) {
            var username = {Name: 'username', Value: result.Username}
            var attributes = result.UserAttributes
            var newAttributeList = [username]
            for (var i = attributes.length - 1; i >= 2; i--) {
                newAttributeList.push(attributes[i])
            }
            //saves original state of attributeList to revert changes
            var oldAttributeList = newAttributeList.map((item) => item)
            thisPointer.setState({username: username, attributeList: newAttributeList, pastAttributeList: oldAttributeList, finishedQuery: true})
        }
            var onFailure = function(error) {
            alert(error.message)
        }
        await Authenticate.getUserAttributes(onSuccess, onFailure)
    }


    /*
    * password update
    * newPassword is new password
    * previousPassword is old password
    */
    handleSubmit(event) {
        event.preventDefault();

        var newPassword = this.state.changePasswordBox1;
        var previousPassword = this.state.previousPassword;

        var thisTemp = this;

        var onSuccess = function(result) {
            alert(result)
            thisTemp.handlePassword()
        }
        var onFailure = function(error) {
            alert(error.message)
        }

        Authenticate.changePassword(previousPassword, newPassword, onSuccess, onFailure);
    }

    //update state or text box fields
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    //updates the local attributeLists
    updateAttributeList(name, index, event) {
        let list = this.state.attributeList
        let item = {Name: name, Value: event.target.value}
        list[index] = item
        this.setState({
            [event.target.id]: event.target.value,
            attributeList: list
        });
    }

    /*
    * opens or closes edit password boxes
    */
    handlePassword(event) {
        this.setState({
            changePassword: !this.state.changePassword,
            changePasswordBox1: '',
            changePasswordBox2: '',
            previousPassword: ''
        });
    }

    /*
    * Name is the Name of the edited element in the attribute list
    * Value is the new Value of the edited element in attribute list
    */
    confirmChange(index, event) {
        event.preventDefault()
        let pointer = this.state.attributeList[index]
        let Name = pointer.Name;
        let displayName = Name.replace("custom:","")
        let Value = pointer.Value;
        if (!this.confirmChangeHelper(Name, Value)) {
        } else if (window.confirm('Are you sure you want to change '+ displayName +' to '+ Value +'?')) {
            var onSuccess = function(result) {
                alert("Success: " + displayName + ' is now set to ' + Value + ".")
            }
            var onFailure = function(error) {
                alert(error.message)
            }

            var attributeList = {};
            attributeList[Name] = Value;

            Authenticate.changeAttributes(attributeList, onSuccess, onFailure);
        }

    }

    confirmChangeHelper(Name, Value) {
        if (Name === 'custom:age' && ((!Number.isInteger(+Value)) || Value > 200 || Value < 0 || Value.includes("."))) {
            alert("Error: " + Value + " is an invalid age. Age must be between 0 and 200.")
            return false
        }
        if (Name === 'custom:rank' && ((!Number.isInteger(+Value)) || Value > 10000 || Value < 0 || Value.includes("."))) {
            alert("Error: " + Value + " is an invalid rank")
            return false
        }
        return true
    }

    //undo local user attribute changes
    revertChange(index) {
        let list = this.state.attributeList
        let item = this.state.pastAttributeList[index]
        list[index] = item
        this.setState({
            attributeList: list
        })
    }

    listAttributes(list) {
        //const attributes = Object.values(list)
        var attributeList = list.map(
            (Name, Value) => {
                var attributeName = Name.Name
                var attributeValue = Name.Value
                var editable = false
                //var edit = false
                const index = attributeName.indexOf(':') + 1
                if (index !== 0) {
                    editable = true
                    attributeName = attributeName.substring(index)
                }
                attributeName = attributeName.charAt(0).toUpperCase() + attributeName.slice(1)

                return (
                    <li key={Value} style={{}}>
                        <div style={{fontWeight: "bold", paddingBottom: "2vh", paddingTop: "2vh", borderBottomStyle: "none"}}>
                    {/*conditional render based on if attribute is editable in database*/}
                            <p style={{fontWeight:"normal"}}> {attributeName}: {!editable ?
                                attributeValue :

                                <form onSubmit={(event) => this.confirmChange(Value, event)}>
                                    <input
                                        maxLength={30}
                                        type={"number"}
                                        name={attributeName}
                                        value={attributeValue}
                                        onChange={(event) => this.updateAttributeList(Name.Name, Value, event)}>
                                    </input>
                                    <input
                                        type={"submit"}
                                        value={"change " + attributeName}
                                        style={{
                                            backgroundColor:'#35b858',
                                            borderRadius:"23px",
                                            border:"1px solid #18ab29",
                                            display:"inline-block",
                                            cursor:"pointer",
                                            color:"#ffffff",
                                            fontFamily:"Arial",
                                            fontSize:"16px",
                                            padding:"5px 12px",
                                            textDecoration:"none",
                                            textShadow:"0px 1px 0px #2f6627",
                                            marginLeft: "1vw",
                                            marginRight: "1vw"}}>
                                    </input>
                                    <button onClick={() => this.revertChange(Value)}
                                        type={"button"}
                                        style={{
                                            backgroundColor:'#35b858',
                                            borderRadius:"23px",
                                            border:"1px solid #18ab29",
                                            display:"inline-block",
                                            cursor:"pointer",
                                            color:"#ffffff",
                                            fontFamily:"Arial",
                                            fontSize:"16px",
                                            padding:"5px 12px",
                                            textDecoration:"none",
                                            textShadow:"0px 1px 0px #2f6627",
                                            marginLeft: "1vw",
                                            marginRight: "1vw"}}>
                                        undo changes
                                    </button>
                                </form>
                            } </p>
                        </div>
                    </li>
                )
            })
        return attributeList
    }

    render() {
        return (
            <div>
                <h1 style={{fontSize: "3vh"}}> Account </h1>
                <ul style={{listStyle: "none", fontSize: "1.7vh"}}>
                    {this.listAttributes(this.state.attributeList)}
                </ul>
                <div>
            {/*conditional render based on changePassword value */}
                    {this.state.changePassword &&
                        <form onSubmit={this.handleSubmit}>
                            <input
                                style={{width:"10%", backgroundColor:"white", height: "2vh", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0", paddingLeft:".5vw"}}
                                type={"password"}
                                name={"previousPassword"}
                                value={this.state.previousPassword}
                                placeholder={"Previous Password"}
                                onChange={this.handleChange}
                            />
                            <input
                                style={{width:"10%", backgroundColor:"white", height: "2vh", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0", marginLeft:"2vw", paddingLeft:".5vw"}}
                                type={"password"}
                                name={"changePasswordBox1"}
                                value={this.state.changePasswordBox1}
                                placeholder={"New Password"}
                                onChange={this.handleChange}
                            />
                            <input
                                style={{width:"10%", backgroundColor:"white", height: "2vh", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0", marginLeft:"1vw", paddingLeft:".5vw"}}
                                type={"password"}
                                name={"changePasswordBox2"}
                                value={this.state.changePasswordBox2}
                                placeholder={"Re-enter Password"}
                                onChange={this.handleChange}
                            />
                            {this.state.changePasswordBox1 !== this.state.changePasswordBox2
                                ? "passwords must match"
                                : <input
                                    style={{
                                        backgroundColor:'#35b858',
                                        borderRadius:"23px",
                                        border:"1px solid #18ab29",
                                        display:"inline-block",
                                        cursor:"pointer",
                                        color:"#ffffff",
                                        fontFamily:"Arial",
                                        fontSize:"16px",
                                        padding:"5px 12px",
                                        textDecoration:"none",
                                        textShadow:"0px 1px 0px #2f6627",
                                        marginLeft: "1vw",
                                        marginRight: "1vw"}}
                                    type={"submit"}
                                    value={"Submit"}
                                />
                            }
                        </form>
                    }
                </div>

                {!this.state.finishedQuery ? <text><img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading"/> </text> :
                    <Button  style={{marginTop: "1vh"}} onClick={this.handlePassword}
                        name={"Change Password"}
                        value={"button"}>
                        {this.state.changePassword ? 'Cancel' : 'Change Password'}
                    </Button>
                }
            </div>
        )
    }
}

export default HomeSubSettings