import { AddTripCardContainer, PlusIcon, Title, Subtitle } from './AddTripCard.style';

interface AddTripCardProps {
  title?: string;
  subtitle?: string;
  onClick?: () => void;
}

export default function AddTripCard({
  title = '여행 계획 세우기',
  subtitle = '새로운 여행을 계획해보세요',
  onClick,
}: AddTripCardProps) {
  return (
    <AddTripCardContainer
      aria-label={title}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Space') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <PlusIcon />
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </AddTripCardContainer>
  );
}
