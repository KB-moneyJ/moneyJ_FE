import AssetCard from './sections/AssetCard/AssetCard';
import UsageCard from './sections/UsageCard/UsageCard';
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
    </div>
  );
}
