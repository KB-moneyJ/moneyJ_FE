import styled from 'styled-components';
import { ArrowLeft, EllipsisVertical } from 'lucide-react';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  margin-top: 1.25rem;
  position: relative;
`;

export const LeftIcon = styled(ArrowLeft)`
  width: 1.5rem;
  height: 1.5rem;
  color: white;
  cursor: pointer;
`;

export const RightIcon = styled(EllipsisVertical)`
  width: 1.5rem;
  height: 1.5rem;
  color: white;
  cursor: pointer;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 2rem;
  right: 0rem;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  min-width: 150px;
`;

export const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  text-align: left;
  color: black;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: #dbdadaff;
  }
`;
