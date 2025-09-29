import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  paymentRequest,
  creditWalletRequest,
  deleteStripeCardRequest,
  getStripeCardsRequest,
  getStripeClientSecretRequest,
  getStripePublicKeyRequest,
  getWalletTransactionsRequest,
  deletePromoCodeRequest,
  updateDefaultCardRequest,
  updatePromoCodeRequest,
  getWalletKpiRequest,
  getSubscriptionsRequest,
} from "../requests";
import { toast } from "sonner";
import type {
  AddPromoCode,
  PromoCodeParams,
  PromoCodeUsersParams,
  UpdatePromoCode,
} from "../schemas";

/**
 * Hook pour le paiement des services
 * 
 * Gèrer le paiement des services
 * avec notifications de succès/erreur
 */
export function usePaymentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            return await paymentRequest(data.billingAdress, data.payload);
        },
        onSuccess: () => {
            // toast.success("Wallet crédité avec succès !");
        },
        onError: (error: Error) => {
            // toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["payment-service", "user-info"] });
        }
    });
}

/**
 * Hook pour la récupération de la clé public de stripe
 *
 * Gère le processus de récupération de la clé public de stripe
 * avec notifications de succès/erreur
 */
export function useStripePublicKeyQuery() {
  return useQuery({
    queryFn: async () => {
      return await getStripePublicKeyRequest();
    },
    queryKey: ["stripe-public-key"],
  });
}

/**
 * Hook pour la récupération de la client secret de stripe
 *
 * Gère le processus de récupération de la client secret de stripe
 * avec notifications de succès/erreur
 */
export function useStripeClientSecretQuery() {
  return useQuery({
    queryFn: async () => {
      return await getStripeClientSecretRequest();
    },
    queryKey: ["stripe-client-secret"],
  });
}

/**
 * Hook pour la récupération de la liste des cartes de stripe
 *
 * Gère le processus de récupération de la liste des cartes de stripe
 * avec notifications de succès/erreur
 */
export function useStripeCardsQuery() {
  return useQuery({
    queryFn: async () => {
      return await getStripeCardsRequest();
    },
    queryKey: ["stripe-cards"],
  });
}

/**
 * Hook pour la suppression d'une carte de stripe
 *
 * Gère le processus de suppression d'une carte de stripe
 * avec notifications de succès/erreur
 */
export function useDeleteStripeCardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cardId: string) => {
      return await deleteStripeCardRequest(cardId);
    },
    onSuccess: () => {
      toast.success("Carte supprimée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["stripe-cards"] });
    },
  });
}

/**
 * Hook pour la créditer le wallet wayhost
 *
 * Gère le processus de créditation d'une carte de stripe
 * avec notifications de succès/erreur
 */
export function useCreditWalletMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: object) => {
      return await creditWalletRequest(payload);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
        queryClient.invalidateQueries({ queryKey: ["user-info"] });
        queryClient.invalidateQueries({ queryKey: ["wallet-kpi", "Credit"] });
        queryClient.invalidateQueries({ queryKey: ["wallet-kpi", "Debit"] });
      }, 3000);
    },
  });
}

/**
 * Hook pour la récupération de la liste des transactions du wallet wayhost
 *
 * Gère le processus de récupération de la liste des transactions du wallet wayhost
 * avec notifications de succès/erreur
 */
export function useWalletTransactionsQuery() {
  return useQuery({
    queryFn: async () => {
      return await getWalletTransactionsRequest();
    },
    queryKey: ["wallet-transactions"],
  });
}

/**
 * Hook pour la récupération de la liste des code promo
 *
 * Gère le processus de récupération de la liste des code promo
 * avec notifications de succès/erreur
 */
export function usePromoCodesQuery(params: PromoCodeParams) {
  return useQuery({
    queryFn: async () => {
      // return await getPromoCodeRequest(params);
    },
    queryKey: ["promo-codes", params],
  });
}

/**
 * Hook pour la récupération des utilisateurs d'un code promo
 *
 * Gère le processus de récupération des utilisateurs d'un code promo
 * avec notifications de succès/erreur
 */
export function usePromoCodeUsersQuery(params: PromoCodeUsersParams) {
  return useQuery({
    queryFn: async () => {
      // return await getPromoCodeRequest(params);
    },
    queryKey: ["promo-codes", params],
  });
}

/**
 * Hook pour la suppression d'un code promo
 *
 * Gère le processus de suppression d'un code promo
 * avec notifications de succès/erreur
 */
export function useDeletePromoCodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await deletePromoCodeRequest(id);
    },
    onSuccess: () => {
      toast.success("Code promo supprimé avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
    },
  });
}

/**
 * Hook pour la création d'un code promo
 *
 * Gère le processus de création d'un code promo
 * avec notifications de succès/erreur
 */
export function useCreatePromoCodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddPromoCode) => {
      // return await createPromoCodeRequest(payload);
    },
    onSuccess: () => {
      toast.success("Code promo créé avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
    },
  });
}

/**
 * Hook pour la mise à jour d'un code promo
 *
 * Gère le processus de mise à jour d'un code promo
 * avec notifications de succès/erreur
 */
export function useUpdatePromoCodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePromoCode;
    }) => {
      return await updatePromoCodeRequest(id, payload);
    },
    onSuccess: () => {
      toast.success("Code promo mis à jour avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
    },
  });
}

/**
 * Hook pour la mise à jour d'une carte par défaut
 * 
 * Gère le processus de mise à jour d'une carte par défaut
 * avec notifications de succès/erreur
 */
export function useUpdateDefaultCardMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (cardId: string) => {
            return await updateDefaultCardRequest(cardId);
        },
        onSuccess: () => {
            toast.success("Carte mise à jour avec succès !");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["stripe-cards"] });
        }
    });
}   

/**
 * Hook pour la récupération des KPI du wallet
 *
 * Gère le processus de récupération des KPI du wallet
 * avec notifications de succès/erreur
 */
export function useWalletKpiQuery(operation: "Credit" | "Debit") {
    return useQuery({
        queryFn: async () => {
            return await getWalletKpiRequest(operation);
        },
        queryKey: ["wallet-kpi", operation],
    });
}


/**
 * Hook pour la récupération des abonnements
 *
 * Gère le processus de récupération des abonnements
 * avec notifications de succès/erreur
 */
export function useSubscriptionsQuery() {
    return useQuery({
        queryFn: async () => {
            return await getSubscriptionsRequest();
        },  
        queryKey: ["subscriptions"],
    });
}
  

            
