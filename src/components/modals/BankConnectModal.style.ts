import styled from 'styled-components';
import { GlassCard } from '@/components/common/Card/Card.style';
import { X } from 'lucide-react';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

export const ModalContainer = styled(GlassCard)`
  width: 320px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Title = styled.p`
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 24px;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  &:focus-within label {
    color: var(--color-text-highlight);
  }
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin-bottom: 6px;
  transition: color 0.2s;
`;

export const Input = styled.input`
  background: transparent;
  border: none;
  border-bottom: 1px solid white;
  padding: 8px 0;
  font-size: 14px;
  color: white;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    border-bottom: 1px solid var(--color-text-highlight);
    color: var(--color-text-highlight);
  }
`;

export const Select = styled.select`
  background: transparent;
  border: none;
  border-bottom: 1px solid white;
  padding: 8px 0;
  font-size: 14px;
  color: white;
  outline: none;
  transition: all 0.2s;

  option {
    color: black;
  }

  &:focus {
    border-bottom: 1px solid var(--color-text-highlight);
    color: var(--color-text-highlight);
  }
`;

export const ConfirmButton = styled.button`
  background: var(--color-button-primary);
  color: white;
  font-weight: bold;
  font-size: 15px;
  border: none;
  border-radius: var(--radius-action-button);
  padding: 12px;
  cursor: pointer;
  margin-top: 20px;
`;

export const CloseButton = styled(X)`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 20px;
  height: 20px;
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
