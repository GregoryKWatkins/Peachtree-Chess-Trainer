import styled from "styled-components"
import bkgrndImg from "../../img/chess.jpg"

const Button = styled.button`
    border: none;
    color: white;
    width: 400px;
    height: 60px;
    cursor: pointer;
    font-size: 40px;
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
    border-radius: 25px;
    text-decoration: none;
    display: inline-block;
    background-color: #9dd1f1;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);

    transition: 0.5s all ease-out;
    &:hover {
        color: white;
        background-color: #0373fc;
    }
`;

const ButtonDiv = styled.div`
    top: 45%;
    left: 50%;
    float: right;
    position: absolute;
`;

const Background = styled.header`
    height: 100vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(${bkgrndImg});
`;

const PageContent = styled.div`
    width: 100%;
    height: 100%;
    color: black;
    background-color: rgba(255, 255, 255, 0.60);
`;

const Body = styled.div`
    margin-left: 300px;
    margin-right: 300px;
`;

const Welcome = styled.h1`
    font-size: 70px;
    margin-top: 1px;
    margin-bottom: 1px;
    text-align: center;
    font-weight: 700px;
`;

const Paragraph = styled.p`
    font-size: 38px;
    margin-top: 10px;
    text-align: center;
    font-weight: 700px;
    margin-bottom: 60px;
`;

export {
    Body,
    Button,
    Welcome,
    Paragraph,
    ButtonDiv,
    Background,
    PageContent
}