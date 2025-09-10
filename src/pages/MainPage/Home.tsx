import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssetCard from './sections/AssetCard/AssetCard';
import UsageCard from './sections/UsageCard/UsageCard';
import TripCard from './sections/TripCard/TripCard';
import AddTripCard from './sections/AddTripCard/AddTripCard';
import { Container, Profile, UserIcon, Nickname, BellIcon, AvatarImg } from './Home.style';
import BottomNavigationBar from '@/components/common/BottomNavigationBar/BottomNavigationBar';
import { useTripPlans } from '@/api/trips/queries';
import { useMe } from '@/api/users/queries';

export default function Home() {
  const navigate = useNavigate();
  const { data: trips = [], isLoading, isError } = useTripPlans();

  const { data: me, isLoading: meLoading, isError: meError } = useMe();

  const handleImgError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    (e.currentTarget as HTMLImageElement).style.display = 'none';
  };

  return (
    <div>
      <Container>
        <Profile style={{ ['--avatar-size' as any]: '2.5rem' }}>
          {me?.profileImage ? (
            <>
              <AvatarImg
                src={me.profileImage}
                alt={me.nickname || 'profile'}
                onError={handleImgError}
              />
              <UserIcon style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
            </>
          ) : (
            <UserIcon />
          )}

          <Nickname>{me?.nickname ?? (meLoading ? '불러오는 중…' : 'Guest')}</Nickname>
        </Profile>
        <BellIcon />
      </Container>

      {/* <AssetCard /> */}
      <UsageCard />

      {isLoading && <div style={{ padding: '1rem', opacity: 0.8 }}>여행 카드 불러오는 중…</div>}
      {isError && (
        <div style={{ padding: '1rem', color: '#ff8a8a' }}>
          여행 카드 불러오기에 실패했어요. 새로고침해 주세요.
        </div>
      )}

      {!isLoading &&
        !isError &&
        trips.map((t) => (
          <TripCard
            key={t.id}
            tripId={t.id}
            destination={t.destination}
            countryCode={t.countryCode}
            period={t.period}
            thumbnailUrl={t.thumbnailUrl}
            progressPercent={t.progressPercent}
            onClickDetail={() => navigate(`/trip/${t.id}`)}
          />
        ))}

      <AddTripCard onClick={() => navigate('/startplan')} />
      <BottomNavigationBar />
    </div>
  );
}
