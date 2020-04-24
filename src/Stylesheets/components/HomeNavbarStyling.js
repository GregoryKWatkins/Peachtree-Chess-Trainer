import styled from "styled-components"

const NavUnorderedList = styled.ul`
    list-style-type: none;
    margin: 0;
    overflow: hidden;
`;

const NavListItem = styled.li`
    height: 100%;
    float: right;
    display: block;
    color: black;
    text-align: right;
    padding: 4vh 4vh;
    text-decoration: none;
    font-size: 2vh;
    font-weight: 600;
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
}