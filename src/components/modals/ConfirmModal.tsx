import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import * as S from './ConfirmModal.style';
import logo from '@/assets/images/moneyJ-Logo.png';

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  onConfirm: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  confirmText = '닫기',
  onConfirm,
}) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmBtnRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onConfirm();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onConfirm]);

  return (
    <AnimatePresence>
      {open && (
        <S.Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onConfirm}
        >
          <S.Dialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-desc"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <S.TitleContainer>
              <S.Logo src={logo} alt="앱 로고" />
              <S.Title id="confirm-modal-title">{title}</S.Title>
            </S.TitleContainer>
            <S.Description id="confirm-modal-desc">{description}</S.Description>
            <S.Actions>
              <S.ConfirmButton ref={confirmBtnRef} onClick={onConfirm}>
                {confirmText}
              </S.ConfirmButton>
            </S.Actions>
          </S.Dialog>
        </S.Overlay>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
