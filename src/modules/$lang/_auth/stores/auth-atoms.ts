import { atom, getDefaultStore } from "jotai";
import type{  DataFor2FA, TwoFactorAuth, User } from "../schemas";

/**
 * Store Jotai global pour les opérations hors React
 */
const store = getDefaultStore();
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

// État de l'authentification à deux facteurs
export const step2FAAtom = atom<number>(1);
export const show2FAConfigDialogAtom = atom<boolean>(false);
export const isWhatsAppNumberConfigDialogOpenAtom = atom<boolean>(false);
export const wantDisableWhatsAppAuthAtom = atom<boolean>(false);

/**
 * État d'authentification de l'utilisateur
 */
export const isAuthenticatedAtom = atom<boolean>(false);

/**
 * Données de l'utilisateur connecté
 */
export const userAtom = atom<User | null>(null);

/**
 * Token d'invitation
 */
export const invitationTokenAtom = atom<string | null>(null);

/**
 * Configuration de l'authentification à deux facteurs
 */
export const twoFactorAuthAtom = atom<TwoFactorAuth>({
  appAuthEnabled: false,
  whatsappNumberEnabled: false,
  emailAuthEnabled: false,
});

/**
 * État de l'alerte de compte inactif
 */
export const inActiveAlertOpenAtom = atom<boolean>(false);

/**
 * État d'inscription réussie
 */
export const isSuccessfullyRegisteredAtom = atom<boolean>(false);

/**
 * État d'affichage de la 2FA
 */
export const show2FAAtom = atom<boolean>(false);

/**
 * État de soumission du formulaire de mot de passe oublié
 */
export const isForgotPasswordFormSubmittedAtom = atom<boolean>(false);

// ============================================================================
// DERIVED ATOMS - Calculs utiles
// ============================================================================

/**
 * Vérifie si l'utilisateur est admin
 */
export const isUserAdminAtom = atom((get) => {
  const user = get(userAtom);
  return user?.isAdmin || false;
});

/**
 * Vérifie si l'utilisateur a une authentification 2FA configurée
 */
export const has2FAConfiguredAtom = atom((get) => {
  const twoFactorAuth = get(twoFactorAuthAtom);
  return (
    twoFactorAuth.appAuthEnabled ||
    twoFactorAuth.whatsappNumberEnabled ||
    twoFactorAuth.emailAuthEnabled
  );
});

// ============================================================================
// FONCTIONS D'ACTIONS - Uniquement logout (reset global)
// ============================================================================

/**
 * Déconnexion complète (reset de l'état d'authentification)
 */
export function logout() {
  store.set(isAuthenticatedAtom, false);
  store.set(userAtom, null);
  store.set(twoFactorAuthAtom, {
    appAuthEnabled: false,
    whatsappNumberEnabled: false,
    emailAuthEnabled: false,
  });
  store.set(show2FAAtom, false);
  store.set(inActiveAlertOpenAtom, false);
  store.set(isSuccessfullyRegisteredAtom, false);
  store.set(isForgotPasswordFormSubmittedAtom, false);
}

/**
 * Vérifie si l'utilisateur a une authentification 2FA configurée
 */
export function has2FAConfigured(): boolean {
  return store.get(has2FAConfiguredAtom);
} 
