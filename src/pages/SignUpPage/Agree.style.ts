import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  gap: 3%;
`;

export const LogoContainer = styled.div`
  width: 25%;
`;

export const Logo = styled.img`
  width: 100%;
  height: auto;
`;

export const TextContainer = styled.div`
  width: 100%;
`;

export const Text = styled.p`
  font-size: 1rem;
  color: white;
  text-align: center;
`;

export const AgreementContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  color: white;
`;

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  overflow: hidden;
`;

export const AllAgreeLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  padding: 12px 0;
  user-select: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 12px;
`;

export const Item = styled.div`
  display: block;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 12px 0;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Title = styled.span`
  font-size: 16px;
`;

export const CustomCheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const CustomCheckbox = styled.span<{ checked?: boolean }>`
  width: 18px;
  height: 18px;
  border: 2px solid white;
  display: inline-block;
  position: relative;
  flex: 0 0 18px;

  ${({ checked }) =>
    checked &&
    `
    &::after {
      content: '✔';
      position: absolute;
      top: -3px;
      left: 2px;
      font-size: 16px;
      line-height: 1;
      color: white;
    }
  `}
`;

export const Arrow = styled.span<{ $open: boolean }>`
  font-size: 18px;
  opacity: 0.9;
  transform: rotate(${({ $open }) => ($open ? '90deg' : '0deg')});
  transition: transform 0.2s ease;
`;

export const ContentBox = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? '500px' : '0')};
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 10px;
  padding: ${({ $open }) => ($open ? '10px' : '0')};
  margin: ${({ $open }) => ($open ? '4px' : '0')};
  font-size: 14px;

  ul {
    margin: 0 0 8px 18px;
    padding: 0;
  }

  p {
    margin: 0;
  }
`;

export const NextButton = styled.button`
  background: var(--color-button-primary);
  border-radius: var(--radius-button);
  width: 200px;
  padding: 0.8vh;
  color: white;
  cursor: pointer;
  text-align: center;
  border: none;
`;
