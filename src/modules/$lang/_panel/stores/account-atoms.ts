import { atom, getDefaultStore } from 'jotai';
import type { DataFor2FA } from '../schemas';

// ============================================================================
// STORE CONFIGURATION
// ============================================================================

/**
 * Store Jotai global pour les opérations hors React
 */
const store = getDefaultStore();

// État de l'authentification à deux facteurs
export const step2FAAtom = atom<number>(1);
export const show2FAConfigDialogAtom = atom<boolean>(false);
export const isWhatsAppNumberConfigDialogOpenAtom = atom<boolean>(false);
export const wantDisableWhatsAppAuthAtom = atom<boolean>(false);

/**
 * Données de configuration 2FA (secret OTP et QR code)
 */
export const dataFor2FAAtom = atom<DataFor2FA>({
  otp_secret: '',
  qr_url: ''
});


/**
 * Contrôle l'affichage du dialogue de configuration Email 2FA
 */
export const showEmail2FADialogAtom = atom<boolean>(false);

/**
 * Contrôle l'étape du processus de configuration 2FA via Email (1-2)
 */
export const email2FAStepAtom = atom<number>(1);

/**
 * Contrôle le processus de désactivation 2FA via Email
 */
export const disableEmail2FAAtom = atom<boolean>(false);

/**
 * Contrôle le processus de mise à jour 2FA via Email
 */
export const updateEmail2FAAtom = atom<boolean>(false);

/**
 * Contrôle l'affichage du dialogue de configuration WhatsApp
 */
export const isWhatsAppConfigDialogOpenAtom = atom<boolean>(false);

/**
 * Étape actuelle du processus de configuration 2FA (1-N)
 */
export const current2FAStepAtom = atom<number>(1);

/**
 * Indicateur de demande de désactivation de l'authentification WhatsApp
 */
export const whatsAppDisableRequestAtom = atom<boolean>(false);

// ============================================================================
// DERIVED ATOMS - État calculé
// ============================================================================

/**
 * Vérifie si les données 2FA sont complètement configurées
 */
export const is2FADataCompleteAtom = atom((get) => {
  const data = get(dataFor2FAAtom);
  return Boolean(data.otp_secret && data.qr_url);
});

// ============================================================================
// FONCTIONS D'ACTIONS - Actions complexes uniquement
// ============================================================================


