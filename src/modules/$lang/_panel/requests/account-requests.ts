import { handleHttpRequest } from "@/lib/http-client";
import { objectToFormData } from "@/lib/utils";

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

/**
 * Requête pour la mise à jour des informations de l'utilisateur
 *
 * Envoie une requête pour la mise à jour des informations de l'utilisateur
 * à l'utilisateur.
 */
export function updateUserInfoRequest(data: object) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/update",
    payload: objectToFormData(data),
  });
}

/**
 * Requête pour la mise à jour du mot de passe de l'utilisateur
 *
 * Envoie une requête pour la mise à jour du mot de passe de l'utilisateur
 * à l'utilisateur.
 */
export function updatePasswordRequest(data: object) {
  return handleHttpRequest({
    method: "PUT",
    endpoint: "/api/auth/change-password",
    payload: data,
  });
}

/**
 * Requête pour la mise à jour des informations de l'entreprise
 *
 * Envoie une requête pour la mise à jour des informations de l'entreprise
 * à l'utilisateur.
 */
export function updateEnterpriseInfoRequest(data: object) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/update-enterprise",
    payload: objectToFormData(data),
  });
}

/**
 * Requête pour l'ajout des adresses email à mettre en copie
 *
 * Envoie une requête pour l'ajout des adresses email à mettre en copie
 * à l'utilisateur.
 */
export function addBillingEmailRecipientsRequest(
  data: { email: string; id?: string | null }[]
) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/email-address",
    payload: data,
  });
}

/**
 * Requête pour la récupération des adresses email à mettre en copie
 *
 * Envoie une requête pour la récupération des adresses email à mettre en copie
 * à l'utilisateur.
 */
export function getBillingEmailRecipientsRequest() {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/auth/email-addresses",
  });
}

/**
 * Requête pour la mise à jour des adresses email à mettre en copie
 *
 * Envoie une requête pour la mise à jour des adresses email à mettre en copie
 * à l'utilisateur.
 */
export function updateBillingEmailRecipientsRequest(data: object) {
  return handleHttpRequest({
    method: "PUT",
    endpoint: "/api/auth/email-address",
    payload: data,
  });
}

/**
 * Requête pour la suppression des adresses email à mettre en copie
 *
 * Envoie une requête pour la suppression des adresses email à mettre en copie
 * à l'utilisateur.
 */
export function deleteBillingEmailRecipientsRequest(payload: object) {
  return handleHttpRequest({
    method: "DELETE",
    endpoint: `/api/auth/email-address`,
    payload: payload,
  });
}

/**
 * Requête pour la récupération des adresses de facturation
 *
 * Envoie une requête pour la récupération des adresses de facturation
 * à l'utilisateur.
 */
export function getBillingAddressesRequest() {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/auth/billing-addresses",
  });
}

/**
 * Requête pour la mise à jour des adresses de facturation
 *
 * Envoie une requête pour la mise à jour des adresses de facturation
 * à l'utilisateur.
 */
export function updateBillingAddressesRequest(payload: object) {
  return handleHttpRequest({
    method: "PUT",
    endpoint: "/api/auth/billing-address",
    payload: payload,
  });
}

/**
 * Requête pour la suppression des adresses de facturation
 *
 * Envoie une requête pour la suppression des adresses de facturation
 * à l'utilisateur.
 */
export function deleteBillingAddressesRequest(payload: object) {
  return handleHttpRequest({
    method: "DELETE",
    endpoint: "/api/auth/billing-address",
    payload: payload,
  });
}

/**
 * Requête pour la création d'une adresse de facturation
 *
 * Envoie une requête pour la création d'une adresse de facturation
 * à l'utilisateur.
 */
export function createBillingAddressesRequest(payload: object) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/billing-address",
    payload: payload,
  });
}

/**
 * Requête de la récupération des logs activités du compte
 *
 * Envoie une requête pour la récupération des logs activités
 * à l'utilisateur.
 */
export function getLogsRequest(queryParams: object) {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/auth/log",
    queryParams: { ...queryParams },
  });
}

/**
 * Requête pour la récupération des documents  d'une entreprise
 *
 * Envoie une requête pour la récupération des documents  d'une entreprise
 * à l'utilisateur.
 */
export function getEnterpriseFilesRequest() {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/auth/enterprise-files",
  });
}
