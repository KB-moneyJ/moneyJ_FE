import { useMemo } from 'react';
import {
  Wrapper,
  TitleRow,
  TitleBadge,
  TitleDestination,
  Divider,
  Section,
  SectionTitle,
  BulletList,
  ListItem,
} from './BeforeYouGoCard.style';
import { AlertTriangle, Plane } from 'lucide-react';

type Props = {
  destination: string;
  checklist?: string[];
  cautions?: string[];
};

export default function BeforeYouGoCard({ destination, checklist, cautions }: Props) {
  const cityOnly = useMemo(() => destination.split(',')[0]?.trim() || destination, [destination]);

  const showChecklist = (checklist?.length ?? 0) > 0;
  const showCautions = (cautions?.length ?? 0) > 0;
  if (!showChecklist && !showCautions) return null;

  return (
    <Wrapper>
      <TitleRow aria-label={`Before You Go: ${cityOnly}`}>
        <TitleBadge>Before You Go:</TitleBadge>
        <TitleDestination>{cityOnly}</TitleDestination>
      </TitleRow>

      <Divider />

      {showChecklist && (
        <Section>
          <SectionTitle>
            <Plane aria-hidden /> {cityOnly} 여행 준비물
          </SectionTitle>
          <BulletList role="list">
            {checklist!.map((item, i) => (
              <ListItem role="listitem" key={`${item}-${i}`}>
                {item}
              </ListItem>
            ))}
          </BulletList>
        </Section>
      )}

      {showCautions && (
        <Section>
          <SectionTitle data-variant="warning">
            <AlertTriangle aria-hidden /> 유의할 점
          </SectionTitle>
          <BulletList role="list">
            {cautions!.map((item, i) => (
              <ListItem role="listitem" key={`${item}-${i}`}>
                {item}
              </ListItem>
            ))}
          </BulletList>
        </Section>
      )}
    </Wrapper>
  );
}
