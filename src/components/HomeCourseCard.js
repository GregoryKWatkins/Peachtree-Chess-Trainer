import React from "react"

import Authenticate from "../Authenticate"
import {Redirect} from 'react-router-dom'

//import crossSvg from '../img/remove_circle-24px.svg'
import styled from "styled-components"

import w_pawn from "../img/chesspieces/w_pawn.png"
import w_rook from "../img/chesspieces/w_rook.png"
import w_knight from "../img/chesspieces/w_knight.png"
import w_bishop from "../img/chesspieces/w_bishop.png"
import w_queen from "../img/chesspieces/w_queen.png"
import w_king from "../img/chesspieces/w_king.png"

import b_pawn from "../img/chesspieces/b_pawn.png"
import b_rook from "../img/chesspieces/b_rook.png"
import b_knight from "../img/chesspieces/b_knight.png"
import b_bishop from "../img/chesspieces/b_bishop.png"
import b_queen from "../img/chesspieces/b_queen.png"
import b_king from "../img/chesspieces/b_king.png"


const CourseCard = styled.div`
    float: left;
    margin-left: 5vw;
    margin-bottom: 5vh;
    padding: 2vh 2vh 2vh 2vh;
    width: 25vh;
    height: 25vh;
    font-size: 1.7vh;
    border-radius: 2vh;
    box-shadow: 0 1vh 2vh 0 rgba(0,0,0,0.2), 0 2vh 3vh 0 rgba(0,0,0,.2);

    transition: 0.5s all ease-out;
    &:hover {
        cursor: pointer;
        box-shadow: 0 1vh 2vh 0 rgba(0,0,0,0.35), 0 2vh 3vh 0 rgba(0,0,0,.35);
    }
`;

class HomeCourseCard extends React.Component {

    //Takes in as props:
    // -code: identifies the curriculum/class clicked. Represents the curriculum/class's unique 'code'
    // -isClass: determines if card is for classes (true) or curriculums (false)
    // -cardType: determines type of card, can be
    //     "enabled"   the standard card
    //     "disabled"  the locked card
    //     "purchase"  the card that redirects you to the shop
    // -primaryText: Main bold text for card. Should probably be Class or Curriculum name
    // -secondaryText: secondary text for card. Should probably be Coach name
    // -color: determines the color of the card
    // -piece: determines which piece should show on the card
    // -swapFunc: function that allows the HomeCourseCard to tell its parent to swap to a specific course page.
    // TODO -icon: determines what image should display on the card TODO

    constructor(props) {
        super(props)

        this.state = {
            triggerPricingRedirect: false
        }
    }

    // Either redirects to the course if its a course, or toggles the create/join modal if
    // its a purchase modal
    handleCardClick(event) {
        if (this.props.cardType === 'enabled') {
            // use function passed to us from parent, tells HomeSubCourses whether a class or course was clicked
            // and which one
            this.props.swapFunc(this.props.code, this.props.isClass)
        } else if (this.props.cardType === 'disabled') {
            if (this.props.isClass) {
                if (Authenticate.getUserType() === "Coach") {
                    if (window.confirm("This classroom's subscription has expired. Would you like to go to the pricing page to renew it?")) {
                        this.setState({triggerPricingRedirect: true})
                    }
                } else {
                    alert("This classroom has expired. Please ask your instructor.")
                }
            } else {
                if (window.confirm("You do not yet have access to this curriculum. Would you like to purchase it?")) {
                    this.setState({triggerPricingRedirect: true})
                }
            }
        } else if (this.props.cardType === 'purchase') {
            if (this.props.isClass) {
                // User clicks 'Join/ Purchase Class'
                // cards of type 'purchase' should have a function to trigger the modal from the home page
                this.props.toggleModal()
            } else {
                // User clicks 'Buy Curriculum'
                // Redirect them to pricing page.
                this.setState({triggerPricingRedirect: true})
            }
        }
    }

    render() {
        if (this.state.triggerPricingRedirect) {
            return (<Redirect push to={{ pathname: '/pricing' }} />)
        }

        let cardContent

        let cardPiece;
        if (this.props.cardType === 'enabled') {

            switch(this.props.piece) {
                case "b_bishop":
                    cardPiece = b_bishop
                    break;
                case "b_king":
                    cardPiece = b_king
                    break;
                case "b_knight":
                    cardPiece = b_knight
                    break;
                case "b_pawn":
                    cardPiece = b_pawn
                    break;
                case "b_rook":
                    cardPiece = b_rook
                    break;
                case "b_queen":
                    cardPiece = b_queen
                    break;
                case "w_pawn":
                    cardPiece = w_pawn
                    break;
                case "w_queen":
                    cardPiece = w_queen
                    break;
                case "w_king":
                    cardPiece = w_king
                    break;
                case "w_bishop":
                    cardPiece = w_bishop
                    break;
                case "w_knight":
                    cardPiece = w_knight
                    break;
                case "w_rook":
                    cardPiece = w_rook
                    break;
                default:
                    cardPiece = this.props.piece
                    break;
            }

            cardContent =
                <div style={{width: "25vh", textAlign: "center"}}>
                    <img src={cardPiece} alt={b_pawn} style={{width: "4vw"}}></img>
                    <h3>{this.props.primaryText}</h3>
                    <p>{this.props.secondaryText}</p>
                </div>
        } else if (this.props.cardType === 'disabled') {
            // only disabled classes should be deletable.
            // Enabled classes should last until they expire and Curriculums last forever

            let cardPiece;
            switch(this.props.piece) {
                case "b_bishop":
                    cardPiece = b_bishop
                    break;
                case "b_king":
                    cardPiece = b_king
                    break;
                case "b_knight":
                    cardPiece = b_knight
                    break;
                case "b_pawn":
                    cardPiece = b_queen
                    break;
                case "b_rook":
                    cardPiece = b_queen
                    break;
                case "b_queen":
                    cardPiece = b_queen
                    break;
                case "w_pawn":
                    cardPiece = w_pawn
                    break;
                case "w_queen":
                    cardPiece = w_queen
                    break;
                case "w_king":
                    cardPiece = w_king
                    break;
                case "w_bishop":
                    cardPiece = w_bishop
                    break;
                case "w_knight":
                    cardPiece = w_knight
                    break;
                case "w_rook":
                    cardPiece = w_rook
                    break;
                default:
                    cardPiece = this.props.piece
                    break;
            }

            cardContent =
                <div style={{width: "25vh", textAlign: "center"}}>
                    {/**{this.props.isClass ?
                        <button onClick={this.handleClassDelete}>
                            <img src={crossSvg} />
                        </button>
                        : null **/}
                    <img src={cardPiece} alt={b_pawn} style={{width: "4vw"}}></img>
                    <h3>{this.props.primaryText}</h3>
                    {this.props.isClass ?
                        <p>Expired Class</p> :
                        <p>Unpurchased Curriculum</p>
                    }
                </div>
        } else if (this.props.cardType === 'purchase') {
            cardContent =
                <div style={{width: "25vh", textAlign: "center", transform: "translateY(60%)"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="5vh" viewBox="0 0 24 24" width="5vw"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                    {this.props.isClass
                        ? (Authenticate.getUserType() === "Coach"
                            ? <p>Join / Purchase Class</p>
                            : <p>Join Class</p>
                          )
                        : <p>Buy Curriculum</p>}
                </div>
        }

        if (this.props.cardType === "disabled") {
            return (
                <CourseCard onClick={(event) => this.handleCardClick(event)}
                    style={{
                    backgroundColor: "#a9a9a9"}}>
                    {cardContent}
                </CourseCard>
            )
        } else {
            return (
                <CourseCard onClick={(event) => this.handleCardClick(event)}
                    style={{
                    backgroundColor: this.props.color}}>
                    {cardContent}
                </CourseCard>
            )
        }
    }
}

export default HomeCourseCard