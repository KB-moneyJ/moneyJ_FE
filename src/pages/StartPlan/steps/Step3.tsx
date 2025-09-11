import React from "react";
import {
  Container,
  DropdownHeader,
  Wrapper,
  InputRow,
  DateInput,
  LabelText,
  RangeWrapper,
  InputRow2,
} from "@/pages/StartPlan/steps/StepsStyle";
import { motion, AnimatePresence } from "framer-motion";
import ReactCountryFlag from "react-country-flag";


export default function Step3({ selected, selectedRegions, otherCity, days, setDays }) {
  const displayRegions = selectedRegions.filter((r) => r !== "기타");
  if (otherCity.trim().length > 0) {
    displayRegions.push(otherCity);
  }

  return (
    <Wrapper>
      <Container>
        <div>여행할 날짜는 언제인가요?</div>

        <InputRow>
          <DateInput
            placeholder="YYYY"
            maxLength={4}
            value={days.year}
            onChange={(e) => setDays({ ...days, year: e.target.value })}
          />
          <LabelText>년</LabelText>

          <DateInput
            placeholder="MM"
            maxLength={2}
            value={days.month}
            onChange={(e) => setDays({ ...days, month: e.target.value })}
          />
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
        <AnimatePresence>
          {days.month && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <RangeWrapper>
                <div>세부 날짜까지 정하셨나요? (선택)</div>
                <InputRow2>
                  <DateInput
                    placeholder="DD"
                    maxLength={2}
                    value={days.rangeStart}
                    onChange={(e) => {
                      const start = e.target.value;
                      let end = "";

                      if (start && days.days) {
                        const year = parseInt(days.year) || new Date().getFullYear();
                        const month = parseInt(days.month) || new Date().getMonth() + 1;
                        const tripDays = parseInt(days.days);

                        const startDay = parseInt(start);
                        const lastDayOfMonth = new Date(year, month, 0).getDate();

                        let calculatedEnd = startDay + tripDays - 1;
                        if (calculatedEnd > lastDayOfMonth) {
                          // 다음 달로 넘어가는 경우
                          calculatedEnd = calculatedEnd - lastDayOfMonth;
                        }
                        end = String(calculatedEnd);
                      }

                      setDays({ ...days, rangeStart: start, rangeEnd: end });
                    }}
                  />
                  <LabelText>일</LabelText>
                  <span> ~ </span>
                  <DateInput
                    placeholder="DD"
                    maxLength={2}
                    value={days.rangeEnd}
                    readOnly
                  />
                  <LabelText>일</LabelText>
                </InputRow2>
              </RangeWrapper>
            </motion.div>
          )}
        </AnimatePresence>


        <DropdownHeader
          style={{
            position: "absolute",
            top: "500px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {selected?.countryCode && (
              <ReactCountryFlag
                countryCode={selected.countryCode}
                svg
                style={{ width: "20px", height: "20px" }}
              />
            )}
            <span>{selected?.country}</span>
            {displayRegions.length > 0 && (
              <span>, {displayRegions.join(", ")}</span>
            )}
          </div>
          <div>
            {days.nights && days.days ? `${days.nights}박 ${days.days}일` : ""}
          </div>
        </DropdownHeader>

      </Container>
    </Wrapper>
  );
}
