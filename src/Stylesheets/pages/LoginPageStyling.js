import styled from "styled-components"
import bkgrndImg from "../../img/chess.jpg"

const Background =  styled.div`
    width: 100%;
    height: 100vh;
    display: table;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(${bkgrndImg});
`;

const PageConent = styled.div`
    width: 100%;
    height: 100vh;
    display: table;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    color: black;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.65);

`;

const LoginContainer = styled.form`
    width: 20vw;
    padding: 50px;
    height: 40vh;
    margin-top: 10vh;
    margin-left: auto;
    margin-right: auto;
    border-radius: 35px;
    background-color: white;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
`;

const SubButton = styled.input`
    border: none;
    width: 150px;
    height: 3.5vh;
    color: black;
    cursor: pointer;
    font-size: 20px;
    margin-top: 10px;
    fontweight: bold;
    text-align: center;
    border-radius: 25px;
    margin-bottom: 60px;
    text-decoration: none;
    display: inline-block;
    background-color: #9dd1f1;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.08), 0 17px 50px 0 rgba(0,0,0,0.08);

    transition: 0.5s all ease-out;
    &:hover {
        color: white;
        background-color: #0373fc;
        box-shadow: 0 12px 16px 0 rgba(0,0,0,0.2), 0 17px 50px 0 rgba(0,0,0,0.2);
    }
`;

const Forminputs = styled.input`
    width: 100%;
    height: 10%;
    border: none;
    font-size: 18px;
    text-indent: 10px;
    margin-bottom: 10px;
    border-radius: 25px;
    background-color: #c8e0f4;

    transition: 0.5s all ease-out;
    &:hover {
        box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.10), 3px 3px 3px 3px rgba(0,0,0,0.10);
    }
`;

const StyledLink = styled.link`
    style: none;
`;

export {
    SubButton,
    Forminputs,
    Background,
    PageConent,
    StyledLink,
    LoginContainer,
}