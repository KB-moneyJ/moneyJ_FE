import { useEffect, useState } from 'react';
import {
  Overlay,
  ModalContainer,
  SubTitle,
  Title,
  InputContainer,
  IdInput,
  AddButton,
  ConfirmButton,
  CloseButton,
} from './FriendInviteModal.style';

import { InputWrapper } from '@/pages/StartPlan/steps/StepsStyle';

interface FriendInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FriendInviteModal({ isOpen, onClose }: FriendInviteModalProps) {
  const [inputs, setInputs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) window.scrollTo({ top: 0, behavior: 'auto' });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddInput = () => setInputs([...inputs, '']);
  const handleChangeInput = (idx: number, value: string) => {
    const copy = [...inputs];
    copy[idx] = value;
    setInputs(copy);
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} />
        <SubTitle>
          동행자도 Money J를 쓰고 있나요?
          <br />
          함께라면 목표 달성이 훨씬 재밌어져요!
        </SubTitle>
        <Title>여행 계획을 공유할 친구를 초대해주세요</Title>

        <InputContainer>
          {inputs.map((input, idx) => (
            <InputWrapper key={idx}>
              <IdInput
                type="text"
                placeholder="ID 입력"
                value={input}
                onChange={(e) => handleChangeInput(idx, e.target.value)}
              />
            </InputWrapper>
          ))}

          <AddButton onClick={handleAddInput}>+</AddButton>
        </InputContainer>

        <ConfirmButton onClick={onClose}>확인</ConfirmButton>
      </ModalContainer>
    </Overlay>
  );
}
