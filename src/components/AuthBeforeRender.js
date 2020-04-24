import React from "react"
import Authenticate from "../Authenticate"
import {Redirect} from 'react-router-dom'


class AuthBeforeRender extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            attemptedAuth: false
        }
    }

    async componentDidMount() {
        await Authenticate.authenticate()
        this.setState({attemptedAuth: true})
    }

    render(props) {

        // Show this while we are checking authentication
        if (!this.state.attemptedAuth) {
            return (
                <div>
                    <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading" style={{marginLeft: "40vw", paddingTop: "30vh"}}/>
                </div>
            )
        }

        // we've finished authentication
        // show them the page if it's true, otherwise redirect them
        else {
            if (Authenticate.getAuthenticated()) {
                const {component: Component} = this.props
                return (
                    <Component {...props} />
                )
            } else {
                //TODO do logic based on whether they are unauthenticated due to
                //login (redirect to login) or an invalid user type
                //(redirect to home)
                return (<Redirect to={{ pathname: '/login' }} />)
            }
        }
    }
}

export default AuthBeforeRender