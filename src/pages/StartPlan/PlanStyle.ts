import styled from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    overflow: hidden;
`;

export const ContentsWrapper = styled.div`
    width: 100%;
    display: flex;             
    flex-direction: column;    
    align-items: center;
    margin-top: 32px;
    height: 650px;
`;
export const NextBtn = styled.button`
    width: 88px;
    height: 45px;
    border: none;
    color: white;
    font-size: 15px;
    border-radius: 8px;
    background-color: #5B00B2;
`

export const EndBtn = styled.button`
    width:129px;
    height: 46px;
    border: none;
    color: white;
    font-size: 15px;
    cursor: pointer;
    border-radius: 8px;
    background-color: #5B00B2;
`
export const PrevBtn = styled.button`
    width: 88px;
    height: 45px;
    border: none;
    color: white;
    font-size: 15px;
    border-radius: 8px;
    background-color: #525252;
`

export const ProgressBar = styled.div`
  width: 320px;
  height: 11px;
  background: #e0e0e0;
  border-radius: 5px;
`;

export const Progress = styled.div`
  width: 25%;
  height: 100%;
  background: #FC49FF;
  border-radius: 5px;
  transition: margin-left 0.5s ease;
`;


