import { atomWithStorage } from "jotai/utils";

/**
 * Langue par défaut
 */
export const langAtom = atomWithStorage<string>('lang', 'fr');

/**
 * Theme par défaut
 */
export const themeAtom = atomWithStorage<string>('theme', 'light');

