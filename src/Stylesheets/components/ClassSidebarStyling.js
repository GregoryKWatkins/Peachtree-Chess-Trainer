import styled from "styled-components"

const NavUnorderedList = styled.ul`
    text-align: left;
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 12vw;
    height: 80%;
    position: absolute;
    overflow: auto;
`;

const NavListItem = styled.li`
    background-color: white;
    width: 100%;
    margin-bottom: 2vh;
    padding: 1vh 0px 1vh 1vw;
    display: block;
    color: black;
    font-size: 1.8vh;
    font-weight: bold;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    box-sizing: border-box;
    border-radius: .5vw;

    transition: 0.5s all ease-out;
    &:hover {
        cursor: pointer;
        background-color: #1111;
    }
`;

const NavListItemSelected = styled.li`
    background-color: #00a2e5;
    width: 100%;
    padding: 1vh 0px 1vh 1vw;
    margin-bottom: 2vh;
    border: solid;
    display: block;
    color: white;
    border-radius: .5vw;
    box-sizing: border-box;
    font-size: 1.8vh;
    font-weight: bold;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

    transition: 0.5s all ease-out;
    &:hover {
        cursor: pointer;
        background-color: #1464f6;
    }
`;

export {
    NavUnorderedList,
    NavListItem,
    NavListItemSelected
}