import styled from 'styled-components';

export const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-top: 78px;
  font-size: 18px;
  user-select: none;
`;

export const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  margin-top: 40px;
  padding: 0 30px;
  border: none;
  .recharts-wrapper:focus,
  .recharts-wrapper *:focus,
  .recharts-surface:focus,
  .recharts-bar-rectangle path:focus {
    outline: none !important;
  }

  .recharts-wrapper svg {
    -webkit-tap-highlight-color: transparent;
  }
`;

export const LegendWrapper = styled.div`
  display: flex;
  gap: 28px;
  justify-content: center;
  align-items: flex-start;
  margin-top: 16px;
  color: #fff;
  margin-bottom: 8px;

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
    background: rgba(56, 189, 113, 0.18); /* 연한 초록 */
    color: #00c566;
  }

  .pill.down {
    background: rgba(239, 68, 68, 0.18);
    color: #ff6b6b;
  }
`;
export const CategoryPanel = styled.div`
  margin: 20px 24px 20px;
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
  margin: 14px 24px 24px;
  border-radius: 16px;
  padding: 14px 16px;
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
