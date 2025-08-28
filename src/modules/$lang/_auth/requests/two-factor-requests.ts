import { handleHttpRequest } from "@/lib/http-client";

/**
 * Requête pour l'authentification à deux facteurs
 * 
 * Envoie une requête pour l'authentification à deux facteurs
 * à l'utilisateur.
 */
export function twoFactorAuthRequest(data: object, type?: "email" | "otp") {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/2FA/login",
    payload: data,
    queryParams: {
      fa_type: type || "otp",
    },
  });
}

/**
 * Requête pour la configuration de l'authentification à deux facteurs
 *
 * Envoie une requête pour la configuration de l'authentification à deux facteurs
 * à l'utilisateur.
 */
export function configureTwoFactorAuthRequest(
  data: object,
  type?: "email" | "otp"
) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/2FA/register",
    payload: data,
    queryParams: {
      fa_type: type || "otp",
    },
  });
}

/**
 * Requête pour la désactivation de l'authentification à deux facteurs
 *
 * Envoie une requête pour la désactivation de l'authentification à deux facteurs
 * à l'utilisateur.
 */
export function disableTwoFactorAuthRequest(
  data: object,
  type?: "email" | "otp"
) {
  return handleHttpRequest({
    method: "PUT",
    endpoint: "/api/auth/2FA/deactivate",
    payload: data,
    queryParams: {
      fa_type: type || "otp",
    },
  });
}

/**
 * Requête pour la configuration de l'authentification via WhatsApp
 * 
 * Envoie une requête pour la configuration de l'authentification via WhatsApp
 * à l'utilisateur.
 */
export function configureWhatsAppAuthRequest(data: object) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/configure-number",
    payload: data,
  });
}

/**
 * Requête pour la désactivation de l'authentification via WhatsApp
 * 
 * Envoie une requête pour la désactivation de l'authentification via WhatsApp
 * à l'utilisateur.
 */
export function disableWhatsAppAuthRequest(data: object) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/disable-number",
    payload: data,
  });
}

/**
 * Requête pour la validation du numéro WhatsApp
 *
 * Envoie une requête pour la validation du numéro WhatsApp
 * à l'utilisateur.
 */
export function validateWhatsAppNumberRequest(
  data: object,
  forUpdate: boolean = false
) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/valid-number",
    payload: data,
    queryParams: {
      update: forUpdate ? "yes" : "no",
    },
  });
}

/**
 * Requête pour l'authentification via code reçu sur WhatsApp
 *
 * Envoie une requête pour l'authentification via code reçu sur WhatsApp
 * à l'utilisateur.
 */
export function whatsappAuthRequest(data: object) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/number/login",
    payload: data,
  });
}

/**
 * Requête pour l'envoi du code de vérification via WhatsApp ou email
 *
 * Envoie une requête pour l'envoi du code de vérification via WhatsApp ou email
 * à l'utilisateur.
 */
export function sendOTPCodeRequest(email: string, type?: "email" | "number") {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/send-otp",
    queryParams: {
      email: email,
      fa_type: type || "number",
    },
  });
}

/**
 * Requête pour la mise à jour du numéro WhatsApp
 * 
 * Envoie une requête pour la mise à jour du numéro WhatsApp
 * à l'utilisateur.
 */
export function updateWhatsAppNumberRequest(data: object) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/update-number",
    payload: data,
  });
}
