import { create } from "zustand";

interface StoreState {
  runningTotal: number;
  setRunningTotal: (value: number) => void;
}

export const useStore = create<StoreState>((set) => ({
  runningTotal: 0,
  setRunningTotal: (value) => set({ runningTotal: value }),
}));

export default useStore;
