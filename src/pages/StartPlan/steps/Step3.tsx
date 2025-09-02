import React from "react";
import {
  Container,
  DropdownHeader,
  Wrapper, InputRow, DateInput, LabelText, RangeWrapper, InputRow2
} from '@/pages/StartPlan/steps/StepsStyle';

export default function Step3({ selected, selectedRegions, otherCity, days, setDays } ) {
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

          <DateInput
            placeholder="N"
            maxLength={2}
            value={days.nights}
            onChange={(e) => setDays({ ...days, nights: e.target.value })}
          />
          <LabelText>박</LabelText>

          <DateInput
            placeholder="D"
            maxLength={2}
            value={days.days}
            onChange={(e) => setDays({ ...days, days: e.target.value })}
          />
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
