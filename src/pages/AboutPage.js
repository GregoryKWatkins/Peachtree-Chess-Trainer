import React from "react"
// import styled from "styled-components"
import {Background, PageConent} from "../Stylesheets/pages/AboutPageStyling.js"

// import stockImage from "../img/chessboy.jpg"
// import owner1 from "../img/owner1.jpg"
// import owner2 from "../img/owner2.jpg"
// import bg from "../img/about_bg.jpg"

import GeneralNavbar from '../components/GeneralNavbar'

// const ButtonStyle = styled.div`
//     background-color: white;
//     text-align: center;
//     margin-left: 25vw;
//     margin-bottom: 5vh;
//     padding: 2vh 2vh 2vh 2vh;
//     width: 50vw;
//     height: 75vh;

//     font-size: 1.7vh;
//     border-radius: 2vh;
//     box-shadow: 0 1vh 2vh 0 rgba(0,0,0,0.2), 0 2vh 3vh 0 rgba(0,0,0,.2);

//     transition: 0.5s all ease-out;
//     &:hover {
//         box-shadow: 0 1vh 2vh 0 rgba(0,0,0,0.35), 0 2vh 3vh 0 rgba(0,0,0,.35);
//     }
// `;

class AboutPage extends React.Component {
    render() {
        return (
            <Background>
                <PageConent>
                    <GeneralNavbar showWelcomeLink={true}/>

                    {/**<ButtonStyle>
                        <h1 style={{fontSize: "1.5em", marginTop: 0}}> About Page </h1>
                        <img src = {stockImage} alt= "Boy and Chess" style={{maxWidth: "35vw", maxHeight: "35vh", marginLeft: "-1vw"}}/>
                        <img src = {owner1} alt= "Justin" style={{maxWidth: "35vw", maxHeight: "35vh", marginLeft: "-1vw"}}/>
                        <img src = {owner2} alt= "Margaret" style={{maxWidth: "35vw", maxHeight: "35vh", marginLeft: "-1vw"}}/>
                        <img src = {bg} alt= "coolImage" style={{maxWidth: "35vw", maxHeight: "35vh", marginLeft: "-1vw"}}/>
                    </ButtonStyle>**/}

                </PageConent>
            </Background>
        )
    }
}

export default AboutPage