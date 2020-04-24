import styled from "styled-components"
import bkgrndImg from "../../img/chess.jpg"

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
    text-align: center;
    background-color: rgba(255, 255, 255, 0.60);
`;

const Body = styled.div`
    margin-left: 300px;
    margin-right: 300px;
`;

const VerifyContainer = styled.form`
    top: 30%;
    left: 35%;
    width: 350px;
    padding: 50px;
    height: 150px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    position: absolute;
    border-radius: 35px;
    background-color: white;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
`;

const Forminputs = styled.input`
    width: 100%;
    height: 30%;
    border: none;
    font-size: 25px;
    text-indent: 10px;
    margin-top: 15px;
    border-radius: 25px;
    background-color: #c8e0f4;
    
    transition: 0.5s all ease-out;
    &:hover {
        box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.10), 3px 3px 3px 3px rgba(0,0,0,0.10);
    }
`;

const SubButton = styled.input`
    border: none;
    width: 150px;
    height: 30px;
    color: black;
    cursor: pointer;
    font-size: 20px;
    margin-top: 20px;
    fontweight: bold;
    text-align: center;
    border-radius: 25px;
    margin-bottom: 40px;
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

const Button = styled.button`
    border: none;
    width: 150px;
    height: 30px;
    color: black;
    cursor: pointer;
    font-size: 20px;
    margin-top: 20px;
    fontweight: bold;
    text-align: center;
    border-radius: 25px;
    margin-bottom: 40px;
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

export {
    Body,
    Background,
    PageContent,
    Forminputs,
    VerifyContainer,
    SubButton,
    Button
}