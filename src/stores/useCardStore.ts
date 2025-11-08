import { create } from 'zustand';

interface CardState {
  cardConnected: boolean;
  setCardConnected: (value: boolean) => void;
}

export const useCardStore = create<CardState>((set) => ({
  cardConnected: false,
  setCardConnected: (value) => set({ cardConnected: value }),
}));
