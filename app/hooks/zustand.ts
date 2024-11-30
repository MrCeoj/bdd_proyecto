import { create } from 'zustand';

// Define Clase and FiltersState interfaces
interface Clase {
  id: number;
  nombre: string;
  costo: number;
  sucursal: string;
}

interface FiltersState {
  rows: Clase[]; // Rows for the results
  dias: string[];
  sucursales: string[];
  costos: [number, number];
  search: string;

  // Actions
  setRows: (rows: Clase[]) => void;
  setDias: (dias: string[]) => void;
  setSucursales: (sucursales: string[]) => void;
  setCostos: (costos: [number, number]) => void;
  setSearch: (search: string) => void;

  // Utility actions
  resetFilters: () => void;
  updateFilter: (filterType: 'dias' | 'sucursales' | 'costos' | 'search', value: string[] | [number, number] | string) => void;
}

// Create the Zustand store
const useFiltersStore = create<FiltersState>((set) => ({
  // Initial state
  rows: [],
  dias: [],
  sucursales: [],
  costos: [200, 500],
  search: "",

  // Actions to update the state
  setRows: (rows) => set({ rows }),
  setDias: (dias) => set({ dias }),
  setSucursales: (sucursales) => set({ sucursales }),
  setCostos: (costos) => set({ costos }),
  setSearch: (search) => set({ search }),

  // Reset all filters to initial state
  resetFilters: () => set({
    rows: [],
    dias: [],
    sucursales: [],
    costos: [200, 500],
    search: ""
  }),

  // Flexible update method for any filter
  updateFilter: (filterType, value) => set((state) => ({
    ...state,
    [filterType]: value
  }))
}));

export default useFiltersStore;
