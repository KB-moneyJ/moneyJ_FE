import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wrapper,
  ContentsWrapper,
  ProgressBar,
  Progress,
  NextBtn,
  PrevBtn,
} from "./PlanStyle";

import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

export default function MakePlan() {
  const navigate = useNavigate(); // 라우팅 훅
  const [step, setStep] = useState<number>(1);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [otherCity, setOtherCity] = useState("");
  const [days, setDays] = useState({
    year: "",
    month: "",
    nights: "",
    days: "",
    rangeStart: "",
    rangeEnd: "",
  });
  const [people, setPeople] = useState(1);

  const pageVariants = {
    initial: { x: "100%", opacity: 0 },
    enter: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.5 } },
  };

  const goNext = () => {
    if (step === 2) {
      if (selectedRegions.length === 0 && otherCity.trim() === "") {
        alert("최소 한 개의 여행지를 선택해주세요!");
        return;
      }
    }

    if (step === 3) {
      if (!days.year || !days.month || !days.nights || !days.days) {
        alert("년, 월, 몇박 몇일을 모두 입력해주세요!");
        return;
      }
    }

    if (step < 4) {
      setStep((prev) => prev + 1);
    } else if (step === 4) {
      navigate("/plancompelete");
    }
  };

  const goPrev = () => step > 1 && setStep((prev) => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            onSelectCountry={setSelectedCountry}
            selected={selectedCountry}
            goNext={goNext}
          />
        );
      case 2:
        return (
          <Step2
            selected={selectedCountry}
            selectedRegions={selectedRegions}
            setSelectedRegions={setSelectedRegions}
            otherCity={otherCity}
            setOtherCity={setOtherCity}
          />
        );
      case 3:
        return (
          <Step3
            selected={selectedCountry}
            selectedRegions={selectedRegions}
            otherCity={otherCity}
            days={days}
            setDays={setDays}
          />
        );
      case 4:
        return (
          <Step4
            selected={selectedCountry}
            selectedRegions={selectedRegions}
            otherCity={otherCity}
            days={days}
            people={people}
            setPeople={setPeople}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <ContentsWrapper style={{ position: "relative", minHeight: "500px" }}>
        <ProgressBar>
          <Progress
            style={{
              marginLeft:
                step === 1 ? "0" : step === 2 ? "25%" : step === 3 ? "50%" : "75%",
            }}
          />
        </ProgressBar>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            style={{
              textAlign: "center",
              fontSize: "2rem",
              marginTop: "2rem",
              position: "absolute", // ✅ 겹쳐서 애니메이션
              top: 0,
              left: 0,
              width: "100%",
            }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </ContentsWrapper>

      <div
        style={{
          marginTop: "5px",
          width: "87%",
          display: "flex",
          justifyContent: "space-between",
          zIndex: "999",
        }}
      >
        {step > 1 && <PrevBtn onClick={goPrev}>이전</PrevBtn>}
        {step !== 1 && (
          <NextBtn onClick={goNext}>{step === 4 ? "완료" : "다음"}</NextBtn>
        )}
      </div>
    </Wrapper>
  );
}
