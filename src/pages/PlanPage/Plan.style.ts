import styled from 'styled-components';

export const Page = styled.div`
  padding: 1rem;
  color: white;
`;

export const Tabs = styled.div`
  --rail-inset: 16px;
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
    border-radius: 1px;
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
  bottom: calc(-1 * var(--rail-height));
  left: ${({ $tab }) => ($tab === 'ongoing' ? '0%' : '50%')};
  width: 50%;
  height: 44px;
  background: #e1dbff;
  z-index: 0;
  transition: left 0.2s ease;
`;

export const SegTab = styled.button<{ $active?: boolean }>`
  position: relative;
  z-index: 1;
  height: 44px;
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
  margin: 1rem;

  > :first-child {
    margin: 0 !important;
  }
`;

export const UsersBadge = styled.div`
  position: absolute;
  top: 24px;
  right: 30px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
  pointer-events: none;
  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;
