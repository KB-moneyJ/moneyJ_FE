import React from "react";
import {
  Container,
  DropdownHeader,
  Wrapper, InputRow, DateInput, LabelText, RangeWrapper, InputRow2
} from '@/pages/StartPlan/steps/StepsStyle';

export default function Step3({ selected, selectedRegions, otherCity }) {
  const displayRegions = selectedRegions.filter((r) => r !== "기타");
  if (otherCity.trim().length > 0) {
    displayRegions.push(otherCity);
  }

  return (
    <Wrapper>
      <Container>
        <div>여행할 날짜는 언제인가요?</div>

        <InputRow>
          <DateInput placeholder="YYYY" maxLength={4} />
          <LabelText>년</LabelText>

          <DateInput placeholder="MM" maxLength={2} />
          <LabelText>월</LabelText>

          <DateInput placeholder="N" maxLength={2} />
          <LabelText>박</LabelText>

          <DateInput placeholder="D" maxLength={2} />
          <LabelText>일</LabelText>
        </InputRow>

        {/* 두 번째: 세부 날짜 선택 */}
        <RangeWrapper>
          <div>세부 날짜까지 정하셨나요? (선택)</div>
          <InputRow2>
            <DateInput placeholder="DD" maxLength={2} />
            <LabelText>일</LabelText>
            <span> ~ </span>
            <DateInput placeholder="DD" maxLength={2} />
            <LabelText>일</LabelText>
          </InputRow2>
        </RangeWrapper>

        <DropdownHeader
          style={{
            position: 'absolute',
            top: '675px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
          }}
        >
          {selected.flag} {selected.name},{' '}
          {displayRegions.length > 0 ? displayRegions.join(', ') : ''}
        </DropdownHeader>
      </Container>
    </Wrapper>
  );
}
