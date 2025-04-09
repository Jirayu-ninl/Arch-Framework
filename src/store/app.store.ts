import type { AppState } from './AppState'
import { create } from 'zustand'

/** Global store is here **/

export const useAppState = create<AppState>((set) => ({
  something: undefined,
  setSomething: (s) => set({ something: s }, false),
  onAppInit: async () => {
    // Initialize
  },
}))
