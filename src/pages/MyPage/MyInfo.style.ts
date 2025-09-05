import styled, { css } from 'styled-components';

export const Page = styled.div`
  overflow-y: auto;
  padding: 16px 22px 0;
  color: white;
  height: 84vh;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PowerBtn = styled.button`
  all: unset;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.9);
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const ProfileWrap = styled.section`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`;

export const AvatarCircle = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  display: grid;
  place-items: center;
  backdrop-filter: blur(6px);
  background: radial-gradient(
    120px 120px at 30% 20%,
    rgba(255, 255, 255, 0.12),
    rgba(255, 255, 255, 0.04) 60%,
    transparent 100%
  );
`;

export const AvatarIcon = styled.div`
  font-size: 35px;
  user-select: none;
`;

export const EditBadge = styled.div`
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #9b4dff;
  color: #fff;
  border: 2px solid #2c1146;
`;

export const Username = styled.div`
  margin-top: 5px;
  font-size: 13px;
  letter-spacing: 1.8px;
  opacity: 0.9;
`;

export const Form = styled.form`
  margin-top: 20px;
`;

export const Field = styled.div`
  margin: 18px 0 12px;
`;

export const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

export const Label = styled.label`
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
  letter-spacing: 0.2px;
  color: rgba(255, 255, 255, 0.9);
`;

export const InputUnderline = styled.input<{ $readonly?: boolean }>`
  width: 100%;
  padding: 10px 0 12px;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.45);
  outline: none;
  color: #fff;
  font-size: 15px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }

  &:focus {
    border-bottom-color: #bb86fc;
  }

  ${(p) =>
    p.$readonly &&
    css`
      color: rgba(255, 255, 255, 0.6);
      cursor: default;
    `}
`;

export const Helper = styled.div`
  margin-top: 6px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
`;

export const EmailRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: end;
`;

export const VerifyBtn = styled.button`
  height: 36px;
  padding: 0 14px;
  border-radius: var(--radius-button);
  border: none;
  background: #7d3cff;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: transform 0.02s ease;

  &:active {
    transform: translateY(1px);
  }
`;

export const BtnGroup = styled.div`
  margin-top: 28px;
  display: grid;
  gap: 12px;
`;

const baseBtn = css`
  height: 40px;
  border: none;
  border-radius: var(--radius-button);
  font-weight: 700;
  letter-spacing: 0.3px;
  cursor: pointer;
`;

export const SecondaryBtn = styled.button`
  ${baseBtn};
  background: var(--color-button-secondary);
  color: white;
  backdrop-filter: blur(12px);
`;

export const PrimaryBtn = styled.button`
  ${baseBtn};
  background: var(--color-button-primary);
  color: white;
  margin-bottom: 65px;
`;
