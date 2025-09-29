import { useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAtom, useAtomValue } from 'jotai';
import { userAtom, isAuthenticatedAtom } from '@/modules/$lang/_auth/stores';
import { getUserInfoRequest, updateUserInfoRequest, updatePasswordRequest, getBillingEmailRecipientsRequest, addBillingEmailRecipientsRequest, updateBillingEmailRecipientsRequest, deleteBillingEmailRecipientsRequest, getLogsRequest, getBillingAddressesRequest, updateBillingAddressesRequest, deleteBillingAddressesRequest, createBillingAddressesRequest, getEnterpriseFilesRequest } from "../requests";
import type { BillingAddress } from "../schemas";

/**
 * Hook pour la récupération des informations de l'utilisateur
 * 
 * Gère le processus de récupération des informations de l'utilisateur
 * avec notifications de succès/erreur
 */
export function useUserInfoQuery() {
  const user = useAtomValue(userAtom);
  return useQuery({
    queryFn: async () => {
      return await getUserInfoRequest();
    },
    queryKey: ["user-info"],
  });
}

/**
 * Hook pour l'ajout des adresses email à mettre en copie
 *
 * Gère le processus d'ajout des adresses email à mettre en copie
 * avec notifications de succès/erreur
 */
export function useAddBillingEmailRecipientsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string; id?: string | null }[]) => {
      return await addBillingEmailRecipientsRequest(data);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-email-recipients"] });
    },
  });
}

/**
 * Hook pour la mise à jour des adresses email à mettre en copie
 *
 * Gère le processus de mise à jour des adresses email à mettre en copie
 * avec notifications de succès/erreur
 */
export function useUpdateBillingEmailRecipientsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: object) => {
      return await updateBillingEmailRecipientsRequest(data);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-email-recipients"] });
    },
  });
}

/**
 * Hook pour la suppression des adresses email à mettre en copie
 *
 * Gère le processus de suppression des adresses email à mettre en copie
 * avec notifications de succès/erreur
 */
export function useDeleteBillingEmailRecipientsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: object) => {
      return await deleteBillingEmailRecipientsRequest(payload);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-email-recipients"] });
    },
  });
}

/**
 * Hook pour la récupération des adresses email à mettre en copie
 *
 * Gère le processus de récupération des adresses email à mettre en copie
 * avec notifications de succès/erreur
 */
export function useBillingEmailRecipientsQuery() {
  return useQuery({
    queryFn: async () => {
      return await getBillingEmailRecipientsRequest();
    },
    queryKey: ["billing-email-recipients"],
  });
}

/**
 * Hook pour la mise à jour des informations de l'utilisateur
 *
 * Gère le processus de mise à jour des informations de l'utilisateur
 * avec notifications de succès/erreur
 */
export function useUpdateUserInfoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: object) => {
      return await updateUserInfoRequest(data);
    },
    onSuccess: () => {
      toast.success("Informations mises à jour avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
      queryClient.invalidateQueries({ queryKey: ["enterprise-files"] });
    },
  });
}

/**
 * Hook pour la mise à jour du mot de passe de l'utilisateur
 *
 * Gère le processus de mise à jour du mot de passe de l'utilisateur
 * avec notifications de succès/erreur
 */
export function useUpdatePasswordMutation() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const [isAuthenticated, setAuthenticated] = useAtom(isAuthenticatedAtom);
  return useMutation({
    mutationFn: async (data: object) => {
      return await updatePasswordRequest(data);
    },
    onSuccess: () => {
      toast.success("Mot de passe mis à jour avec succès. Reconnectez-vous.");
      setAuthenticated(false);
   //   router.push("/sign-in");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la récupération des adresses de facturation
 *
 * Gère le processus de récupération des adresses de facturation
 * avec notifications de succès/erreur
 */
export function useBillingAddressesQuery() {
  return useQuery({
    queryFn: async () => {
      return await getBillingAddressesRequest();
    },
    queryKey: ["billing-addresses"],
  });
}

/**
 * Hook pour la mise à jour des adresses de facturation
 *
 * Gère le processus de mise à jour des adresses de facturation
 * avec notifications de succès/erreur
 */
export function useUpdateBillingAddressesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BillingAddress) => {
      const customPayload = {
        id: payload.uuid,
        street: "",
        city: "",
        country: "",
        postal_code: "",
        company_name: payload.company,
        complement_addr: payload.address,
        firstname: payload.firstname,
        lastname: payload.lastname,
        phone_number: payload.phone,
        number_of_tva: payload.vat,
        default: payload.isDefault
      };
      return await updateBillingAddressesRequest(customPayload);
    },
    onSuccess: () => {
      toast.success("Adresse de facturation modifiée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-addresses"] });
    },
  });
}

/**
 * Hook pour la suppression des adresses de facturation
 *
 * Gère le processus de suppression des adresses de facturation
 * avec notifications de succès/erreur
 */
export function useDeleteBillingAddressesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const customPayload = {
        ids: [id],
      };
      return await deleteBillingAddressesRequest(customPayload);
    },
    onSuccess: () => {
      toast.success("Adresse de facturation supprimée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-addresses"] });
    },
  });
}

/**
 * Hook pour la création des adresses de facturation
 *
 * Gère le processus de création des adresses de facturation
 * avec notifications de succès/erreur
 */
export function useCreateBillingAddressesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BillingAddress) => {
      const customPayload = {
        addresses: [
          {
            company_name: payload.company,
            complement_addr: payload.address,

            street: "",
            city: "",
            postal_code: "",
            country: "",
            lastname: payload.lastname,
            firstname: payload.firstname,
            phone_number: payload.phone,
            number_of_tva: payload.vat,
            is_default: true,
          },
        ],
      };
      return await createBillingAddressesRequest(customPayload);
    },
    onSuccess: () => {
      toast.success("Adresse de facturation créée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-addresses"] });
    },
  });
}

/**
 * Hook pour la récupération des logs activités du compte
 *
 * Gère le processus de récupération des logs activités du compte
 * avec notifications de succès/erreur
 */
export function useLogsQuery(queryParams: object) {
  return useQuery({
    queryFn: async () => {
      return await getLogsRequest(queryParams);
    },
    queryKey: ["logs", queryParams],
  });
}

/**
 * Hook pour la récupération des documents  d'une entreprise
 *
 * Gère le processus de récupération des documents  d'une entreprise
 * avec notifications de succès/erreur
 */
export function useEnterpriseFilesQuery() {
  return useQuery({
    queryFn: async () => {
      return await getEnterpriseFilesRequest();
    },
    queryKey: ["enterprise-files"],
  });
}
