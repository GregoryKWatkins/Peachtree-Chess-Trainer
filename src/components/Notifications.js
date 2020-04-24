import React from "react"
import Database from '../Database'

export default class Notifications extends React.Component {

    constructor() {
        super()
        this.state = {
            finishedQuery: false,
            announcements: null
        }

        this.getNotifications()
    }

    getNotifications() {
        var tempThis = this

        var onSuccess = function(result) {
            tempThis.setState({finishedQuery: true,
                               announcements: result})
        }
        var onFailure = function(error) {
            tempThis.setState({finishedQuery: true})
            console.log("Error: " + error)
        }

        Database.getUserNotifications(onSuccess, onFailure)
    }

    displayAnnouncements() {
        if (this.state.announcements === null) {
            return (
                <div>
                    No Notifications to Display
                </div>
            )
        }

        let allAnnouncements = this.state.announcements.Data // Array of all returned notifications

        let list = []

        for (let i = 0; i < allAnnouncements.length; i++) {
            list.push(
                <div style={{border:"solid", marginBottom:"1vh", padding:"1vw", width: "50vw", borderRadius: 15, borderWidth: .5}}>
                    <h3 style={{marginTop: 0}}> Posted by: {allAnnouncements[i].postedUser} on {Database.getReadableDate(allAnnouncements[i].postedTime)} </h3>
                    <p><strong> Message: </strong> {allAnnouncements[i].messageContent}</p>
                </div>
            )
        }

        if (list.length === 0) {
            list.push(
                <div>
                    <h2> No notifications to view currently </h2>
                </div>
            )
        }

        return list
    }

    render() {
        if (!this.state.finishedQuery) {
            return <div> <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading"/>  </div>
        } else {
            return (
                <div>
                    <h1> Notifications </h1>
                    <p>This page shows the last 20 notifications from all your classes:</p>
                    {this.displayAnnouncements()}
                </div>
            )
        }
    }
}