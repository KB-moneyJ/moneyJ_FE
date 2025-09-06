import logoJ from '@/assets/images/moneyJ-Logo.png';
import {
  AssetCardContainer,
  AssetHeader,
  AssetTitle,
  AssetBody,
  AssetLeft,
  BrandAvatar,
  BrandMark,
  Amount,
  SaveBtn,
} from './AssetCard.style';

export default function AssetCard() {
  return (
    <AssetCardContainer>
      <AssetHeader>
        <AssetTitle>MY 자산</AssetTitle>
      </AssetHeader>

      <AssetBody>
        <AssetLeft>
          <BrandAvatar>
            <BrandMark src={logoJ} alt="MoneyJ 로고" />
          </BrandAvatar>
          <Amount>1,031,000원</Amount>
        </AssetLeft>

        <SaveBtn>저축</SaveBtn>
      </AssetBody>
    </AssetCardContainer>
  );
}
