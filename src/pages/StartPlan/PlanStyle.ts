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
    margin-top: 120px;
    height: 650px;
`;


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


