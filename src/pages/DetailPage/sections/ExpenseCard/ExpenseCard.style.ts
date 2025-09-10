import styled from 'styled-components';
import Card from '@/components/common/Card/Card';

export const Wrapper = styled(Card)`
  margin: 1rem;
  padding: 2rem 1.5rem;
  color: white;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
`;

export const Amount = styled.h2`
  margin: 0.2rem 0 0;
  font-size: 1.8rem;
  font-weight: 800;
`;

export const EditBtn = styled.button`
  background: #fce5ff;
  border: none;
  border-radius: var(--radius-button);
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
`;

export const ItemList = styled.div`
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 15px;
    justify-content: space-between;
    max-height: 250px;
    overflow-y: auto;
    padding-right: 8px;

    &::-webkit-scrollbar {
        width: 5px; /* 스크롤바 두께 */
    }

    &::-webkit-scrollbar-track {
        background: transparent; /* 트랙 배경 */
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.49);
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #ff7bfa;
    }

`;

export const Item = styled.div<{ $covered?: boolean; $purchased?: boolean }>`
    display: flex;
    align-items: center;
    width: 100%;
    height: 45px;
    justify-content: space-between;
    border-radius: var(--radius-card);
    border: 0.4px solid
    ${({ $covered, $purchased }) =>
      $purchased
        ? "#9f9f9f" /* 짙은 보라 */
        : $covered
          ? "var(--color-text-highlight)"
          : "white"};
    color: ${({ $purchased }) => ($purchased ? "#9f9f9f" : "white")};
    cursor: default;
    font-size: 15px;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${({ $purchased, $covered }) =>
          $purchased
            ? "#9f9f9f"
            : $covered
              ? "var(--color-text-highlight)"
              : "rgba(255,255,255,0.4)"};
        background: ${({ $covered, $purchased }) =>
          $purchased
            ? "rgba(75,0,130,0.1)" /* 보라색 반투명 */
            : $covered
              ? "rgba(61, 220, 90, 0.08)"
              : "transparent"};
    }
`;


export const CheckMark = styled.div<{ $visible?: boolean }>`
    display: ${({ $visible }) => ($visible ? "flex" : "none")};
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-left: 5px;
    border-radius: 50%;
    background-color: transparent;;
    color: #00D000FF;

    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transform: ${({ $visible }) => ($visible ? "scale(1)" : "scale(0)")};
    transition:
            opacity 0.3s ease ${({ $visible }) => ($visible ? "0.4s" : "0s")},
            transform 0.3s ease ${({ $visible }) => ($visible ? "0.4s" : "0s")};
`;

export const ItemContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
`