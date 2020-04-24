import React from 'react'

import Database from '../Database'
import Authenticate from '../Authenticate'

class ModuleListing extends React.Component {

    // Passed as props:
    // -triggerModuleModal(moduleData): function that opens the module settings modal,
    //      takes the data of the triggering module as a parameter.
    // -moduleData: object containing various details about the contents of the module
    // -accessModule: the method that provides functioning after accessing a module
    // -enabled: a boolean determining whether a user should have access to the module.
    // -progress: the progress array which is used to check how many students completed this module.
    constructor(props) {
        super(props)

        this.handleOptionsClick = this.handleOptionsClick.bind(this)
        this.checkName = this.checkName.bind(this)
    }

    handleOptionsClick(event) {
        this.props.triggerModuleModal(this.props.moduleData)
    }

    checkName(mod) {
        if (mod.module === this.props.moduleData.id) {
            return mod
        }
    }

    changeColor(col) {
        this.setState({color: col})
    }

    render() {

        if (!this.props.isCurriculum) {
            // Unpublished modules should not be shown
            if (!this.props.moduleData.module || !this.props.moduleData.module.published) {
                return null
            }

            // Below is where we will check to see if the user is assigned to this module.
            var allowAccess = true // By default is true
            if (this.props.moduleData.members.length === 0 && Authenticate.getUserType() === "Student") {
                allowAccess = false
            }
            for (let i = 0; i < this.props.moduleData.members.length; i++) {
                // This if is basically checking to see if they are (not) in the members array for the current module
                if (!(Authenticate.getCurrentUser().username === Object.values(this.props.moduleData.members[i])[0])) {
                    // If they are also a student, then they may not access this module.
                    if (Authenticate.getUserType() === "Student") {
                        allowAccess = false
                    }
                } else {
                    // Break out of loop if you are in the members list for this module.
                    allowAccess = true
                    break;
                }
            }

            // Here we get the number of people who have completed the current module
            let numOfCompleted = 0;
            for (let i = 0; i < this.props.progress.length; i++) {
                if ((this.props.progress[i].u_progress.find(element => element.module === this.props.moduleData.id)).completed) {
                    for (let j = 0; j < this.props.moduleData.members.length; j++) {
                        if (this.props.progress[i].username === Object.values(this.props.moduleData.members[j])[0]) {
                            numOfCompleted++
                        }
                    }
                }
            }


            var data = this.props.moduleData
            var releaseDate = Database.getReadableDate(data.openTime)
            var dueDate = Database.getReadableDate(data.closeTime)
            let thisPointer = this
            let prog = null
            if ((this.props.progress !== null) && (Authenticate.getUserType() !== "Coach") && (Authenticate.getUserType() !== "Admin")) {
                prog = this.props.progress.u_progress.find(this.checkName)
            }

            return (
                <div>
                    {(this.props.enabled === true)  && (allowAccess === true) ?
                    <div style={{backgroundColor:"white", height: "6vh", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0", cursor: "pointer"}}>
                        <div onClick={thisPointer.props.accessModule.bind(this, this.props.enabled, true, allowAccess, this.props.moduleData)} style={{width:"92%", height: "6vh", float: "left", marginLeft: "1vw", marginTop: "1vh"}}>
                            <h4 style={{margin:0, fontSize: "1.7vh"}}>
                                {data.curricName + " Module " + data.module.order + ": " + data.module.name}
                            </h4>
                            {releaseDate != null
                                ? <p style={{marginTop: ".5vh", fontSize: "1.3vh", color: "#4C5680", float: "left", marginRight: ".5vh"}}> <strong> Released: </strong> {releaseDate} </p>
                                : null
                            }
                            {dueDate != null
                                ? <p style={{marginTop: ".5vh", fontSize: "1.3vh", color: "#4C5680", float: "left", marginRight: ".5vh"}}> | <strong> Due: </strong> {dueDate}</p>
                                : null
                            }

                            {((this.props.progress !== null) && (Authenticate.getUserType() !== "Coach") && (Authenticate.getUserType() !== "Admin"))
                                ? <p style={{marginTop: ".5vh", fontSize: "1.3vh", color: "#4C5680", float: "left", marginRight: ".5vh"}}> | <strong> Completed: </strong>{prog.completed ? 'Yes' : 'No'} </p>
                                : null
                            }

                            {Authenticate.getUserType() === "Coach"
                                ? <p style={{marginTop: ".5vh", fontSize: "1.3vh", color: "#4C5680", float: "left", marginRight: ".5vh"}}> | <strong> Students Completed: </strong> {numOfCompleted} / {this.props.moduleData.members.length}</p>
                                : null
                            }
                        </div>

                        {Authenticate.getUserType() === "Coach" ?
                            <div style={{marginLeft:"92%", height: "6vh"}} onClick={this.handleOptionsClick}>
                                <svg style={{marginTop:"1.5vh"}} xmlns="http://www.w3.org/2000/svg" width="3vw" height="3vh" viewBox="0 0 34 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
                            </div>
                            : null
                        }
                    </div> :

                    <div style={{backgroundColor:"rgb(228,104,93,.6)", height: "6vh", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0", cursor: "pointer"}}>
                        <div onClick={thisPointer.props.accessModule.bind(this, this.props.enabled, true, allowAccess, this.props.moduleData)} style={{width:"92%", height: "6vh", float: "left", marginLeft: "1vw", marginTop: "1vh"}}>
                            <h4 style={{margin:0, fontSize: "1.7vh"}}>
                                {data.curricName + " Module " + data.module.order + ": " + data.module.name}
                            </h4>
                            {releaseDate != null
                                ? <p style={{marginTop: ".5vh", fontSize: "1.3vh", color: "#4C5680", float: "left", marginRight: ".5vh"}}> <strong> Released: </strong> {releaseDate} </p>
                                : null
                            }
                            {dueDate != null
                                ? <p style={{marginTop: ".5vh", fontSize: "1.3vh", color: "#4C5680", float: "left", marginRight: ".5vh"}}> | <strong> Due: </strong> {dueDate}</p>
                                : null
                            }

                            {((this.props.progress !== null) && (Authenticate.getUserType() !== "Coach") && (Authenticate.getUserType() !== "Admin"))
                                ? <p style={{marginTop: ".5vh", fontSize: "1.3vh", color: "#4C5680", float: "left", marginRight: ".5vh"}}> | <strong> Completed: </strong>{prog.completed ? 'Yes' : 'No'} </p>
                                : null
                            }

                            {Authenticate.getUserType() === "Coach"
                                ? <p style={{marginTop: ".5vh", fontSize: "1.3vh", color: "#4C5680", float: "left", marginRight: ".5vh"}}> | <strong> Students Completed: </strong> {numOfCompleted} / {this.props.moduleData.members.length}</p>
                                : null
                            }
                        </div>

                        {Authenticate.getUserType() === "Coach" ?
                            <div style={{marginLeft:"92%", height: "6vh"}} onClick={this.handleOptionsClick}>
                                <svg style={{marginTop:"1.5vh"}} xmlns="http://www.w3.org/2000/svg" width="3vw" height="3vh" viewBox="0 0 34 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
                            </div>
                            : null
                        }
                    </div>}
                </div>


            )
        } else {
            data = this.props.moduleData
            let thisPointer = this
            let prog = this.props.progress.find(this.checkName)

            return (
                <div>
                     {(this.props.enabled === true) ?
                        <div onClick={thisPointer.props.accessModule.bind(this, this.props.enabled, false, true, this.props.moduleData)} style={{backgroundColor:"white", height: "6vh", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0", cursor: "pointer"}}>
                            <div style={{width:"92%", height: "6vh", float: "left", marginLeft: "1vw", marginTop: "1vh"}}>
                                <h4 style={{margin:0, fontSize: "1.5vh"}}>
                                    {" Module " + data.order + ": " + data.name}
                                </h4>
                                <p style={{marginTop: ".5vh", fontSize: "1.3vh", color: "#4C5680", float: "left", marginRight: ".5vh"}}> <strong> Completed: </strong> {(prog !== null && prog.completed) ? 'Yes' : 'No'} </p>
                            </div>
                        </div> :
                        <div onClick={thisPointer.props.accessModule.bind(this, this.props.enabled, false, true, this.props.moduleData)} style={{backgroundColor:"rgb(228,104,93,.6)", height: "6vh", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0", cursor: "pointer"}}>
                            <div style={{width:"92%", height: "6vh", float: "left", marginLeft: "1vw", marginTop: "1vh"}}>
                                <h4 style={{margin:0, fontSize: "1.5vh"}}>
                                    {" Module " + data.order + ": " + data.name}
                                </h4>
                                <p style={{marginTop: ".5vh", fontSize: "1.3vh", color: "#4C5680", float: "left", marginRight: ".5vh"}}> <strong> Completed: </strong> {(prog !== null && prog.completed) ? 'Yes' : 'No'} </p>
                            </div>
                        </div>}
                </div>

            )
        }
    }

}

export default ModuleListing