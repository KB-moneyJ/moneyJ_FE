import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CardState {
  cardConnected: boolean;
  setCardConnected: (value: boolean) => void;
}

export const useCardStore = create<CardState>()(
  persist(
    (set) => ({
      cardConnected: false,
      setCardConnected: (value) => set({ cardConnected: value }),
    }),
    {
      name: 'card-storage', // localStorage key 이름
    },
  ),
);
