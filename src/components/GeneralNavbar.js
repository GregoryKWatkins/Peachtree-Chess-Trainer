import React from 'react'
import {Link, Redirect} from 'react-router-dom'

import logo from "../img/PTChess_logo.png"
import {NavUnorderedList, NavListItem} from "../Stylesheets/components/GeneralNavbarStyling.js"
import Authenticate from '../Authenticate'

class GeneralNavbar extends React.Component {
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

    render() {
        if (this.state.triggerLogout) {
            return (
                <Redirect push to={{ pathname: '/login' }} />
            )
        } else {
            let welcomeLinkImage = <Link to="/"><img style={{maxWidth: "10vw", maxHeight: "10vh", float:"left", marginLeft: "5vw"}} src={logo} alt="logo"/></Link>

            return (
                <nav style={{backgroundColor: "#9dd1f1", height:"11vh"}}>
                    <div>
                        {/*This image serves as a link back to the welcome page,
                         since there isn't supposed to be a button that does it.
                         Should only appear if not currently on the welcome page*/}
                        <div style={{cursor:"pointer"}}>{this.props.showWelcomeLink === true ? welcomeLinkImage : null}</div>


                        <NavUnorderedList>
                            {Authenticate.getAuthenticated()
                                ? <div> <NavListItem onClick={this.handleLogout}>Logout</NavListItem> </div>
                                : <Link to="/login"><NavListItem>Login</NavListItem></Link>
                            }
                            {Authenticate.getUserType() === 'Admin'
                                ? null
                                : <Link to="/pricing"><NavListItem>Pricing</NavListItem></Link>
                            }
                            {/**<Link to="/about"><NavListItem>About</NavListItem></Link>**/}
                            {Authenticate.getAuthenticated()
                                ? <div> <Link to="/home"><NavListItem>Home</NavListItem></Link> </div>
                                : null
                            }
                        </NavUnorderedList>
                    </div>
                </nav>
            )
        }
    }
}

export default GeneralNavbar