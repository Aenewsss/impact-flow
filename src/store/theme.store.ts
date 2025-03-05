import { create } from 'zustand';

interface Store {
    theme: string
    toggleTheme: any
}


export const useThemeStore = create<Store>((set) => ({
    theme: typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark',

    toggleTheme: () => {
        set((state) => {
            const newTheme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            return { theme: newTheme };
        });
    },
}));