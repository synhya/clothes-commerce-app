import { persist } from 'zustand/middleware';
import { create } from 'zustand';

// 상태 타입 정의
interface SidebarState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const useSideBar = create(
  persist<SidebarState>(
    (set) => ({
      open: false,
      setOpen: (open) => set({ open }),
    }),
    {
      name: 'sidebar-storage',
    },
  ),
);

export default useSideBar;
