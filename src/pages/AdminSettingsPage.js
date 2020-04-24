import React from "react"
import Authenticate from "../Authenticate"
import AdminSidebar from "./../components/AdminSidebar"
import AdminNavbar from '../components/AdminNavbar'

export default class AdminSettingsPage extends React.Component {

    constructor() {
        super()
        this.state = {
            changePassword: false,
            changePasswordBox1: '',
            changePasswordBox2: '',
            previousPassword: ''
        }
        this.handlePassword = this.handlePassword.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
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

    render() {
        return (
            <div>
                <AdminNavbar />
                <AdminSidebar currPage={"settings"}/>
                <div style={{marginLeft:"8.5vw", marginRight: "12.5vw", paddingLeft: "4vw", marginTop: 0, marginBottom:0, paddingTop: "2vh", display: "inline-block"}}>
                    <h1 style={{fontSize: "3vh"}}> Account Settings </h1>
                    <div>
                {/*conditional render based on changePassword value */}
                        {this.state.changePassword &&
                            <form onSubmit={this.handleSubmit}>
                                <input
                                    style={{fontSize:"1.7vh", height: "2vh"}}
                                    type={"password"}
                                    name={"previousPassword"}
                                    value={this.state.previousPassword}
                                    placeholder={"previous password"}
                                    onChange={this.handleChange}
                                />
                                <input
                                    style={{marginLeft:"1vw", fontSize:"1.7vh", height: "2vh"}}
                                    type={"password"}
                                    name={"changePasswordBox1"}
                                    value={this.state.changePasswordBox1}
                                    placeholder={"new password"}
                                    onChange={this.handleChange}
                                />
                                <input
                                    style={{fontSize:"1.7vh", height: "2vh"}}
                                    type={"password"}
                                    name={"changePasswordBox2"}
                                    value={this.state.changePasswordBox2}
                                    placeholder={"re-enter password"}
                                    onChange={this.handleChange}
                                />
                                {this.state.changePasswordBox1 !== this.state.changePasswordBox2
                                    ? "passwords must match"
                                    : <input
                                        style={{
                                            marginLeft:"1vw",
                                            border: "none",
                                            borderRadius: "4vw",
                                            backgroundColor: "#9dd1f1",
                                            height: "3vh",
                                            width: "8vw",
                                            fontSize: "1.7vh",
                                            cursor: "pointer",
                                            boxShadow: "0 12px 16px 0 rgba(0,0,0,0.08), 0 17px 50px 0 rgba(0,0,0,0.08)"}}
                                        type={"submit"}
                                        value={"Submit"}
                                    />
                                }
                            </form>
                        }
                    </div>

                    <button onClick={this.handlePassword}
                        name={"Change Password"}
                        value={"button"}
                        style={{
                            marginLeft: "3vw",
                            border: "none",
                            borderRadius: "4vw",
                            backgroundColor: "#9dd1f1",
                            height: "4vh",
                            width: "8vw",
                            fontSize: "1.5vh",
                            cursor: "pointer",
                            boxShadow: "0 12px 16px 0 rgba(0,0,0,0.08), 0 17px 50px 0 rgba(0,0,0,0.08)",
                            marginTop: "1vh"
                        }}>
                        {this.state.changePassword ? 'Cancel' : 'Change Password'}
                    </button>
                </div>
            </div>
        )
    }
}