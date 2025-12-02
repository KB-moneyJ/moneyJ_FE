/* ================================================================== */
/* ========================== 스타일 ================================= */
/* ================================================================== */
import styled from "styled-components";

export const PageWrapper = styled.div`
    padding: 10px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const HeaderText = styled.h5`
    color: #fff;
    width: 100%;
    max-width: 360px;
    margin-bottom: 12px;
`;

export const GlassRow = styled.div`
    display: flex;
    gap: 6px;
    margin-bottom: 16px;
    width: 100%;
    max-width: 360px;
    flex-wrap: wrap;
`;

export const AirportBtn = styled.button<{ $selected: boolean }>`
    padding: 6px 8px;
    border-radius: 12px;
    border: none;
    font-weight: bold;
    cursor: pointer;

    background: ${({ $selected }) =>
  $selected ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)"};

    color: #fff;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.25);

    &:hover {
        background: rgba(255, 255, 255, 0.25);
    }
`;

export const FlightCard = styled.div`
    width: 343px;
    padding: 18px 18px 14px;
    margin-bottom: 16px;

    /* 네가 쓰던 유리알 스타일 그대로 */
    background: rgba(255, 255, 255, 0.18);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(20px);

    box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(255, 255, 255, 0.1),
            inset 0 0 4px 2px rgba(255, 255, 255, 0.2);

    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const CardTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const AirlineInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    .airline {
        font-weight: 700;
        font-size: 1.05rem;
    }
`;

export const LogoCircle = styled.div`
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: radial-gradient(circle at 30% 0%, #ffffff55, #ff7bedaa, #7f5dffdd);

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
`;

export const PriceText = styled.div`
    font-size: 1.2rem;
    font-weight: 800;
`;

export const Divider = styled.div`
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.35);
`;

export const Section = styled.div``;

export const SectionTitle = styled.div`
    font-weight: 700;
    opacity: 0.9;
    margin-bottom: 6px;
`;

export const RouteRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    .time {
        font-size: 0.95rem;
        font-weight: 600;
    }
`;

export const RouteSub = styled.div`
    opacity: 0.9;
    margin-top: 2px;
    font-size: 0.9rem;
`;

export const DurationText = styled.div`
    font-size: 0.85rem;
    opacity: 0.9;
`;

export const Analysis = styled.div`
    font-size: 0.9rem;

    .cheap {
        font-weight: 700;
        color: #4efc7b;
    }

    .expensive {
        font-weight: 700;
        color: #ff6b6b;
    }
`;

export const LoadingWrapper = styled.div`
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 0 10px;
`;

export const LoadingText = styled.p`
  color: #fff;
  margin-top: 14px;
  opacity: 0.85;
`;
