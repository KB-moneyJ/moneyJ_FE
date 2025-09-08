import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 1000;
`;

export const Dialog = styled(motion.div)`
  width: 90%;
  max-width: 340px;
  background: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid black;
  padding-bottom: 2px;
  gap: 8px;
  align-items: center;
`;

export const Logo = styled.img`
  width: 15px;
  height: auto;
  object-fit: contain;
`;

export const Title = styled.h3`
  font-size: 18px;
  color: black;
`;

export const Description = styled.p`
  margin: 10px 0 20px;
  font-size: 14px;
  color: #555;

  line-height: 1.5;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const BaseButton = styled.button`
  flex: 1;
  padding: 12px 0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.15s;
  &:active {
    transform: scale(0.97);
  }
`;

export const CancelButton = styled(BaseButton)`
  background: #eb78ee;
  color: white;
`;

export const ConfirmButton = styled(BaseButton)`
  background: #61b6bd;
  color: white;
`;
