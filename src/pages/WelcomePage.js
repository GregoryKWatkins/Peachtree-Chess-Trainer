import React from 'react'
import {Link} from 'react-router-dom'

import GeneralNavbar from '../components/GeneralNavbar'
import {Button, Background, PageContent, Body, Welcome, ButtonDiv, Paragraph} from "../Stylesheets/pages/WelcomePageStyling.js"
import Authenticate from '../Authenticate'

import logo from "../img/PTChess_logo.png"


class WelcomePage extends React.Component {

    render() {
        return (
            <Background>
                <PageContent>
                    <GeneralNavbar showWelcomeLink={false}/>
                    <Body>
                        <Welcome>Welcome!</Welcome>
                        <Paragraph>Stop getting checkmated. Sign up today!</Paragraph>
                        <img style={{width: '40%'}} src={logo} alt="logo"/>
                        <ButtonDiv>
                            <div>
                                {Authenticate.getAuthenticated()
                                    ? <Link to="/home"><Button>Home</Button></Link>
                                    : <Link to="/login"><Button>Log In</Button></Link>
                                }
                            </div>
                            <div>
                                <Link to="/register"><Button>Create Account</Button></Link>
                            </div>
                        </ButtonDiv>
                    </Body>
                </PageContent>
            </Background>
        )
    }
}

export default WelcomePage