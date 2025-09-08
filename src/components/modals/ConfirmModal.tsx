import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import * as S from './ConfirmModal.style';
import logo from '@/assets/images/moneyJ-Logo.png';

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}) => {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelBtnRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <S.Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
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
              <S.CancelButton ref={cancelBtnRef} onClick={onCancel}>
                {cancelText}
              </S.CancelButton>
              <S.ConfirmButton onClick={onConfirm}>{confirmText}</S.ConfirmButton>
            </S.Actions>
          </S.Dialog>
        </S.Overlay>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
