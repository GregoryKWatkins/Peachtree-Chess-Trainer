import React from 'react'
// import {Link} from 'react-router-dom'

import {NavUnorderedList, NavListItem, NavListItemSelected} from "../Stylesheets/components/HomeSidebarStyling.js"

class HomeSidebar extends React.Component {
    // constructor(props) {
    //     super(props)
    // }

    // Handles when a sidebar button is clicked. Tells the parent UserHomePage to swap pages
    handleSidebarClick(swapPage, event) {
        this.props.swapSubwindow(swapPage)
    }

    render() {

        let contentCourses =
            <div onClick={(event) => this.handleSidebarClick('courses', event)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="4vw" height="4vh" viewBox="0 0 24 24"><path opacity=".87" fill="none" d="M0 0h24v24H0V0z"/><path d="M4 14h2c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1zm0 5h2c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1zM4 9h2c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1zm5 5h10c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1zm0 5h10c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1zM8 6v2c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1z"/></svg>
                <div>
                    Courses
                </div>
            </div>

        let contentNotifications =
            <div onClick={(event) => this.handleSidebarClick('notifications', event)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="4vw" height="4vh" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>
                <div>
                    Notifications
                </div>
            </div>

        let contentSettings =
            <div onClick={(event) => this.handleSidebarClick('settings', event)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="4vw" height="4vh" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
                <div>
                    Settings
                </div>
            </div>

        return (
            <NavUnorderedList>

                {this.props.currentSubwindow === 'notifications'
                    ? <NavListItemSelected>{contentNotifications}</NavListItemSelected>
                    : <NavListItem>{contentNotifications}</NavListItem>}

                {this.props.currentSubwindow === 'courses'
                    ? <NavListItemSelected>{contentCourses}</NavListItemSelected>
                    : <NavListItem>{contentCourses}</NavListItem>}

                {this.props.currentSubwindow === 'settings'
                    ? <NavListItemSelected>{contentSettings}</NavListItemSelected>
                    : <NavListItem>{contentSettings}</NavListItem>}
            </NavUnorderedList>
        )
    }
}

export default HomeSidebar