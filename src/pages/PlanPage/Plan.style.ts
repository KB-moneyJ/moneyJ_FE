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
  color: ${({ $active }) => ($active ? '#1a1840' : 'rgba(255,255,255,0.9)')};
`;

export const CardWrap = styled.div`
  position: relative;
  margin: clamp(0.75rem, 3vw, 1rem);

  > :first-child {
    margin: 0 !important;
  }
`;

export const UsersBadge = styled.div`
  position: absolute;
  top: 0;
  right: 2rem;
  transform: translateY(1.6rem);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: white;
  font-weight: 500;
  pointer-events: none;

  svg {
    width: 1rem;
    height: 1rem;
  }
  span {
    font-size: 0.8rem;
    line-height: 1;
  }
`;
