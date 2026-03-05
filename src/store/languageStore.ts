import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'hi' | 'te';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: 'en',
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: 'plantiq-language',
        }
    )
);

export const LANGUAGES = {
    en: { name: 'English', nativeName: 'English' },
    hi: { name: 'Hindi', nativeName: 'हिंदी' },
    te: { name: 'Telugu', nativeName: 'తెలుగు' },
};
