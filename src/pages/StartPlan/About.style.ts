import styled from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #f9f9f9;
    overflow: hidden;
`;


export const ContentsWrapper = styled.div`
  width: 100%;
  margin-top: 2rem;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  margin-bottom: 2rem;
  position: relative;
`;

export const Progress = styled.div`
  width: 25%;
  height: 100%;
  background: #1a80e5;
  border-radius: 5px;
  transition: margin-left 0.5s ease;
`;
