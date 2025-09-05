import logo from '@/assets/images/moneyJ-Logo.png';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrapper,
  LogoContainer,
  Logo,
  TextContainer,
  Text,
  AgreementContainer,
  AllAgreeLabel,
  HiddenCheckbox,
  CustomCheckboxLabel,
  CustomCheckbox,
  Item,
  HeaderRow,
  Left,
  Title,
  Arrow,
  ContentBox,
  NextButton,
} from './Agree.style';

export default function Agree() {
  const [agreements, setAgreements] = useState({
    all: false,
    personalInfo: false,
    processing: false,
  });

  const [open, setOpen] = useState({
    personalInfo: false,
    processing: false,
  });

  const isAllRequiredChecked = useMemo(
    () => agreements.personalInfo && agreements.processing,
    [agreements.personalInfo, agreements.processing],
  );

  const handleChange = (name: keyof typeof agreements) => {
    if (name === 'all') {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        personalInfo: newValue,
        processing: newValue,
      });
    } else {
      const newValue = !agreements[name];
      const updated = { ...agreements, [name]: newValue };
      updated.all = updated.personalInfo && updated.processing;
      setAgreements(updated);
    }
  };

  const toggleOpen = (name: keyof typeof open) => {
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  const navigation = useNavigate();
  const goToIntro = () => {
    navigation('/intro');
  };

  return (
    <Wrapper>
      <LogoContainer>
        <Logo src={logo} alt="moneyJ-Logo" draggable={false} />
      </LogoContainer>

      <TextContainer>
        <Text>여행을 향한 첫 걸음,</Text>
        <Text>지금 시작해보세요</Text>
      </TextContainer>

      <AgreementContainer>
        <AllAgreeLabel className="all-agree">
          <HiddenCheckbox
            id="allAgree"
            checked={agreements.all}
            onChange={() => handleChange('all')}
          />
          <CustomCheckboxLabel
            htmlFor="allAgree"
            onClick={(e) => e.stopPropagation()}
            aria-label="약관 전체동의"
          >
            <CustomCheckbox checked={agreements.all} />
          </CustomCheckboxLabel>
          약관 전체동의
        </AllAgreeLabel>

        <Item>
          <HiddenCheckbox
            id="personalInfo"
            checked={agreements.personalInfo}
            onChange={() => handleChange('personalInfo')}
          />
          <HeaderRow
            role="button"
            tabIndex={0}
            aria-expanded={open.personalInfo}
            aria-controls="section-personalInfo"
            onClick={() => toggleOpen('personalInfo')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') toggleOpen('personalInfo');
            }}
          >
            <Left>
              <CustomCheckboxLabel
                htmlFor="personalInfo"
                onClick={(e) => e.stopPropagation()}
                aria-label="개인 정보 수집 및 이용 동의 체크"
              >
                <CustomCheckbox checked={agreements.personalInfo} />
              </CustomCheckboxLabel>
              <Title>개인 정보 수집 및 이용 동의 (필수)</Title>
            </Left>
            <Arrow $open={open.personalInfo} aria-hidden>
              ▸
            </Arrow>
          </HeaderRow>

          <ContentBox id="section-personalInfo" $open={open.personalInfo}>
            <ul>
              <p>목적: 회원가입 시 본인 확인 및 이메일 인증 발송</p>
              <p>항목: 이름, 이메일, 연락처</p>
              <p>보유·이용 기간: 회원 탈퇴 시까지 (관련 법령에 따라 일정 기간 보관 가능)</p>
            </ul>
          </ContentBox>
        </Item>
        <Item>
          <HiddenCheckbox
            id="processing"
            checked={agreements.processing}
            onChange={() => handleChange('processing')}
          />

          <HeaderRow
            role="button"
            tabIndex={0}
            aria-expanded={open.processing}
            aria-controls="section-processing"
            onClick={() => toggleOpen('processing')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') toggleOpen('processing');
            }}
          >
            <Left>
              <CustomCheckboxLabel
                htmlFor="processing"
                onClick={(e) => e.stopPropagation()}
                aria-label="개인 정보 처리 위탁 동의 체크"
              >
                <CustomCheckbox checked={agreements.processing} />
              </CustomCheckboxLabel>
              <Title>개인 정보 처리 위탁 동의 (필수)</Title>
            </Left>
            <Arrow $open={open.processing} aria-hidden>
              ▸
            </Arrow>
          </HeaderRow>

          <ContentBox id="section-processing" $open={open.processing}>
            <ul>
              <p>위탁받는 자: ㈜OOO</p>
              <p>위탁 업무: 서비스 운영, 고객 지원</p>
              <p>보유·이용 기간: 회원 탈퇴 시까지</p>
            </ul>
          </ContentBox>
        </Item>
      </AgreementContainer>
      {isAllRequiredChecked && <NextButton onClick={goToIntro}>다음</NextButton>}
    </Wrapper>
  );
}
