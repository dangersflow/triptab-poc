import { create } from "zustand";

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

interface StoreState {
  runningTotal: number;
  receiptItems: ReceiptItem[];
  setRunningTotal: (value: number) => void;
  addReceiptItems: (items: ReceiptItem[]) => void;
  removeReceiptItem: (id: string) => void;
  clearReceiptItems: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  runningTotal: 0,
  receiptItems: [],
  setRunningTotal: (value) => set({ runningTotal: value }),
  addReceiptItems: (items) => {
    const currentItems = get().receiptItems;
    const currentTotal = get().runningTotal;
    const itemsTotal = items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    set({
      receiptItems: [...currentItems, ...items],
      runningTotal: currentTotal + itemsTotal,
    });
  },
  removeReceiptItem: (id) => {
    const currentItems = get().receiptItems;
    const currentTotal = get().runningTotal;
    const itemToRemove = currentItems.find((item) => item.id === id);

    if (itemToRemove) {
      const itemTotal = itemToRemove.price * (itemToRemove.quantity || 1);
      set({
        receiptItems: currentItems.filter((item) => item.id !== id),
        runningTotal: currentTotal - itemTotal,
      });
    }
  },
  clearReceiptItems: () => set({ receiptItems: [], runningTotal: 0 }),
}));

export default useStore;
