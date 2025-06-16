import { create } from 'zustand';

interface TenantState {
  selectedSchoolId: string | null;
  setSchoolId: (id: string | null) => void;
}

const useTenantStore = create<TenantState>((set) => ({
  selectedSchoolId: null,
  setSchoolId: (id) => set({ selectedSchoolId: id }),
}));

export default useTenantStore;
