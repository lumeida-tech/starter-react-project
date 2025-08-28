import { handleHttpRequest } from "@/lib/http-client";
import type {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignUpSchema,
} from "../schemas";

/**
 * Requête d'inscription d'un utilisateur
 *
 * Envoie les données d'inscription d'un nouvel utilisateur au serveur
 * pour créer un compte.
 */
export function signUpRequest(
  data: SignUpSchema,
  invitationToken: string | null
) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/register",
    payload: data,
    queryParams: {
      redirected_url:
        import.meta.env.VITE_APP_URL + "/activate-account" || "",
      origin: invitationToken ?? "",
    },
  });
}

/**
 * Requête de connexion d'un utilisateur
 * 
 * Envoie les identifiants de l'utilisateur au serveur pour
 * authentifier et établir une session.
 */
export function signInRequest(data: any) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/login",
    payload: data,
    queryParams: {
      redirected_url:
        import.meta.env.VITE_APP_URL + "/activate-account" || "",
    },
  });
}

/**
 * Requête de récupération de mot de passe
 * 
 * Envoie l'adresse email de l'utilisateur au serveur pour
 * initier le processus de réinitialisation de mot de passe.
 */
export function forgotPasswordRequest(data: ForgotPasswordSchema) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/forgot-password",
    queryParams: {
      email: data.email,
      redirected_url: import.meta.env.VITE_APP_URL + "/reset-password" || "",
    },
  });
}

/**
 * Requête de réinitialisation de mot de passe
 * 
 * Envoie le nouveau mot de passe et le token de validation au serveur
 * pour finaliser la réinitialisation du mot de passe.
 */
export function resetPasswordRequest(data: ResetPasswordSchema, token: string) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/reset-password",
    payload: data,
    queryParams: {
      token: token,
    },
  });
}

/**
 * Requête pour renvoyer l'email d'activation
 * 
 * Envoie une requête pour renvoyer l'email d'activation
 * à l'utilisateur.
 */
export function resendActivationEmailRequest(email: string) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/send-activation-email",
    queryParams: {
      email,
      redirected_url:
        import.meta.env.VITE_APP_URL + "/activate-account" || "",
    },
  });
}

/**
 * Requête pour la déconnexion
 * 
 * Envoie une requête pour la déconnexion
 * à l'utilisateur.
 */
export function logoutRequest() {
  return handleHttpRequest({
    method: "DELETE",
    endpoint: "/api/auth/logout",
  });
}

/**
 * Requête pour l'activation du compte
 * 
 * Envoie une requête pour l'activation du compte
 * à l'utilisateur.
 */
export function activateAccountRequest(token: string) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/activation/" + token,
  });
}

/**
 * Requête pour la connexion avec Google
 * 
 * Envoie une requête pour la connexion avec Google
 * à l'utilisateur.
 */
export function googleLoginRequest(redirectUrl: string) {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/auth/google/login",
    queryParams: {
      redirection_url: redirectUrl,
    },
  });
}

/**
 * Requête pour la connexion avec AXMARIL
 * 
 * Envoie une requête pour la connexion avec AXMARIL
 * à l'utilisateur.
 */
export function axmarilLoginRequest(redirectUrl: string) {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/auth/axmaril/login-redirect",
    queryParams: {
      redirection_url: redirectUrl,
    },
  });
}

/**
 * Requête de rappel de connexion avec AXMARIL
 * 
 * Envoie une requête pour le rappel de connexion avec AXMARIL
 * à l'utilisateur.
 */
export function axmarilLoginCallbackRequest(token: string) {
    return handleHttpRequest({
        method: "POST",
        endpoint: "/api/auth/axmaril/login",
        queryParams: {
            axmaril_token: token
        },
    });
}

/**
 * Requête pour la récupération des services ajouté
 * par le client dans le panier
 * 
 * Envoie une requête pour la récupération des services
 * 
 */
export function getServiceInCartRequest() {
    return handleHttpRequest({
        method: "GET",
        endpoint: "/api/auth/shopping-cart"
    });
}

/**
 * Requête pour Sauvegarder les services sélectionné
 * par le client dans le panier
 * 
 * Envoie une requête pour la sauvegarde des services
 * 
 */
export function saveServiceInCartRequest(payload: object) {
    return handleHttpRequest({
        method: "PUT",
        endpoint: "/api/auth/shopping-cart",
        payload: payload,
    });
}


/**
 * Requête pour la récupération des informations de l'utilisateur
 *
 * Envoie une requête pour la récupération des informations de l'utilisateur
 * à l'utilisateur.
 */
export function getUserInfoRequest() {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/auth/info",
  });
}
