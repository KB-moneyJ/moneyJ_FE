import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Overlay = styled(motion.div)`
    position: fixed;
    inset: 0;

    /* 배경도 살짝 유리 느낌 */
    background: rgba(0, 0, 0, 0.35);

    display: grid;
    place-items: center;
    z-index: 1000;
`;

export const Dialog = styled(motion.div)`
    width: 90%;
    max-width: 340px;
    padding: 24px 20px;
    border-radius: 16px;

    /* 💎 유리 핵심 */
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);

    /* 유리 테두리 + 광택 */
    border: 1px solid rgba(255, 255, 255, 0.8);

    box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
`;

export const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    padding-bottom: 6px;

    /* 유리 위에 얇은 구분선 */
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
`;

export const Logo = styled.img`
    width: 15px;
    height: auto;
    object-fit: contain;
`;

export const Title = styled.h3`
    font-size: 18px;
    color: white;
`;

export const Description = styled.p`
    margin: 10px 0 20px;
    font-size: 14px;
    color: white;

    line-height: 1.5;
`;

export const Actions = styled.div`
    display: flex;
    gap: 10px;
`;

const BaseButton = styled.button`
    flex: 1;
    padding: 12px 0;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: 0.15s;

    &:active {
        transform: scale(0.97);
    }
`;

export const CancelButton = styled(BaseButton)`
    background: rgba(235, 120, 238, 0.85);
    backdrop-filter: blur(6px);
    color: white;
`;

export const ConfirmButton = styled(BaseButton)`
    background: rgba(120, 61, 186, 0.85);
    backdrop-filter: blur(6px);
    color: white;
`;
