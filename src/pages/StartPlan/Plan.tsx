import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { Wrapper, ContentsWrapper, ProgressBar, Progress, NextBtn, PrevBtn } from './PlanStyle';

import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
const BASE_URL = import.meta.env.VITE_API_URL as string;

export default function MakePlan() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [otherCity, setOtherCity] = useState('');
  const [days, setDays] = useState({
    year: '',
    month: '',
    nights: '',
    days: '',
    rangeStart: '',
    rangeEnd: '',
  });
  const [people, setPeople] = useState(1);
  const [friendIds, setFriendIds] = useState<string[]>([]);

  const token = localStorage.getItem('accessToken');
  const pageVariants = {
    initial: { x: '100%', opacity: 0 },
    enter: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.5 } },
  };

  const goNext = async () => {
    // Step2: 여행지 선택 검증
    if (step === 2) {
      if (selectedRegions.length === 0 && otherCity.trim() === '') {
        alert('최소 한 개의 여행지를 선택해주세요!');
        return;
      }
    }

    // Step3: 날짜 및 기간 검증
    if (step === 3) {
      if (!days.year || !days.month || !days.nights || !days.days) {
        alert('년, 월, 몇박 몇일을 모두 입력해주세요!');
        return;
      }
    }

    // Step1~3: 다음 단계로 이동
    if (step < 4) {
      setStep((prev) => prev + 1);
      return;
    }

    // Step4: 친구 이메일 검증 후 플랜 완료 페이지로 이동
    if (step === 4) {
      try {
        // friendIds가 존재할 때만 서버 검증
        if (friendIds.length > 0) {
          const response = await axios.post(
            `${BASE_URL}/users/check`,
            { emails: friendIds },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          const result = response.data;

          const invalidUsers = result
            .filter((user: any) => !user.exists)
            .map((user: any) => user.email);

          if (invalidUsers.length > 0) {
            alert(`가입하지 않은 사용자입니다:\n${invalidUsers.join('\n')}`);
            return; // 검증 실패 시 진행 중단
          }
        }

        // 검증 통과 또는 친구 없음 → PlanComplete 페이지로 이동
        navigate('/plancompelete', {
          state: { selectedCountry, selectedRegions, otherCity, days, people, friendIds },
        });
      } catch (error) {
        console.error('사용자 검증 실패:', error);
        alert('사용자 검증 중 오류가 발생했습니다.');
      }
    }
  };

  const goPrev = () => step > 1 && setStep((prev) => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1 onSelectCountry={setSelectedCountry} selected={selectedCountry} goNext={goNext} />
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
            friendIds={friendIds}
            setFriendIds={setFriendIds}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <div
          style={{ marginTop: '63px', marginLeft: '42px', cursor: 'pointer', width: '24.5px' }}
          onClick={() => navigate('/home')}
        >
          <svg
            width="22"
            height="23"
            viewBox="0 0 22 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.0458 14.6392C13.2749 14.6357 14.2781 15.6262 14.2815 16.8471L14.2902 19.9872C14.2909 20.2496 14.5018 20.4593 14.7713 20.4646L16.717 20.4592C18.2503 20.455 19.4933 19.2204 19.4891 17.7075L19.4643 8.80181C19.4557 8.2812 19.2063 7.7919 18.7797 7.46744L12.0345 2.11863C11.1291 1.40554 9.86527 1.40905 8.96077 2.12922L2.29129 7.51124C1.8502 7.84832 1.6035 8.33901 1.59987 8.86883L1.62459 17.7572C1.62879 19.2701 2.87865 20.4977 4.41194 20.4935L6.37601 20.488C6.65266 20.4872 6.87663 20.2671 6.87588 19.9976C6.87571 19.9384 6.8827 19.8792 6.89479 19.823L6.88657 16.8677C6.8832 15.6539 7.87473 14.6589 9.09459 14.6474L12.0458 14.6392ZM16.7213 21.9905L14.7572 21.9959C13.6322 21.9725 12.762 21.0919 12.7589 19.9915L12.7502 16.8514C12.7492 16.4747 12.4349 16.1693 12.0501 16.1704L9.10396 16.1786C8.72728 16.1817 8.41678 16.4898 8.41782 16.8635L8.42652 19.9933C8.42673 20.0699 8.41673 20.1434 8.39548 20.2129C8.28804 21.2238 7.42662 22.0163 6.38027 22.0192L4.41619 22.0247C2.03868 22.0313 0.0998973 20.1185 0.0933434 17.7615L0.0686092 8.86595C0.0759961 7.85121 0.540953 6.92096 1.34673 6.30724L8.00296 0.934438C9.4687 -0.233392 11.5155 -0.239083 12.9846 0.918545L19.7186 6.25922C20.5094 6.85829 20.9795 7.7839 20.9956 8.78632L21.0203 17.7033C21.0269 20.0604 19.0988 21.9839 16.7213 21.9905V21.9905Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
      <ContentsWrapper style={{ position: 'relative', minHeight: '500px' }}>
        <ProgressBar>
          <Progress
            style={{
              marginLeft: step === 1 ? '0' : step === 2 ? '25%' : step === 3 ? '50%' : '75%',
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
              textAlign: 'center',
              fontSize: '2rem',
              marginTop: '2rem',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
            }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </ContentsWrapper>

      <div
        style={{
          marginTop: '5px',
          width: '87%',
          display: 'flex',
          justifyContent: 'space-between',
          zIndex: '999',
        }}
      >
        {step > 1 && <PrevBtn onClick={goPrev}>이전</PrevBtn>}
        {step !== 1 && <NextBtn onClick={goNext}>다음</NextBtn>}
      </div>
    </Wrapper>
  );
}
