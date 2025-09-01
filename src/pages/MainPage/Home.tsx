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
        destination="Sydney, Australia"
        countryCode="AU"
        period="2026.01.10 - 2026.01.20"
        thumbnailUrl="https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        progressPercent={0}
        onClickDetail={() => console.log('시드니 상세보기 클릭')}
      />
      <TripCard
        destination="Paris, France"
        countryCode="FR"
        period="2025.12.24 - 2025.12.31"
        thumbnailUrl="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=640&auto=format&fit=crop"
        progressPercent={60}
        onClickDetail={() => console.log('상세보기 클릭')}
      />
      <TripCard
        destination="Tokyo, Japan"
        countryCode="JP"
        period="2025.10.05 - 2025.10.12"
        thumbnailUrl="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
        progressPercent={100}
        onClickDetail={() => console.log('도쿄 상세보기 클릭')}
      />
    </div>
  );
}
