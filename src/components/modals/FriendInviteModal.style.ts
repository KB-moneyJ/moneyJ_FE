import styled from 'styled-components';
import {
  InputContainer as BaseInputContainer,
  IdInput as BaseIdInput,
  AddButton as BaseAddButton,
} from '@/pages/StartPlan/steps/StepsStyle';
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
  align-items: center;
  position: relative;
`;

export const SubTitle = styled.p`
  color: var(--color-text-highlight);
  font-size: 14px;
  text-align: center;
  margin-bottom: 12px;
`;

export const Title = styled.p`
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
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

  margin-top: 16px;
  width: 88px;
  height: 45px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InputContainer = BaseInputContainer;
export const AddButton = BaseAddButton;

export const IdInput = styled(BaseIdInput)`
  flex-shrink: 0;
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
