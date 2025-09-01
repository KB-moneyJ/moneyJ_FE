import AssetCard from './sections/AssetCard/AssetCard';
import UsageCard from './sections/UsageCard/UsageCard';
import TripCard from './sections/TripCard/TripCard';
import { Container, Profile, UserIcon, Nickname, BellIcon } from './Home.style';

export default function Home() {
  return (
    <div>
      <Container>
        <Profile>
          <UserIcon />
          <Nickname>USERNAME</Nickname>
        </Profile>
        <BellIcon />
      </Container>

      <AssetCard />
      <UsageCard />
      <TripCard
        destination="Paris, France"
        countryCode="FR"
        period="2025.12.24 - 2025.12.31"
        thumbnailUrl="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=640&auto=format&fit=crop"
        progressPercent={100}
        onClickDetail={() => console.log('상세보기 클릭')}
      />
    </div>
  );
}
