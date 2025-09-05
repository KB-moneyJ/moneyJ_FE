import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
`;

export const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    margin-bottom: 4px;
    stroke: white;
    stroke-width: 1.8;
    transition:
      fill 0.2s,
      stroke 0.2s;
  }

  span {
    color: white;
    opacity: 0.8;
  }

  &:hover svg {
    fill: white;
  }

  ${(props) =>
    props.$active &&
    css`
      svg {
        fill: white;
        stroke: white;
      }
      span {
        color: white;
        opacity: 1;
      }
    `}
`;
