import { atom, getDefaultStore } from 'jotai';
import type { User } from '../schemas/account-types';



// Jotai store global (utile hors React, ex: dans une fonction)
const store = getDefaultStore();


export const viewedUserAtom = atom<User | null>(null);
export const currentUsersListAtom = atom<string | 'invited' | 'all'>("all");