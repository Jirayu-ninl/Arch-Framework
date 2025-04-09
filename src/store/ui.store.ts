import type { UiState } from './UiState'
import { create } from 'zustand'
import { LANG } from './UiState'

/** Global store is here **/
export const useUiState = create<UiState>((set, get) => ({
  dark: true,
  setDark: (dark) => set(() => ({ dark: dark })),
  onToggleDark: () => set({ dark: !get().dark }),
  lang: LANG.TH,
  setLang: (lang) => set({ lang: lang }),
  modal: undefined,
  onToggleModal: (modal) =>
    set({
      modal: get().modal === modal ? undefined : modal,
    }),
  onClearModal: () => set({ modal: undefined }),
  cursor: undefined,
  setCursor: (cursor) => set(() => ({ cursor: cursor })),
  showNav: true,
  setShowNav: (show) => set(() => ({ showNav: show })),
  showFooter: true,
  setShowFooter: (show) => set(() => ({ showFooter: show })),
}))
