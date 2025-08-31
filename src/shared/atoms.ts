import { atomWithStorage } from "jotai/utils";
import { getDefaultStore } from "jotai";

/**
 * Store Jotai global pour les opérations hors React
 */
const store = getDefaultStore();
/**
 * Langue par défaut
 */
export const langAtom = atomWithStorage<string>('lang', 'en');

/**
 * Theme par défaut
 */
export const themeAtom = atomWithStorage<string>('theme', 'light');

/**
 * Vérifie si l'utilisateur a une authentification 2FA configurée
 */
export function getCurrentLang(): string {
    return store.get(langAtom);
} 