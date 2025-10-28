import React from "react";
import { DateRange } from "react-date-range";
import { ko } from "date-fns/locale";
import dayjs from "dayjs";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container3,
  DateDisplay,
  DropdownHeader,
  GlassCalendar,
  Wrapper,
} from "@/pages/StartPlan/steps/StepsStyle";
import ReactCountryFlag from "react-country-flag";

export default function Step3({
                                selected,
                                selectedRegions,
                                otherCity,
                                days,
                                setDays,
                              }) {
  const [range, setRange] = React.useState([
    {
      startDate: days.startDate ? new Date(days.startDate) : new Date(),
      endDate: days.endDate ? new Date(days.endDate) : new Date(),
      key: "selection",
    },
  ]);

  const displayRegions = selectedRegions.filter((r) => r !== "기타");
  if (otherCity.trim().length > 0) displayRegions.push(otherCity);

  const handleDateChange = (item) => {
    const { startDate, endDate } = item.selection;
    if (!startDate || !endDate) return;

    // ✅ 기존 Step3 구조에 맞춰 변환
    const nights = dayjs(endDate).diff(dayjs(startDate), "day");
    const totalDays = nights + 1;

    const year = dayjs(startDate).format("YYYY");
    const month = dayjs(startDate).format("MM");
    const rangeStart = dayjs(startDate).format("DD");
    const rangeEnd = dayjs(endDate).format("DD");

    setDays({
      ...days,
      year,
      month,
      nights: String(nights),
      days: String(totalDays),
      rangeStart,
      rangeEnd,
    });

    setRange([item.selection]);
  };

  return (
    <Wrapper>
      <Container3>
        <div>여행할 날짜는 언제인가요?</div>

        <DateDisplay>
          <div>
            <span className="label">출발일</span>
            <span className="date">
              {dayjs(range[0].startDate).format("YYYY.MM.DD")}
            </span>
          </div>
          <span className="arrow">→</span>
          <div>
            <span className="label">도착일</span>
            <span className="date">
              {dayjs(range[0].endDate).format("YYYY.MM.DD")}
            </span>
          </div>
        </DateDisplay>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <GlassCalendar>
              <DateRange
                editableDateInputs={true}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                ranges={range}
                locale={ko}
                minDate={new Date()}
              />
            </GlassCalendar>
          </motion.div>
        </AnimatePresence>

        <DropdownHeader
          style={{
            position: "absolute",
            top: "550px",
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
      </Container3>
    </Wrapper>
  );
}
