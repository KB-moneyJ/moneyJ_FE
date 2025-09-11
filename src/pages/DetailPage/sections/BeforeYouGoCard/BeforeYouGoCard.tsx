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
import { AlertTriangle, Plane, Sparkles } from 'lucide-react';
import type { TipItem } from './parseTips';

type Props = {
  destination: string;
  checklist?: string[];
  cautions?: string[];
  tips?: TipItem[];
};

export default function BeforeYouGoCard({ destination, checklist, cautions, tips }: Props) {
  const cityOnly = useMemo(() => destination.split(',')[0]?.trim() || destination, [destination]);

  const showChecklist = (checklist?.length ?? 0) > 0;
  const showCautions = (cautions?.length ?? 0) > 0;
  const showTips = (tips?.length ?? 0) > 0;

  if (!showChecklist && !showCautions && !showTips) return null;

  return (
    <Wrapper>
      <TitleRow aria-label={`Before You Go: ${cityOnly}`}>
        <TitleBadge>Before You Go:</TitleBadge>
        <TitleDestination>{cityOnly}</TitleDestination>
      </TitleRow>

      <Divider />

      {/* {showChecklist && (
        <Section>
          <SectionTitle>
            <Plane aria-hidden /> {cityOnly} 여행 준비물
          </SectionTitle>
          <BulletList role="list">
            {checklist!.map((item, i) => (
              <ListItem role="listitem" key={`check-${i}`}>
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
              <ListItem role="listitem" key={`caution-${i}`}>
                {item}
              </ListItem>
            ))}
          </BulletList>
        </Section>
      )} */}

      {showTips && (
        <Section>
          <SectionTitle>
            <Sparkles aria-hidden /> 현지 꿀팁
          </SectionTitle>
          <BulletList role="list">
            {tips!.map((tip, i) => (
              <ListItem role="listitem" key={`tip-${i}`}>
                {tip.label ? <strong>{tip.label}:</strong> : null} {tip.text}
              </ListItem>
            ))}
          </BulletList>
        </Section>
      )}
    </Wrapper>
  );
}
