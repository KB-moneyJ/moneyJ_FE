import type { OrgOption } from './types';

export const CARD_COMPANIES: OrgOption[] = [
  { code: '0301', name: 'KB카드' },
  { code: '0302', name: '현대카드' },
  { code: '0303', name: '삼성카드' },
  { code: '0304', name: 'NH카드' },
  { code: '0305', name: 'BC카드' },
  { code: '0306', name: '신한카드' },
  { code: '0307', name: '씨티카드' },
  { code: '0309', name: '우리카드' },
  { code: '0311', name: '롯데카드' },
  { code: '0313', name: '하나카드' },
  { code: '0315', name: '전북카드' },
  { code: '0316', name: '광주카드' },
  { code: '0320', name: '수협카드' },
  { code: '0321', name: '제주카드' },
];

export const CARD_NAME_BY_CODE: Record<string, string> = Object.fromEntries(
  CARD_COMPANIES.map((c) => [c.code, c.name]),
);
