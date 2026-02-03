import styled from 'styled-components';
import { ArrowLeft, EllipsisVertical } from 'lucide-react';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  margin-top: 4.0625rem;
  position: relative;
`;

export const LeftIcon = styled(ArrowLeft)`
  width: 1.5rem;
  height: 1.5rem;
  color: white;
  cursor: pointer;
`;

export const RightIcon = styled(EllipsisVertical)`
  width: 1.5rem;
  height: 1.5rem;
  color: white;
  cursor: pointer;
`;

export const AirportWrapper = styled.div`
  padding: 0 1rem;
`;

export const Dim = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
`;

export const BottomCenterModal = styled.div`
  position: fixed;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);

  background: white;
  border-radius: 14px;
  min-width: 220px;
  width: 80%;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  z-index: 999;

  animation: fadeUp 0.2s ease-out;

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

export const ModalItem = styled.button<{ danger?: boolean }>`
  width: 100%;
  padding: 0.9rem 1.25rem;

  background: transparent;
  border: none;
  text-align: center;

  font-size: 0.95rem;
  font-weight: 500;

  color: ${({ danger }) => (danger ? '#ff6b6b' : '#111')};
  cursor: pointer;

  &:hover {
    background: #f4f4f4;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;
