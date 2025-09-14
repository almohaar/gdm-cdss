import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  setSidebar: (open: boolean) => void;
}
export const useUI = create<UIState>(set => ({
  sidebarOpen: true,
  setSidebar: open => set({ sidebarOpen: open }),
}));
