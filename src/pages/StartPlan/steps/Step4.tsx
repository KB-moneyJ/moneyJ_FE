import React, { useState } from "react";
import styled from "styled-components";
import {
  Container,
  Wrapper,
  CounterBox,
  IndicatorButton,
  IndicatorButton2,
  Count,
  IdInput,
  AddButton, InputWrapper, InputContainer, DropdownHeader,
} from '@/pages/StartPlan/steps/StepsStyle';

export default function Step4({ selected, selectedRegions, otherCity, days, people, setPeople }) {
  const [count, setCount] = useState(1);
  const [inputs, setInputs] = useState<string[]>([]); // 친구 ID 입력칸 상태

  const handleIncrease = () => setPeople(people + 1);

  const handleDecrease = () => {
    if (people > 1) {
      setPeople(people - 1);
      if (inputs.length > people - 2) {
        setInputs(inputs.slice(0, people - 2));
      }
    }
  };

  const handleAddInput = () => {
    if (inputs.length < people - 1) {
      setInputs([...inputs, ""]);
    }
  };

  const handleChangeInput = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };
  const displayRegions = selectedRegions.filter((r) => r !== "기타");
  if (otherCity.trim().length > 0) {
    displayRegions.push(otherCity);
  }

  return (
    <Wrapper>
      <Container>
        <div>인원수는 몇명인가요?</div>
        <CounterBox>
          <IndicatorButton onClick={handleDecrease}>
            <svg
              width="18"
              height="2"
              viewBox="0 0 18 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 1C18 1.26522 17.9395 1.51957 17.8317 1.70711C17.724 1.89464 17.5779 2 17.4255 2H0.574468C0.42211 2 0.275991 1.89464 0.168258 1.70711C0.0605241 1.51957 0 1.26522 0 1C0 0.734784 0.0605241 0.48043 0.168258 0.292894C0.275991 0.105357 0.42211 0 0.574468 0H17.4255C17.5779 0 17.724 0.105357 17.8317 0.292894C17.9395 0.48043 18 0.734784 18 1Z"
                fill="white"
              />
            </svg>
          </IndicatorButton>
          <Count>{people}명</Count>
          <IndicatorButton2 onClick={handleIncrease}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 8C16 8.25461 15.8989 8.49879 15.7188 8.67882C15.5388 8.85886 15.2946 8.96 15.04 8.96H8.96V15.04C8.96 15.2946 8.85886 15.5388 8.67882 15.7188C8.49879 15.8989 8.25461 16 8 16C7.74539 16 7.50121 15.8989 7.32118 15.7188C7.14114 15.5388 7.04 15.2946 7.04 15.04V8.96H0.96C0.705392 8.96 0.461212 8.85886 0.281178 8.67882C0.101143 8.49879 0 8.25461 0 8C0 7.74539 0.101143 7.50121 0.281178 7.32118C0.461212 7.14114 0.705392 7.04 0.96 7.04H7.04V0.96C7.04 0.705392 7.14114 0.461212 7.32118 0.281178C7.50121 0.101143 7.74539 0 8 0C8.25461 0 8.49879 0.101143 8.67882 0.281178C8.85886 0.461212 8.96 0.705392 8.96 0.96V7.04H15.04C15.2946 7.04 15.5388 7.14114 15.7188 7.32118C15.8989 7.50121 16 7.74539 16 8Z"
                fill="white"
              />
            </svg>
          </IndicatorButton2>
        </CounterBox>

        {people >= 2 && (
          <div style={{ marginTop: "50px", width: "100%" }}>
            <p
              style={{
                color: "#FF82FF",
                marginBottom: "11px",
                fontSize: "13px",
                fontWeight:'normal',
                lineHeight:"1.5"
              }}
            >
              동행자도 Money J를 쓰고 있나요?<br/>
              함께라면 목표 달성이 훨씬 재밌어져요!
            </p>
            <p
              style={{
                color: "white",
                marginBottom: "22px",
                fontSize: "16px",
              }}
            >
              여행 계획을 공유할 친구를 초대해주세요
            </p>
            <InputContainer>
              {inputs.map((input, idx) => (
                <InputWrapper
                  key={idx}
                >
                  <IdInput
                    type="text"
                    placeholder="ID 입력"
                    value={input}
                    onChange={(e) => handleChangeInput(idx, e.target.value)}
                  />
                </InputWrapper>
              ))}
              {inputs.length < people - 1 && (
                <AddButton onClick={handleAddInput}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 10C20 10.3183 19.8736 10.6235 19.6485 10.8485C19.4235 11.0736 19.1183 11.2 18.8 11.2H11.2V18.8C11.2 19.1183 11.0736 19.4235 10.8485 19.6485C10.6235 19.8736 10.3183 20 10 20C9.68174 20 9.37652 19.8736 9.15147 19.6485C8.92643 19.4235 8.8 19.1183 8.8 18.8V11.2H1.2C0.88174 11.2 0.576516 11.0736 0.351472 10.8485C0.126428 10.6235 0 10.3183 0 10C0 9.68174 0.126428 9.37652 0.351472 9.15147C0.576516 8.92643 0.88174 8.8 1.2 8.8H8.8V1.2C8.8 0.88174 8.92643 0.576516 9.15147 0.351472C9.37652 0.126428 9.68174 0 10 0C10.3183 0 10.6235 0.126428 10.8485 0.351472C11.0736 0.576516 11.2 0.88174 11.2 1.2V8.8H18.8C19.1183 8.8 19.4235 8.92643 19.6485 9.15147C19.8736 9.37652 20 9.68174 20 10Z"
                      fill="white"
                    />
                  </svg>
                </AddButton>
              )}
            </InputContainer>
          </div>
        )}
        <DropdownHeader
          style={{
            position: 'absolute',
            top: '500px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
          }}
        >
          <div>
            {selected.flag} {selected.name},{" "}
            {displayRegions.length > 0 ? displayRegions.join(", ") : ""}{" "}
          </div>
          <div>
            {days.nights && days.days ? `${days.nights}박 ${days.days}일` : ""}{" "}
          </div>
        </DropdownHeader>
      </Container>
    </Wrapper>
  );
}
