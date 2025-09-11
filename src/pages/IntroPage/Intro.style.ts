import styled, { keyframes, css } from 'styled-components';

/* 핑크 채움 살짝 올라오는 애니메이션 */
const fillIn = keyframes`
  0%   { transform: scale(0.9); opacity: 0.4; }
  100% { transform: scale(1);   opacity: 1; }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 5%;
  padding: 24px 20px 32px;
  box-sizing: border-box;
`;

export const LogoContainer = styled.div`
  width: 25%;
`;

export const Logo = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: white;
`;

export const InlineText = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.3rem;
`;

export const ColorText = styled.span`
  color: #ff82ff;
`;

export const Text = styled.span``;

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const StepItem = styled.div`
  display: grid;
  grid-template-columns: 96px 1fr;
  align-items: center;
  gap: 30px;
  position: relative;
`;

export const LeftCol = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* 원 */
export const Circle = styled.div<{ $active: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: ${({ $active }) =>
    $active ? 'linear-gradient(180deg,#ff72d2 0%, #ff53b5 100%)' : 'transparent'};
  box-shadow: ${({ $active }) => ($active ? '0 0 24px rgba(255, 115, 210, 0.45)' : 'none')};
  display: grid;
  place-items: center;
  transition:
    background 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;

  animation: ${({ $active }) =>
    $active
      ? css`
          ${fillIn} 0.22s ease
        `
      : 'none'};

  .icon {
    font-size: 25px; /* 아이콘 크기 — 이미지 쓰면 여기 대신 img 스타일링 */
    filter: drop-shadow(0 2px 0 rgba(0, 0, 0, 0.15));
  }
`;

export const Line = styled.div<{ $active: boolean }>`
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  width: 2px;
  height: 58px; /* 단계 간 간격과 맞춰 조정 */
  background: ${({ $active }) => ($active ? 'rgba(255, 115, 210, 0.9)' : 'rgba(255,255,255,0.35)')};
  transition: background 0.25s ease;
`;

export const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StepTitle = styled.h3<{ $active: boolean }>`
  margin: 0;
  font-size: 18px;
  color: white;
  letter-spacing: 0.2px;
`;

export const StepDesc = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  line-height: 1.5;
`;

export const StartButton = styled.button`
  margin-top: 20px;
  padding: 14px 22px;
  min-width: 220px;
  font-size: 16px;
  border-radius: var(--radius-button);
  border: none;
  color: white;
  background: var(--color-button-primary);
  cursor: pointer;
  transition:
    transform 0.12s ease,
    opacity 0.2s ease;

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0;
    pointer-events: none;
  }
`;

/* 버튼 이름만 다르게 쓰고 싶다면 export alias */
export const StartCta = StartButton;
