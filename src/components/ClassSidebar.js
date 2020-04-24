import React from 'react'

import {NavUnorderedList, NavListItem, NavListItemSelected} from "../Stylesheets/components/ClassSidebarStyling.js"

export default class ClassSidebar extends React.Component {
    /* Takes in as props:
        - swapSubwindow: function called to change render in parent DistinctCourse
        - currentSubwindow: varibale containing string that is the current subwindow
    */

    // Handles when a sidebar button is clicked. Tells the parent UserHomePage to swap pages
    handleSidebarClick(swapPage, event) {
        this.props.swapSubwindow(swapPage)
    }

    render() {
        let contentModules =
            <div onClick={(event) => this.handleSidebarClick('modules', event)}>
                <div>
                    Modules
                </div>
            </div>

        let contentResources =
            <div onClick={(event) => this.handleSidebarClick('resources', event)}>
                <div>
                    Resources
                </div>
            </div>

        let contentClassSettings =
            <div onClick={(event) => this.handleSidebarClick('classSettings', event)}>
                <div>
                    Class Settings
                </div>
            </div>

        let contentClassScheduler =
            <div onClick={(event) => this.handleSidebarClick('classScheduler', event)}>
                <div>
                    Class Scheduler
                </div>
            </div>

        let contentAnnouncements =
            <div onClick={(event) => this.handleSidebarClick('announcements', event)}>
                <div>
                    Class Announcements
                </div>
            </div>

        return (
            <NavUnorderedList>
                {this.props.currentSubwindow === 'modules'
                    ? <NavListItemSelected>{contentModules}</NavListItemSelected>
                    : <NavListItem>{contentModules}</NavListItem>}

                {this.props.currentSubwindow === 'resources'
                    ? <NavListItemSelected>{contentResources}</NavListItemSelected>
                    : <NavListItem>{contentResources}</NavListItem>}

                {this.props.currentSubwindow === 'classSettings'
                    ? <NavListItemSelected>{contentClassSettings}</NavListItemSelected>
                    : <NavListItem>{contentClassSettings}</NavListItem>}

                {this.props.currentSubwindow === 'classScheduler'
                    ? <NavListItemSelected>{contentClassScheduler}</NavListItemSelected>
                    : <NavListItem>{contentClassScheduler}</NavListItem>}

                {this.props.currentSubwindow === 'announcements'
                    ? <NavListItemSelected>{contentAnnouncements}</NavListItemSelected>
                    : <NavListItem>{contentAnnouncements}</NavListItem>}
            </NavUnorderedList>
        )
    }
}