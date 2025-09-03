import styled from 'styled-components';

import TripCard from './TripCard';
import UsersBadge from './UsersBadge';
import CompletedStamp from '@/assets/images/completed-stamp.svg';

type Props = React.ComponentProps<typeof TripCard>;

export default function CompletedTripCard(props: Omit<Props, 'progressPercent'>) {
  return (
    <Wrap>
      <TripCard {...props} progressPercent={100} />
      <StampImg src={CompletedStamp} alt="Completed" />
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
`;

const StampImg = styled.img`
  position: absolute;
  top: 23%;
  left: 22%;
  width: clamp(180px, 40%, 300px);
  transform: rotate(-12deg);
  pointer-events: none;
  z-index: 2;
`;
