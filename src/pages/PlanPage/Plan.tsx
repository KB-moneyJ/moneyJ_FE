import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripCard from '@/pages/MainPage/sections/TripCard/TripCard';
import CompletedTripCard from '@/pages/MainPage/sections/TripCard/CompletedTripCard';
import { Page, Tabs, Track, ActiveBg, SegTab, CardWrap } from './Plan.style';
import UsersBadge from '@/pages/MainPage/sections/TripCard/UsersBadge';
import BottomNavigationBar from '@/components/common/BottomNavigationBar/BottomNavigationBar';
import { useTripPlans } from '@/api/trips/queries';

export default function Plan() {
  const navigate = useNavigate();
  const { data: trips = [], isLoading, isError } = useTripPlans();

  const [tab, setTab] = useState<'ongoing' | 'done'>('ongoing');

  const ongoing = useMemo(() => trips.filter((t) => t.progressPercent < 100), [trips]);
  const done = useMemo(() => trips.filter((t) => t.progressPercent >= 100), [trips]);

  return (
    <div>
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

        {isLoading && <div style={{ padding: '1rem', opacity: 0.8 }}>여행 플랜 불러오는 중…</div>}
        {isError && (
          <div style={{ padding: '1rem', color: '#ff8a8a' }}>
            여행 플랜을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </div>
        )}

        {!isLoading && !isError && tab === 'ongoing' && ongoing.length === 0 && (
          <div style={{ padding: '1rem', opacity: 0.85 }}>
            진행중인 플랜이 없어요. 새 플랜을 만들어 보세요!
            <div style={{ marginTop: '0.5rem' }}>
              <button
                onClick={() => navigate('/startplan')}
                style={{
                  padding: '0.6rem 0.9rem',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                여행 계획 만들기
              </button>
            </div>
          </div>
        )}

        {!isLoading && !isError && tab === 'done' && done.length === 0 && (
          <div style={{ padding: '1rem', opacity: 0.85 }}>완료한 플랜이 아직 없어요.</div>
        )}

        {!isLoading &&
          !isError &&
          tab === 'ongoing' &&
          ongoing.map((t) => (
            <CardWrap key={t.id}>
              <TripCard
                tripId={t.id}
                destination={t.destination}
                countryCode={t.countryCode}
                period={t.period}
                thumbnailUrl={t.thumbnailUrl}
                progressPercent={t.progressPercent}
                onClickDetail={() => navigate(`/trip/${t.id}`)}
              />
              <UsersBadge count={t.membersCount} />
            </CardWrap>
          ))}

        {!isLoading &&
          !isError &&
          tab === 'done' &&
          done.map((t) => (
            <CardWrap key={t.id}>
              <CompletedTripCard
                tripId={t.id}
                destination={t.destination}
                countryCode={t.countryCode}
                period={t.period}
                thumbnailUrl={t.thumbnailUrl}
                onClickDetail={() => navigate(`/trip/${t.id}`)}
              />
              <UsersBadge count={t.membersCount} />
            </CardWrap>
          ))}
      </Page>
      <BottomNavigationBar />
    </div>
  );
}
