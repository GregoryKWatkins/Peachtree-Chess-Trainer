import styled from "styled-components"

const ModalBG = styled.div`
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    position: fixed;
    background-color: rgba(0,0,0,0.6);
    z-index: 999;
`;

const CoachContainer = styled.form`
    text-align: center;
    width: 40vh;
    padding: 30px;
    padding-top: 0px;
    height: 50vh;
    margin-top: 25vh;
    margin-left: auto;
    margin-right: auto;
    border-radius: 35px;
    background-color: white;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
`;

const DefaultContainer = styled.form`
    text-align: center;
    width: 40vh;
    padding: 30px;
    padding-top: 0px;
    height: 30vh;
    margin-top: 25vh;
    margin-left: auto;
    margin-right: auto;
    border-radius: 35px;
    background-color: white;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
`;

const Forminputs = styled.input`
    width: 15vw;
    height: 3vh;
    border: none;
    font-size: 2.5vh;
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
    width: 16vh;
    height: 3.5vh;
    color: black;
    cursor: pointer;
    font-size: 1vh;
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
    width: 8vw;
    height: 3.5vh;
    color: white;
    cursor: pointer;
    font-size: 2vh;
    margin-top: 2vh;
    fontweight: bold;
    text-align: center;
    border-radius: 25px;
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

const GreenButton = styled.button`
    background-color:#35b858;
    border-radius:23px;
    border:1px solid #18ab29;
    display:inline-block;
    cursor:pointer;
    color:#ffffff;
    font-family:Arial;
    font-size:16px;
    padding:5px 12px;
    text-decoration:none;
    text-shadow:0px 1px 0px #2f6627;
    margin-left: 1vw;
    margin-right: 1vw;

    transition: 0.5s all ease-out;
    &:hover {
        box-shadow: 0 12px 16px 0 rgba(0,0,0,0.1), 0 17px 25px 0 rgba(0,0,0,0.1);
    }
`;

const RedButton = styled.button`
    background-color:#e4685d;
    border-radius:23px;
    border: none;
    display:inline-block;
    cursor:pointer;
    color:#ffffff;
    font-family:Arial;
    font-size:16px;
    padding:5px 12px;
    text-decoration:none;
    text-shadow:0px 1px 0px #2f6627;
    margin-left: 1vw;
    margin-right: 1vw;

    transition: 0.5s all ease-out;
    &:hover {
        box-shadow: 0 12px 16px 0 rgba(0,0,0,0.1), 0 17px 25px 0 rgba(0,0,0,0.1);
    }
`;

export {
    Forminputs,
    CoachContainer,
    DefaultContainer,
    SubButton,
    Button,
    ModalBG,
    GreenButton,
    RedButton
}