import { useMemo, useState } from 'react';
import TripCard from '@/pages/MainPage/sections/TripCard/TripCard';
import CompletedTripCard from '@/pages/MainPage/sections/TripCard/CompletedTripCard';
import { Page, Tabs, Track, ActiveBg, SegTab, CardWrap } from './Plan.style';
import UsersBadge from '@/pages/MainPage/sections/TripCard/UsersBadge';

type Trip = {
  id: string;
  destination: string;
  countryCode?: string;
  period: string;
  thumbnailUrl: string;
  progressPercent: number;
  members?: number;
};

export default function Plan() {
  const trips: Trip[] = [
    {
      id: 'sydney-2026-01',
      destination: 'Sydney, Australia',
      countryCode: 'AU',
      period: '2026.01.10 - 2026.01.20',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?q=80&w=2071&auto=format&fit=crop',
      progressPercent: 0,
      members: 1,
    },
    {
      id: 'paris-2025-12',
      destination: 'Paris, France',
      countryCode: 'FR',
      period: '2025.12.24 - 2025.12.31',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=640&auto=format&fit=crop',
      progressPercent: 60,
      members: 1,
    },
    {
      id: 'tokyo-2025-10',
      destination: 'Tokyo, Japan',
      countryCode: 'JP',
      period: '2025.10.05 - 2025.10.12',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
      progressPercent: 90,
      members: 4,
    },
    {
      id: 'kyoto-2024-12',
      destination: 'Kyoto, Japan',
      countryCode: 'JP',
      period: '2024.01.24 - 2024.12.31',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1449452198679-05c7fd30f416?q=80&w=2070&auto=format&fit=crop',
      progressPercent: 100,
      members: 2,
    },
  ];

  const [tab, setTab] = useState<'ongoing' | 'done'>('ongoing');

  const ongoing = useMemo(() => trips.filter((t) => t.progressPercent < 100), [trips]);
  const done = useMemo(() => trips.filter((t) => t.progressPercent >= 100), [trips]);

  return (
    <Page>
      <Tabs>
        <Track>
          <ActiveBg $tab={tab} />
          <SegTab $active={tab === 'ongoing'} onClick={() => setTab('ongoing')}>
            진행중인 플랜
          </SegTab>
          <SegTab $active={tab === 'done'} onClick={() => setTab('done')}>
            완료한 플랜
          </SegTab>
        </Track>
      </Tabs>

      {tab === 'ongoing' &&
        ongoing.map((t) => (
          <CardWrap key={t.id}>
            <TripCard
              tripId={t.id}
              destination={t.destination}
              countryCode={t.countryCode}
              period={t.period}
              thumbnailUrl={t.thumbnailUrl}
              progressPercent={t.progressPercent}
              onClickDetail={() => console.log(`${t.destination} 상세보기`)}
            />
            <UsersBadge count={t.members} />
          </CardWrap>
        ))}

      {tab === 'done' &&
        done.map((t) => (
          <CardWrap key={t.id}>
            <CompletedTripCard
              tripId={t.id}
              destination={t.destination}
              countryCode={t.countryCode}
              period={t.period}
              thumbnailUrl={t.thumbnailUrl}
              onClickDetail={() => console.log(`${t.destination} 상세보기`)}
            />
            <UsersBadge count={t.members} />
          </CardWrap>
        ))}
    </Page>
  );
}
