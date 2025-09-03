import { useEffect, useMemo, useState } from 'react';
import logo from '@/assets/images/logo-j.png';
import {
  Wrapper,
  LogoContainer,
  Logo,
  TextContainer,
  Text,
  InlineText,
  ColorText,
  Timeline,
  StepItem,
  LeftCol,
  Circle,
  Line,
  RightCol,
  StepTitle,
  StepDesc,
  StartButton,
} from './Intro.style';

const STEPS = [
  {
    title: '여행 계획 세우기',
    desc: '여행지와 기간을 입력해 나만의 여행 플랜을 시작하세요.',
    // 이모지 대신 이미지 쓰고 싶으면 icon: require('...') 후 <img/>로 바꿔도 됨
    icon: '🧳',
  },
  {
    title: '친구 초대하기',
    desc: '함께할 친구를 초대해 여행 목표를 공유해보세요.',
    icon: '🧑‍🤝‍🧑',
  },
  {
    title: '함께 저축하기',
    desc: '함께한 친구들과 목표를 향해 저축을 시작해요.',
    icon: '💰',
  },
] as const;

export default function Intro() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (activeIndex >= STEPS.length - 1) {
      const to = setTimeout(() => setStarted(true), 1000);
      return () => clearTimeout(to);
    }
    const it = setInterval(() => {
      setActiveIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 1000);
    return () => clearInterval(it);
  }, [activeIndex]);

  const allDone = useMemo(() => started, [started]);

  return (
    <Wrapper>
      <LogoContainer>
        <Logo src={logo} alt="Logo" />
      </LogoContainer>

      <TextContainer>
        <InlineText>
          <Text>축하합니다!</Text>
          <Text>
            이제 <ColorText>moneyJ</ColorText>와 함께할 준비가 끝났어요
          </Text>
        </InlineText>
      </TextContainer>

      <Timeline>
        {STEPS.map((s, idx) => {
          const isActive = idx <= activeIndex;
          const isLast = idx === STEPS.length - 1;
          return (
            <StepItem key={s.title}>
              <LeftCol>
                <Circle $active={isActive} aria-hidden>
                  <span className="icon">{s.icon}</span>
                </Circle>
                {!isLast && <Line $active={activeIndex >= idx + 1} />}
              </LeftCol>
              <RightCol>
                <StepTitle $active={isActive}>{s.title}</StepTitle>
                <StepDesc>{s.desc}</StepDesc>
              </RightCol>
            </StepItem>
          );
        })}
      </Timeline>

      <StartButton disabled={!allDone}>바로 시작하기</StartButton>
    </Wrapper>
  );
}
