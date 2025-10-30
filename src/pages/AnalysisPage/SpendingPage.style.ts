import styled from 'styled-components';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  height: 804px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LegendScroll = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch; /* iOS 부드러운 스크롤 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  /* WebKit 스크롤바(선택) */
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 999px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const LegendWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  color: #fff;
  margin: 16px 0 8px;

  /* 핵심: 한 줄로 펼치기 위해 콘텐츠가 스스로 넓어지도록 */
  min-width: max-content;

  .legend-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 90px;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
    &.active {
      opacity: 1;
    }
  }

  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    display: inline-block;
  }
  .label {
    font-size: 14px;
  }
  .value {
    margin-top: 6px;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.2px;
    opacity: 0.95;
  }
  .pill {
    margin-top: 8px;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    background: rgba(56, 189, 113, 0.18);
    color: #00c566;
  }
  .pill.down {
    background: rgba(239, 68, 68, 0.18);
    color: #ff6b6b;
  }
`;
export const CategoryPanel = styled.div`
  width: 300px;
  color: #fff;

  .section-title {
    color: #b8a9ff;
    letter-spacing: 1px;
    font-size: 12px;
    margin: 8px 0 16px;
  }

  .line1 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .chip {
    display: inline-block;
    padding: 6px 10px;
    border-radius: 999px;
    color: #2a2356;
    text-align: center;
    text-justify: center;
  }

  .helper {
    opacity: 0.9;
    margin: 8px 0 16px;
  }

  .row {
    display: grid;
    grid-template-columns: 36px 100px 1fr;
    align-items: center;
    gap: 10px;
    margin: 8px 0;
  }

  .month {
    opacity: 0.9;
    font-weight: 700;
  }
  .color-chip {
    height: 18px;
    border-radius: 6px;
    opacity: 0.9;
  }
  .amount {
    justify-self: end;
    font-size: 20px;
    font-weight: 800;
  }
  .row.current .amount {
    color: #f0a9ff;
  }
`;

export const SavingsBanner = styled.div`
  width: 300px;
  border-radius: 16px;
  padding: 14px 16px;
  margin-top: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  background: rgba(56, 189, 113, 0.18);
  color: #00c566;
  margin-bottom: 50px;

  &.increase {
    background: rgba(239, 68, 68, 0.18);
    color: #ff6b6b;
  }

  .emoji {
    font-size: 18px;
  }
`;

export const CardButton = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  text-align: center;
  align-items: center;
  justify-content: center;
  background-color: var(--color-button-primary);
  border-radius: var(--radius-button);
  color: white;
`;

export const Text = styled.div`
  color: white;
  text-align: center;
`;
