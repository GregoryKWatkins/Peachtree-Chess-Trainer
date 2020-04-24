import React from 'react'
import {Link, Redirect} from 'react-router-dom'

import logo from "../img/PTChess_logo.png"
import {NavUnorderedList, NavListItem} from "../Stylesheets/components/HomeNavbarStyling.js"

import Authenticate from "../Authenticate"

class HomeNavbar extends React.Component {
    constructor(props) {
        super()

        this.state = {triggerLogout: false}
        this.handleLogout = this.handleLogout.bind(this)
    }

    /* This function calls the authenticates signout function to log a user out. It
    is currently called in the render method with the Logout button. */
    handleLogout() {
        Authenticate.signout();
        this.setState({triggerLogout: true})
    }

    // Triggered when a user clicks the logo. Currently serves simply to
    // reset the home subwindow to 'courses'
    handleLogoClick(event) {
        this.props.swapSubwindow('courses')
    }

    render() {
        if (this.state.triggerLogout) {
            return (
                <Redirect push to={{ pathname: '/login' }} />
            )
        } else {
            return (
                <nav style={{backgroundColor: "#9dd1f1", height:"11vh"}}>
                    <div>

                        <NavUnorderedList>
                            <img onClick={(event) => this.handleLogoClick(event)} style={{maxWidth: "10vw", maxHeight: "10vh", float:"left", marginLeft: "5vw", cursor:"pointer"}} src={logo} alt="logo"/>

                            <NavListItem onClick={this.handleLogout}>Logout</NavListItem>
                            <Link to="/pricing"><NavListItem>Pricing</NavListItem></Link>
                            {/**<Link to="/about"><NavListItem>About</NavListItem></Link>**/}
                        </NavUnorderedList>
                    </div>
                </nav>
            )
        }
    }
}

export default HomeNavbar