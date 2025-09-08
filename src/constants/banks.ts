import type { OrgOption } from './types';

export const BANKS: OrgOption[] = [
  { code: '0002', name: '산업은행' },
  { code: '0003', name: '기업은행' },
  { code: '0004', name: '국민은행' },
  { code: '0007', name: '수협은행' },
  { code: '0011', name: '농협은행' },
  { code: '0020', name: '우리은행' },
  { code: '0023', name: 'SC은행' },
  { code: '0027', name: '씨티은행' },
  { code: '0031', name: '대구은행' },
  { code: '0032', name: '부산은행' },
  { code: '0034', name: '광주은행' },
  { code: '0035', name: '제주은행' },
  { code: '0037', name: '전북은행' },
  { code: '0039', name: '경남은행' },
  { code: '0045', name: '새마을금고' },
  { code: '0048', name: '신협은행' },
  { code: '0071', name: '우체국' },
  { code: '0081', name: 'KEB하나은행' },
  { code: '0088', name: '신한은행' },
  { code: '0089', name: 'K뱅크' },
];

// 빠른 조회용 맵 (코드 → 이름)
export const BANK_NAME_BY_CODE: Record<string, string> = Object.fromEntries(
  BANKS.map((b) => [b.code, b.name]),
);
