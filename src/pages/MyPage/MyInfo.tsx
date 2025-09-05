import { useState } from 'react';
import {
  Page,
  Header,
  PowerBtn,
  ProfileWrap,
  AvatarCircle,
  AvatarIcon,
  EditBadge,
  Username,
  Form,
  Field,
  LabelRow,
  Label,
  InputUnderline,
  Helper,
  EmailRow,
  VerifyBtn,
  BtnGroup,
  SecondaryBtn,
  PrimaryBtn,
  LogoutBtn,
  Item,
} from './MyInfo.style';
import { FiPower } from 'react-icons/fi';
import { FiLogOut } from 'react-icons/fi';
import { FiEdit2 } from 'react-icons/fi';
import BottomNavigationBar from '@/components/common/BottomNavigationBar/BottomNavigationBar';

export default function Myinfo() {
  const [nickname, setNickname] = useState('USERNAME');
  const [userId] = useState('moneymoney');
  const [password, setPassword] = useState('********');
  const [password2, setPassword2] = useState('********');
  const [email, setEmail] = useState('money123@gamil.com');

  return (
    <div>
      <Page>
        <Header>
          <div />
        </Header>

        <ProfileWrap>
          <AvatarCircle>
            <AvatarIcon>👤</AvatarIcon>
            <EditBadge>
              <FiEdit2 size={12} />
            </EditBadge>
          </AvatarCircle>
          <Username>USERNAME</Username>
        </ProfileWrap>

        {/* <Form> */}
        {/* 닉네임
          <Field>
            <LabelRow>
              <Label>닉네임</Label>
            </LabelRow>
            <InputUnderline
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
            />
          </Field> */}

        {/* 아이디 (읽기 전용)
          <Field>
            <Label>아이디</Label>
            <InputUnderline value={userId} readOnly $readonly />
          </Field> */}

        {/* 비밀번호
          <Field>
            <Label>비밀번호</Label>
            <InputUnderline
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="특수문자, 숫자/문자 포함 (8자 이상)"
            />
            <Helper>특수문자, 숫자/문자 포함 (8자 이상)</Helper>
          </Field> */}

        {/* 비밀번호 확인
          <Field>
            <Label>비밀번호 확인</Label>
            <InputUnderline
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </Field> */}

        {/* 이메일 + 인증 버튼
          <Field>
            <Label>이메일</Label>
            <EmailRow>
              <InputUnderline
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
              />
              <VerifyBtn type="button">인증</VerifyBtn>
            </EmailRow>
          </Field> */}
        {/* 
          <BtnGroup>
            <SecondaryBtn type="button">수정하기</SecondaryBtn>
            <PrimaryBtn type="button">변경사항 저장</PrimaryBtn>
          </BtnGroup> */}
        {/* </Form> */}
        <LogoutBtn type="button">
          <Item>
            <FiLogOut />
            <span>로그아웃</span>
          </Item>
        </LogoutBtn>
      </Page>
      <BottomNavigationBar />
    </div>
  );
}
