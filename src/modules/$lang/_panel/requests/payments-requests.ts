import { handleHttpRequest } from "@/lib/http-client";
import type { PromoCodeParams, PromoCodeUsersParams } from "../schemas";


/**
 * Requête de paiement d'un service
 * 
 * Envoie une requête pour le paiement d'un service
 */
export function paymentRequest(billingAdress: string, payload: object) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/payment",
    queryParams: {
      billing_adress: billingAdress,
    },
    payload: payload
  });
}

/**
 * Requête de la récupération de la clé public de stripe
 *
 * Envoie une requête pour la récupération de la clé public de stripe
 * à l'utilisateur.
 */
export function getStripePublicKeyRequest() {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/payment/stripe-pub-key",
  });
}

/**
 * Requête de la récupération de la client secret de stripe
 *
 * Envoie une requête pour la récupération de la client secret de stripe
 * à l'utilisateur.
 */
export function getStripeClientSecretRequest() {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/payment/cards",
  });
}

/**
 * Requête de la récupération de la liste des cartes de stripe
 *
 * Envoie une requête pour la récupération de la liste des cartes de stripe
 * à l'utilisateur.
 */
export function getStripeCardsRequest() {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/payment/cards",
  });
}

/**
 * Requête de la suppression d'une carte de stripe
 *
 * Envoie une requête pour la suppression d'une carte de stripe
 * à l'utilisateur.
 */
export function deleteStripeCardRequest(cardId: string) {
  return handleHttpRequest({
    method: "DELETE",
    endpoint: `/api/payment/cards`,
    queryParams: {
      payment_method_id: cardId,
    },
  });
}

/**
 * Requête pour définir une carte par défaut
 
 * Envoie une requête pour la récupération de la clé public de stripe
 * à l'utilisateur.
 */
export function updateDefaultCardRequest(cardId: string) {
  return handleHttpRequest({
    method: "PUT",
    endpoint: "/api/payment/set_default_card",
    queryParams: {
      payment_method_id: cardId,
    },
  });
}


/**
 * Requête de la créditation du wallet wayhost
 *
 * Envoie une requête pour la créditation du wallet wayhost
 * à l'utilisateur.
 */
export function creditWalletRequest(payload: object) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/payment/wallet-credit",
    payload: payload,
  });
}

/**
 * Requête de récupération de la liste des transactions du wallet wayhost
 *
 * Envoie une requête pour la récupération de la liste des transactions du wallet wayhost
 * à l'utilisateur.
 */
export function getWalletTransactionsRequest() {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/payment/transactions-history",
    queryParams: {
      page: "1",
      per_page: "50",
    },
  });
}

/**
 * Requête de récupération de la liste des codes promo
 *
 * Envoie une requête pour la récupération de la liste des codes promo
 * à l'utilisateur.
 */
export function getPromoCodeRequest(params: PromoCodeParams) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/payment/code-promo",
    queryParams: queryParams,
  });
}

/**
 * Requête de récupération de la liste des codes promo
 *
 * Envoie une requête pour la récupération de la liste des codes promo
 * à l'utilisateur.
 */
export function getUsersByPromoCodeRequest(params: PromoCodeUsersParams) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/payment/code-promo/users",
    queryParams: queryParams,
  });
}

/**
 * Requête de création d'un code promo
 *
 * Envoie une requête pour la création d'un code promo
 * à l'utilisateur.
 */
export function createPromoCodeRequest(data: object) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/payment/code-promo",
    payload: data,
  });
}

/**
 * Requête de modification d'un code promo
 *
 * Envoie une requête pour la modification d'un code promo
 * à l'utilisateur.
 */
export function updatePromoCodeRequest(id: string, data: object) {
  return handleHttpRequest({
    method: "PUT",
    endpoint: `/api/payment/code-promo`,
    queryParams: {
      code_id: id,
    },
    payload: data,
  });
}

/**
 * Requête de suppression d'un code promo
 *
 * Envoie une requête pour la suppression d'un code promo
 * à l'utilisateur.
 */
export function deletePromoCodeRequest(id: string) {
  return handleHttpRequest({
    method: "DELETE",
    endpoint: `/api/payment/code-promo`,
    queryParams: {
      code_id: id,
    },
  });
}

/**
 * Requête des KPI du wallet
 *
 * Envoie une requête pour la récupération des KPI du wallet
 * à l'utilisateur.
 */
export function getWalletKpiRequest(operation: "Credit" | "Debit") {
  return handleHttpRequest({
    method: "GET",
    endpoint: `/api/payment/monthly-income`,
    queryParams: {
      operation: operation,
      month: (new Date().getMonth() + 1).toString(),
      year: new Date().getFullYear().toString(),
    },
  });
}

/**
 * Requête des abonnements
 *
 * Envoie une requête pour la récupération des abonnements
 * à l'utilisateur.
 */
export function getSubscriptionsRequest() {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/payment/subscriptions",
  });
}




