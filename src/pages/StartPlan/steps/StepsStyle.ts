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

export const Container2 = styled.div`
  font-family: Inter;
  font-size: 24px;
    width: 320px;
  color: white;
  font-weight: bold;
  padding: 20px;
  border-radius: 8px;
  display: flex;
    margin-top: 20px;
  flex-direction: column;
  align-items: center;
    max-height: 400px;
    overflow-y: auto;   
    overflow-x: hidden;
    &::-webkit-scrollbar {
        width: 6px;      /* 스크롤바 두께 */
        display: none;
    }

    &::-webkit-scrollbar-track {
        background: transparent; /* 트랙 배경 */
    }

    &::-webkit-scrollbar-thumb {
        background: #ffd94a;  /* 스크롤바 색상 */
        border-radius: 10px;  /* 둥글게 */
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #ff7bfa;  /* hover 시 색상 */
    }

`;


export const Container3 = styled.div`
  font-family: Inter;
  font-size: 24px;
  color: white;
  font-weight: bold;
    width: 90%;
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
    justify-content: space-between;
  cursor: pointer;
  user-select: none;
  border: 2px solid white;
`;

export const ArrowIcon = styled.span<{ $isOpen: boolean }>`
    margin-left: auto;
    width: 11px;
    height: 11px;
    border-right: 2px solid white;
    border-bottom: 2px solid white;
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(-135deg)" : "rotate(45deg)")};
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
    color: white;
    font-size: 16px;
    background-color: transparent;
`
export const InputRow = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 50px;
  gap: 6px;
    font-weight: normal;
    justify-content: center;
`;

export const InputRow2 = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 24px;
  gap: 6px;
    
`;

interface DateInputProps {
  placeholder?: string;
}

export const DateInput = styled.input.attrs<DateInputProps>((props) => ({
  placeholder: props.placeholder,
}))<DateInputProps>`
    width: ${({ placeholder }) => {
        const length = placeholder ? placeholder.length : 2;
        return `${Math.max(42, length * 14)}px`;
    }};
    max-width: 80px;
    height: 40px;
    border: 2px solid white;
    border-radius: 10px;
    background-color: transparent;
    color: white;
    font-size: 16px;
    text-align: center;
    outline: none;
    margin-left: 4px;

    &::placeholder {
        color: #888;
    }
`;


export const LabelText = styled.span`
  font-size: 16px;
  color: white;
    margin-right: 4px;

`;

export const RangeWrapper = styled.div`
  margin-top: 70px;
  color: white;
  display: flex;
    font-weight: normal;
    font-size: 16px;
  flex-direction: column;
  align-items: center;
`;

export const CounterBox = styled.div`
  display: flex;
  align-items: center;
    justify-content: space-between;
  border: 2px solid white;
  border-radius: 5px;
  overflow: hidden;
    width: 298px;
    height: 43px;
    margin-top: 34px;
`;
export const IndicatorButton = styled.button`
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none; 
    border-right: 2px solid white; 
    background: transparent;
    color: white;
    cursor: pointer;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

export const IndicatorButton2 = styled.button`
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none; 
    border-left: 2px solid white; 
    background: transparent;
    color: white;
    cursor: pointer;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;
export const InputContainer = styled.div`
    max-height: 160px;
    width: 320px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* ✅ 항상 위에서부터 정렬 */
    align-items: center; /* 중앙 정렬 원하면 유지 */
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.38);
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #ff7bfa;
    }
`;

export const Count = styled.div`
  min-width: 80px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

export const InputWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 300px;
    margin-bottom: 10px;
`

export const IdInput = styled.input`
  width: 298px;
    height: 43px;
  border: 2px solid white;
  border-radius: 5px;
  background-color: transparent;
  color: white;
  font-size: 16px;
  text-align: center;
  outline: none;
  margin-bottom: 5px;

  &::placeholder {
    color: #888;
  }
`;

export const AddButton = styled.button`
    width: 304px;
    height: 45px;
    border: none;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.22);
    color: white;
    font-size: 20px;
    cursor: pointer;

    bottom: 0;

    flex-shrink: 0;    
    align-self: center;
`;
export const DateDisplay = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    margin-top: 20px;
    margin-bottom: 12px;
    color: white;
    font-weight: 600;

    .label {
        display: block;
        font-size: 0.85rem;
        opacity: 0.8;
        text-align: center;
    }

    .date {
        display: block;
        margin-top: 2px;
        font-size: 1.05rem;
        font-weight: 700;
        text-align: center;
    }

    .arrow {
        font-size: 1.2rem;
        opacity: 0.7;
    }
`;

export const GlassCalendar = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    /* ✅ react-date-range 기본 상단 네모(날짜입력) 제거 */
    .rdrDateDisplayWrapper {
        display: none !important;
    }

    /* ✅ 달력 전체 래퍼 */
    .rdrCalendarWrapper {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        width: 100% !important;
        margin: 0 auto !important;

        background: rgba(255, 255, 255, 0.18);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.5),
        inset 0 -1px 0 rgba(255, 255, 255, 0.1),
        inset 0 0 4px 2px rgba(255, 255, 255, 0.2);
        color: #fff;
        font-family: "Pretendard", "Noto Sans KR", sans-serif;
    }

    /* ✅ 달 여러 개 들어가는 부분 */
    .rdrMonths {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        width: 100% !important;
        margin: 0 auto !important;
    }

    /* ✅ 개별 달력 */
    .rdrMonth {
        width: 100% !important;
    }

    /* ▶️ 화살표 버튼 */
    .rdrNextButton,
    .rdrPprevButton {
        background: rgba(255, 255, 255, 0.25) !important;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        transition: background 0.2s;
    }

    .rdrNextButton:hover,
    .rdrPprevButton:hover {
        background: rgba(255, 255, 255, 0.35) !important;
    }

    /* 🔽 월·년도 선택 드롭다운 */
    .rdrMonthAndYearPickers select {
        font-weight: 600;
        color: white;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    /* 📅 요일 */
    .rdrWeekDays {
        color: #ffccaa;
        font-weight: 600;
    }

    /* 📅 날짜 색상 */
    .rdrDayNumber span {
        color: rgba(255, 255, 255, 0.9) !important;
    }

    .rdrDayPassive span {
        color: rgba(255, 255, 255, 0.35) !important;
    }

    /* ✅ 선택 스타일 */
    .rdrStartEdge.rdrEndEdge,
    .rdrSelected.rdrStartEdge.rdrEndEdge {
        background: rgba(236, 181, 0, 0.52) !important;
        border-radius: 20px !important;
    }

    .rdrStartEdge:not(.rdrEndEdge) {
        background: rgba(236, 181, 0, 0.52) !important;
        border-radius: 20px 0 0 20px !important;
    }

    .rdrEndEdge:not(.rdrStartEdge) {
        background: rgba(236, 181, 0, 0.52) !important;
        border-radius: 0 20px 20px 0 !important;
    }

    .rdrInRange {
        background: rgba(236, 181, 0, 0.27) !important;
    }

    /* ✅ 오늘 표시 */
    .rdrDayToday .rdrDayNumber span:after {
        background: #ff7bfa !important;
    }

    .rdrDayDisabled {
        background: transparent !important;
    }

    .rdrDayDisabled .rdrDayNumber span {
        color: rgba(255, 255, 255, 0.25) !important; /* 흐린 텍스트만 */
    }

    .rdrDayPassive {
        background: transparent !important;
    }


    @media (max-width: 480px) {
        .rdrCalendarWrapper {
            font-size: 0.9rem;
            padding: 12px;
        }
    }
`;
