import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wrapper,
  ContentsWrapper,
  ProgressBar,
  Progress,
} from "./PlanStyle";

import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

export default function MakePlan() {
  const [step, setStep] = useState<number>(1);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [otherCity, setOtherCity] = useState("");
  const [days, setDays] = useState({ nights: "", days: "" });
  const [people, setPeople] = useState(1);

  const pageVariants = {
    initial: { x: "100%", opacity: 0 },
    enter: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.5 } },
  };

  const goNext = () => step < 4 && setStep((prev) => prev + 1);
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
      <ContentsWrapper>
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
            style={{ textAlign: "center", fontSize: "2rem", marginTop: "2rem" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </ContentsWrapper>

      <div style={{ marginTop: "2rem" }}>
        {step > 1 && <button onClick={goPrev}>이전</button>}
        {step < 4 && <button onClick={goNext}>다음</button>}
      </div>
    </Wrapper>
  );
}
