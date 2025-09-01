import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wrapper,
  ContentsWrapper,
  ProgressBar,
  Progress,
} from "./About.style";

import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

export default function SignupPage() {
  const [step, setStep] = useState<number>(1);

  const pageVariants = {
    initial: { x: "100%", opacity: 0 },
    enter: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.5 } },
  };

  const goNext = () => {
    if (step < 4) setStep((prev) => prev + 1);
  };

  const goPrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  // step에 따라 보여줄 컴포넌트 매핑
  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
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

        <div style={{ marginTop: "2rem" }}>
          {step > 1 && <button onClick={goPrev}>이전</button>}
          {step < 4 && <button onClick={goNext}>다음</button>}
        </div>
      </ContentsWrapper>
    </Wrapper>
  );
}
