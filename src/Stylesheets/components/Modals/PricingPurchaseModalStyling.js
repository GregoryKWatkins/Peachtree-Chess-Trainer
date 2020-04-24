import styled from "styled-components"

const ModalBG = styled.div`
    width: 100%;
    height: 100%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    position: fixed;
    background-color: rgba(0,0,0,0.6);
    z-index: 999;
`;

const CoachContainer = styled.form`
    text-align: center;
    width: 40vh;
    padding: 30px;
    padding-top: 0px;
    height: 100%;
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
    height: 50%;
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

export {
    Forminputs,
    CoachContainer,
    DefaultContainer,
    SubButton,
    Button,
    ModalBG
}