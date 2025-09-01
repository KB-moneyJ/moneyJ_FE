import styled, { keyframes } from "styled-components";

export const Wrapper = styled.div` 
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const Container = styled.div`
  font-family: Inter;
  font-size: 24px;
  color: white;
  font-weight: bold;
  padding: 20px;
  border-radius: 8px;
  display: flex;
    margin-top: 20px;
  flex-direction: column;
  align-items: center;
    
`;

export const DropdownWrapper = styled.div`
  width: 300px;
    margin-top: 48px;
  font-size: 16px;
    font-weight: normal;
  position: relative;
`;

export const DropdownHeader = styled.div`
  background: #2d0b52;
  color: white;
  padding: 12px 14px;
  border-radius: 10px;
    font-size: 16px;
    font-weight: normal;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  border: 2px solid white;
`;

export const ArrowIcon = styled.span`
  margin-left: auto;
  width: 11px;
  height: 11px;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  transform: ${({ isOpen }) =>
  isOpen ? "rotate(-135deg)" : "rotate(45deg)"};
  transition: transform 0.2s ease;
`;

export const DropdownList = styled.ul`
  margin: 0;
  padding: 10px 0;
  list-style: none;
  background: #3c0d6b;
  border: 2px solid white;
  border-radius: 10px;
  position: absolute;
  width: 100%;
  top: 60px;
  left: 0;
  z-index: 100;

  max-height: 350px;
  overflow-y: auto;

    &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #7a4fc7;
    border-radius: 10px;
  }
`;

export const DropdownItem = styled.li`
  padding: 10px 16px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;

  &:hover {
    background: #5e1ca3;
  }
`;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const RandomSpinner = styled.div`
  position: relative;
  border-top: 3px solid #FC49FF;
  border-bottom: 0;
  border-left: 3px solid #FC49FF;
  border-right: 3px solid transparent;
  animation: ${rotate} 1.5s linear infinite;
  height: 108px;
  width: 108px;
  border-radius: 50%;

  &::before {
    content: '';
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 11.6C20 10.96 19.44 10.4 18.8 10.4H14.4L10.4 4H8.8L10.8 10.4H6.4L5.2 8.8H4L4.8 11.6L4 14.4H5.2L6.4 12.8H10.8L8.8 19.2H10.4L14.4 12.8H18.8C19.44 12.8 20 12.24 20 11.6Z' fill='white'/%3E%3C/svg%3E%0A");
    display: block;
    background-size: 30px;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    z-index: 999;
    top: -38px;
    left: 38px;
    width: 100%;
    height: 100%;
    text-align: center;
    transform: rotate(41deg);
  }
`;

export const Regionbutton = styled.button<{ selected?: boolean }>`
    background-color: ${({ selected }) => (selected ? "#FC49FF" : "transparent")};
    color: ${({ selected }) => (selected ? "white" : "white")};
    cursor: pointer;
    border: 2px solid white;
    min-width: 92px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
    font-size: 15px;
    font-weight: bold;
    transition: background-color 0.2s ease, color 0.2s ease;
`;

export const  InputMessage = styled.div`
  display: flex;
    align-items: flex-end;
    margin-top: 58px;
    width: 250px;

`
export const BigM  = styled.div`
  font-size: 15px;
    color: white;
    font-weight: normal;
    display: flex;
    span{
        width: 10px;
    }
`
export const SmallM  = styled.div`
  font-size: 11px;
    color: #bebebe;
`
export const EtcInput = styled.input`
    border-radius: 8px;
    padding: 10px;  
    border: 2px solid #FC49FF;
    margin-top: 8px;
    width: 250px;
    background-color: transparent;
`