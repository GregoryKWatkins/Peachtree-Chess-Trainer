import styled from "styled-components"

const NavUnorderedList = styled.ul`
    text-align: center;
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 6.5vw;
    background-color: #f1f1f1;
    height: 100%; /* Full height */
    position: absolute;
    overflow: auto;
`;

const NavListItem = styled.li`
    width: 100%;
    padding: 2vh 0px 2vh 0px;
    display: block;
    color: black;
    font-size: 1.5vh;
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
    padding: 2vh 0px 2vh 0px;
    display: block;
    color: black;
    font-size: 1.5vh;
    font-weight: bold;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

    transition: 0.5s all ease-out;
    &:hover {
        cursor: pointer;
        background-color: #1111;
    }
`;

export {
    NavUnorderedList,
    NavListItem,
    NavListItemSelected
}