import styled from 'styled-components';
import Card from '@/components/common/Card/Card';

export const Wrapper = styled(Card)`
  margin: 1rem;
  padding: 1rem 1.25rem;
  color: white;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
`;

export const TitleBadge = styled.span`
  color: var(--color-text-highlight);
  font-weight: 800;
  letter-spacing: 0.2px;
`;

export const TitleDestination = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
`;

export const Divider = styled.hr`
  margin: 0.7rem 0 1rem;
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.35),
    rgba(255, 255, 255, 0)
  );
`;

export const Section = styled.section`
  & + & {
    margin-top: 1rem;
  }
`;

export const SectionTitle = styled.h4`
  margin: 0 0 0.6rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 1rem;
  font-weight: 800;

  & > svg {
    width: 1.05rem;
    height: 1.05rem;
    flex-shrink: 0;
  }

  &[data-variant='warning'] {
    color: #ffd166;
    font-weight: 800;
  }
`;

export const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  row-gap: 0.4rem;
  list-style: disc;
`;

export const ListItem = styled.li`
  line-height: 1.45;
  opacity: 0.95;
  word-break: keep-all;
`;
