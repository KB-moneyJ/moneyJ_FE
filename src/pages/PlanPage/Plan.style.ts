import styled from 'styled-components';

export const Page = styled.div`
  padding: 1rem;
  color: white;
`;

export const Tabs = styled.div`
  --tab-h: 2.75rem;
  --rail-inset: clamp(12px, 4vw, 24px);
  --rail-width: calc(100% - (var(--rail-inset) * 2));
  --rail-height: 1px;

  position: relative;
  display: flex;
  justify-content: center;
  margin: 2.2rem 0 1rem;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    width: var(--rail-width);
    height: var(--rail-height);
    background: #e1dbff;
  }
`;

export const Track = styled.div`
  position: relative;
  width: var(--rail-width);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-end;
`;

export const ActiveBg = styled.div<{ $tab: 'ongoing' | 'done' }>`
  position: absolute;
  bottom: var(--rail-height);
  left: ${({ $tab }) => ($tab === 'ongoing' ? '0%' : '50%')};
  width: 50%;
  height: var(--tab-h);
  background: #e1dbff;
  transition: left 0.2s ease;
  pointer-events: none;
`;

export const SegTab = styled.button<{ $active?: boolean }>`
  position: relative;
  z-index: 1;
  height: var(--tab-h);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  background: transparent;
  cursor: pointer;

  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? 'black' : 'white')};
`;

export const CardWrap = styled.div`
  position: relative;
  margin: clamp(0.75rem, 3vw, 1rem);

  > *:first-child,
  > *:first-child > *:first-child {
   margin: 0 !important;+  }
`;

export const EmptyArea = styled.div`
  padding: 1rem;
  opacity: 0.85;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
`;

export const EmptyText = styled.p`
  margin: 0;
  line-height: 3;
`;

export const EmptyActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0.75rem 1rem;
  min-height: 2.75rem;
  width: 80%;
  max-width: 420px;

  background-color: var(--color-button-primary);
  color: white;

  border: 0;
  border-radius: var(--radius-button);
  cursor: pointer;

  font-weight: 600;

  transition:
    transform 0.02s ease,
    filter 0.15s ease;
  &:hover {
    filter: brightness(1.05);
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.7);
    outline-offset: 2px;
  }
`;
