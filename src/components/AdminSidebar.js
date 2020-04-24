import React from "react"

import {Redirect} from 'react-router-dom'
import styled from "styled-components"

const NavUnorderedList = styled.ul`
    text-align: center;
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 6vw;
    background-color: #f1f1f1;
    height: 100%; /* Full height */
    position: absolute;
    overflow: auto;
`;

const NavListItem = styled.li`
    width: 100%;
    height: 6.5vh;
    padding: 2vh 0px 0px 0px;
    display: block;
    color: black;
    font-size: 1.6vh;
    font-weight: bold;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

    transition: 0.5s all ease-out;
    &:hover {
        cursor: pointer;
        background-color: #1111;
    }
`;

const NavListItemSelected = styled.li`
    background-color: white;
    width: 100%;
    height: 6.5vh;
    padding: 2vh 0px 0px 0px;
    display: block;
    color: black;
    font-size: 1.6vh;
    font-weight: bold;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

    transition: 0.5s all ease-out;
    &:hover {
        cursor: pointer;
        background-color: #1111;
    }
`;

class AdminSidebar extends React.Component {

    constructor(props) {
        //Receives as props:
        // -currPage: describes which page we're on (settings, creator, pricing)
        super(props)

        this.state = {
            redirectPricing: false,
            redirectSettings: false,
            redirectCurrCreator: false
        }

        this.redirectPricing = this.redirectPricing.bind(this)
        this.redirectSettings = this.redirectSettings.bind(this)
        this.redirectCurrCreator = this.redirectCurrCreator.bind(this)
    }

    redirectPricing() {
        this.setState({redirectPricing:true})
    }
    redirectSettings() {
        this.setState({redirectSettings:true})
    }
    redirectCurrCreator() {
        this.setState({redirectCurrCreator:true})
    }


    render() {
        let currPage = this.props.currPage
        // dont do anything if they click to go to the same page we're already on
        if(this.state.redirectPricing && currPage !== 'pricing') {
            return (<Redirect push to={{ pathname: '/admin/pricing_settings' }} />)
        }
        if(this.state.redirectSettings && currPage !== 'settings') {
            return (<Redirect push to={{ pathname: '/admin/settings' }} />)
        }
        if(this.state.redirectCurrCreator && currPage !== 'creator') {
            return (<Redirect push to={{ pathname: '/admin' }} />)
        }

        return (

            <NavUnorderedList>
                {this.props.currPage === 'creator'
                    ? <NavListItemSelected><div type="button" onClick={this.redirectCurrCreator}>Curriculum Creator</div></NavListItemSelected>
                    : <NavListItem><div type="button" onClick={this.redirectCurrCreator}>Curriculum Creator</div></NavListItem>}

                {this.props.currPage === 'pricing'
                    ? <NavListItemSelected><div type="button" onClick={this.redirectPricing}>Pricing Settings</div></NavListItemSelected>
                    : <NavListItem><div type="button" onClick={this.redirectPricing}>Pricing Settings</div></NavListItem>}

                {this.props.currPage === 'settings'
                    ? <NavListItemSelected><div type="button" onClick={this.redirectSettings}> Account Settings</div></NavListItemSelected>
                    : <NavListItem><div type="button" onClick={this.redirectSettings}>Account Settings</div></NavListItem>}
            </NavUnorderedList>
        )
    }

}

export default AdminSidebar