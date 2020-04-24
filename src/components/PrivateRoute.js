import React from "react"
import {Route, Redirect} from 'react-router-dom'
import Authenticate from '../Authenticate'
import AuthBeforeRender from './AuthBeforeRender'

// This component takes in as props:
// -booleans on whether or not to require that a user be of a specific type
//  they should be mutually exclusive (e.g. do not set requireStudent and requireCoach to true)

class PrivateRoute extends React.Component {

    redirectUser(userType) {
        if (userType === "Student") {
            return (<Redirect push to={{ pathname: '/home' }} />)
        } else if (userType === "Coach") {
            return (<Redirect push to={{ pathname: '/home' }} />)
        } else if (userType === "Admin") {
            return (<Redirect push to={{ pathname: '/admin' }} />)
        } else {
            console.log("Error: Unable to redirect null user")
        }
    }

    render() {
        const { component: Component, requireVerify=false, requireStudent=false, requireCoach=false, requireAdmin=false, requireNotAdmin=false, ...rest } = this.props;

        const renderRoute = props => {
            // Determines where to route based on user properties

            //getAuthenticated() will either return true or false
            var authenticated = Authenticate.getAuthenticated()

            //getEmailVerified() will either true or false
            var verified = Authenticate.getEmailVerified()

            //getUserType() will either return a string or null
            var userType = Authenticate.getUserType()

            if (!authenticated) { // redirect me if I'm not logged in
                return (<Redirect to={{ pathname: '/login' }} />)
            }
            if (requireVerify && !verified) {   // redirect me if I'm not verified
                return (<Redirect to={{ pathname: '/verification' }} />)
            }

            // redirect me if I'm the wrong userType
            if ((requireStudent  && !(userType === 'Student')) ||
                (requireCoach    && !(userType === 'Coach'))   ||
                (requireAdmin    && !(userType === 'Admin'))   ||
                (requireNotAdmin &&  (userType ==='Admin'))) {
                return this.redirectUser(userType)
            }
            return <AuthBeforeRender component={this.props.component} {...props} />
        }

        return (
           <Route {...rest} render={renderRoute}/>
        );
    }
}


export default PrivateRoute