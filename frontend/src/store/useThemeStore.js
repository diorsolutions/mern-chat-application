import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "light",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    }));
  }
}));