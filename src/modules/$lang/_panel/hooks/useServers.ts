import { useRouter } from "@tanstack/react-router";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getServersAllRequest,
  getServersDetailRequest,
  onOffServersRequest,
  changePasswordRequest,
  addSshKeyRequest,
  getSshKeyRequest,
  deleteSshKeyRequest,
  deleteServersRequest,
  getOfferServersRequest,
  createOfferServersRequest,
  getOsRequest,
  createOsRequest,
  deleteOfferServersRequest,
  getOsByIdRequest,
  updateOsRequest,
  deleteOsRequest,
  getSecurityGroupsRequest,
  deleteSecurityGroupRequest,
  createSecurityGroupRequest,
  updateSecurityGroupRequest,
  getBackupsRequest,
  createBackupsRequest,
  deleteBackupsRequest,
  updateBackupsRequest,
  getConsoleURLServersRequest,
} from "../requests";
import type { SecurityGroupMain } from "../schemas";
import type {
  AddOperatingSystemValidated,
  AddServerOffer,
  UpdateOperatingSystem,
  UpdateSecurityGroupsParams,
  UpdateSecurityGroup,
  GetSshKeyParams,
  PostBackupsParams,
  PostBackups,
  UpdateBackupsParams,
} from "../schemas/panel-types";

///////////////////////////////VPS/////////////////////////////////////////

/**
 * Hook pour la récupération des serveurs commandé par le client
 *
 * Gère le processus de récupération des serveurs commandé par le client
 *
 */
export function useServersAllQuery() {
  return useQuery({
    queryFn: async () => {
      // return await getServersAllRequest(per_page, page);
      return await getServersAllRequest();
    },
    queryKey: ["get-servers-all"],
  });
}

/**
 * Hook pour la récupération des détails d'un serveurs commandé par le client
 *
 * Gère le processus de récupération des détails d'un serveurs commandé par le client
 *
 */
export function useServersDetailQuery(id: string) {
  return useQuery({
    queryFn: async () => {
      return await getServersDetailRequest(id);
    },
    queryKey: [`get-${id}-detail`],
  });
}

/**
 * Hook pour éteindre / allumer ou redémarrer un serveurs commandé par le client
 *
 * Gère le processus permettant d'éteindre / d'allumer ou de redémarrer
 * un serveurs commandé par le client
 *
 */
export function useOnOffServersMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, restart }: { id: string; restart: string }) => {
      return await onOffServersRequest(id, restart);
    },
    onSuccess: () => {
      toast.success("Opération effectuée avec succès");
      // Invalider les requêtes des offres pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["get-servers-all"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Une erreur est survenue");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-servers-on/off"] });
    },
  });
}

/**
 * Hook pour changer le mot de passe des serveurs commandé par le client
 *
 * Gère le processus de changement de mot de passe des serveurs commandé par le client
 *
 */
export function useChangePasswordMutation() {
  let id = "";
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      serverId,
      userPassword,
      newPassword,
    }: {
      serverId: any;
      newPassword: any;
      userPassword: any;
    }) => {
      id = serverId;
      return await changePasswordRequest(serverId, userPassword, newPassword);
    },
    onSuccess: () => {
      toast.success("Mot de passe changer avec succès !");
      queryClient.invalidateQueries({ queryKey: [`get-${id}-detail`] });
    },
    onError: (error: Error) => {
      toast.error(
        "Opération non effectuée. Veuillez revoir les informations renseignées"
      );
    },
  });
}

/**
 * Hook pour la récupération de URL des serveurs
 *
 * Gère le processus de récupération de URL des serveurs
 * 
 * @param serverId - ID du serveur pour lequel récupérer URL
 */
export function useConsoleURLServersQuery(serverId: string) {
  return useQuery({
    queryFn: async () => {
      return await getConsoleURLServersRequest(serverId);
    },
    queryKey: ["get-console-url-servers", serverId],
    enabled: !!serverId,
  });
}

/**
 * Hook pour la suppression des serveurs commandé par le client
 *
 * Gère le processus de suppression des serveurs commandé par le client
 *
 */
export function useDeleteServersMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, type }: { id: string; type: string }) => {
      return await deleteServersRequest(id, type);
    },
    onSuccess: () => {
      toast.success("Serveur supprimé avec succès !");
      // Invalider les requêtes des offres pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["get-servers-all"] });
    },
    onError: (error: Error) => {
      toast.error("Une erreur est survenue");
    },
  });
}

/**
 * Hook pour la récupération des clé ssh d'un serveurs commandé par le client
 *
 * Gère le processus de récupération des clé ssh d'un serveurs commandé par le client
 *
 */
export function useSshKeyAllQuery(
  params: GetSshKeyParams,
  enabled: boolean = true
) {
  return useQuery({
    queryFn: async () => {
      return await getSshKeyRequest(params);
    },
    queryKey: ["get-ssh-key-all"],
    enabled: enabled,
  });
}

/**
 * Hook pour la récupération des détails d'une clé ssh d'un serveurs commandé par le client
 *
 * Gère le processus de récupération des détails d'une clé ssh d'un serveurs commandé par le client
 *
 */
export function useSshKeyDetailsQuery() {
  return useMutation({
    mutationFn: async (params: GetSshKeyParams) => {
      return await getSshKeyRequest(params);
    },
  });
}

/**
 * Hook pour télécharger une clé ssh d'un serveurs commandé par le client
 *
 * Gère le processus de téléchargement d'une clé ssh d'un serveurs commandé par le client
 *
 */
export function useDownloadSshKeyQuery() {
  return useMutation({
    mutationFn: async (params: GetSshKeyParams) => {
      return await getSshKeyRequest(params);
    },
  });
}

/**
 * Hook pour ajouter une clé ssh à un serveurs commandé par le client
 *
 * Gère le processus d'ajout d'une clé ssh à un serveurs commandé par le client
 *
 */
export function useAddSshKeyRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      serverId,
      keyName,
      publicKey,
    }: {
      serverId: string;
      keyName: string;
      publicKey?: string | null;
    }) => {
      return await addSshKeyRequest(serverId, keyName, publicKey);
    },
    onSuccess: () => {
      toast.success("Clé SSH ajoutée avec succès");
    },
    onError: (error: Error) => {
      toast.error("Une erreur est survenue lors de l'ajout de la clé SSH");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-ssh-key-all"] });
    },
  });
}

/**
 * Hook pour la suppression des clé ssh d'un serveur commandé par le client
 *
 * Gère le processus de suppression des clé ssh d'un serveur commandé par le client
 *
 */
export function useDeleteSshKeyRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ keyName }: { keyName: string }) => {
      return await deleteSshKeyRequest(keyName);
    },
    onSuccess: () => {
      toast.success("Suppression effectuée avec succès !");
    },
    onError: (error: Error) => {
      toast.error("Une erreur est survenue lors de la suppression");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-ssh-key-all"] });
    },
  });
}

/**
 * Hook pour la récupération des offers serveurs
 *
 * Gère le processus de récupération des offers serveurs
 *
 */
export function useOfferServersQuery(serverType: string) {
  return useQuery({
    queryFn: async () => {
      return await getOfferServersRequest(serverType);
    },
    queryKey: ["get-offer-servers", serverType],
  });
}

/**
 * Hook pour la création des offers serveurs
 *
 * Gère le processus de création des offers serveurs
 *
 * @param onSuccess - Callback optionnel à exécuter en cas de succès
 */
export function useCreateOfferServersMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      offerData,
      serverType,
    }: {
      offerData: AddServerOffer;
      serverType: string;
    }) => {
      return await createOfferServersRequest(offerData);
    },
    onSuccess: (data) => {
      toast.success("Offre VPS créée avec succès !");
      // Navigation par défaut vers la liste des offres VPS
     // router.navigate("/admin/offers/vps");
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création de l'offre.`);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["get-offer-servers", variables?.serverType],
      });
    },
  });
}

/**
 * Hook pour la suppression des offers serveurs
 *
 * Gère le processus de suppression des offers serveurs
 *
 * @param onSuccess - Callback optionnel à exécuter en cas de succès
 */
export function useDeleteOfferServersMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (wayhostId: string) => {
      return await deleteOfferServersRequest(wayhostId);
    },
    onSuccess: (data) => {
      toast.success("Offre VPS supprimée avec succès !");
      // Invalider les requêtes des offres pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["get-offer-servers"] });

      // Callback personnalisé si fourni
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigation par défaut vers la liste des offres VPS
       // router.replace("/admin/offers/vps");
      }
    },
    onError: (error: Error) => {
      toast.error(
        `Erreur lors de la suppression de l'offre : ${error.message}`
      );
    },
  });
}

///////////////////////////////OS/////////////////////////////////////////

/**
 * Hook pour la récupération des images(OS) des serveurs
 *
 * Gère le processus de récupération des images(OS) des serveurs
 *
 */
export function useOsQuery(scope?: string, zone_name?: string) {
  return useQuery({
    queryFn: async () => {
      return await getOsRequest(scope, zone_name);
    },
    queryKey: ["get-os-all", scope],
  });
}

/**
 * Hook pour la récupération d'une image(OS) via id des serveurs
 *
 * Gère le processus de récupération d'une image(OS) via id des serveurs
 *
 */
export function useOsByIdQuery(
  osId: string,
  getLogo?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryFn: async () => {
      return await getOsByIdRequest(osId, getLogo);
    },
    queryKey: ["get-os-by-id", osId],
    enabled: options?.enabled ?? !!osId,
  });
}

/**
 * Hook pour la création d'une image(OS) des serveurs
 *
 * Gère le processus de création d'une image(OS) des serveurs
 *
 */
export function useCreateOsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (osData: AddOperatingSystemValidated) => {
      return await createOsRequest(osData);
    },
    onSuccess: () => {
      toast.success("Système d'exploitation créé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création du système d'exploitation");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-os-all"] });
    },
  });
}

/**
 * Hook pour la modification d'une image(OS) des serveurs
 *
 * Gère le processus de modification d'une image(OS) des serveurs
 *
 */

export function useUpdateOsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      image_id,
      osData,
    }: {
      image_id: string;
      osData: UpdateOperatingSystem;
    }) => {
      return await updateOsRequest(image_id, osData);
    },
    onSuccess: () => {
      toast.success("Système d'exploitation modifié avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error?.message ||
          "Erreur lors de la modification du système d'exploitation"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-os-all"] });
    },
  });
}

/**
 * Hook pour la suppression d'une image(OS) des serveurs
 *
 * Gère le processus de suppression d'une image(OS) des serveurs
 *
 */
export function useDeleteOsMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image_id: string) => {
      return await deleteOsRequest(image_id);
    },
    onSuccess: (data) => {
      toast.success("Système d'exploitation supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["get-os-all"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.message ||
          "Erreur lors de la suppression du système d'exploitation"
      );
    },
  });
}

///////////////////////////////SECURITY GROUPS/////////////////////////////////////////

/**
 * Hook pour la récupération des groupes de sécurité d'un serveur
 *
 * Gère le processus de récupération des groupes de sécurité d'un serveur spécifique
 *
 * @param wayhost_id - ID du serveur pour lequel récupérer les groupes de sécurité
 */
export function useSecurityGroupsQuery(wayhost_id: string) {
  return useQuery({
    queryKey: ["security-groups", wayhost_id],
    queryFn: () => getSecurityGroupsRequest({ wayhost_id }),
    enabled: !!wayhost_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook pour la récupération de tous les groupes de sécurité
 *
 * Gère le processus de récupération de tous les groupes de sécurité
 */
export function useAllSecurityGroupsQuery() {
  return useQuery({
    queryKey: ["all-security-groups"],
    queryFn: () => getSecurityGroupsRequest(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook pour la récupération d'un groupe de sécurité spécifique par son ID
 *
 * Gère le processus de récupération des détails d'un groupe de sécurité spécifique
 *
 * @param sg_id - ID du groupe de sécurité à récupérer
 */
export function useSecurityGroupQuery(sg_id: string, wayhost_id: string) {
  return useQuery({
    queryKey: ["security-group", sg_id, wayhost_id],
    queryFn: () => getSecurityGroupsRequest({ sg_id, wayhost_id }),
    enabled: !!sg_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook pour la suppression d'un groupe de sécurité
 *
 * Gère le processus de suppression d'un groupe de sécurité avec état optimiste
 *
 * @param wayhost_id - ID du serveur concerné pour l'invalidation du cache
 * @param options - Callbacks optionnels à exécuter en cas de succès ou d'erreur
 */
export function useDeleteSecurityGroupMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: any) => {
      return await deleteSecurityGroupRequest(params.sg_id);
    },

    onSuccess: (data) => {
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
    onSettled: async (_data, _error, variables) => {
      const { sg_id, wayhost_id } = variables;
      await queryClient.invalidateQueries({
        queryKey: ["security-group", sg_id, wayhost_id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["security-groups", wayhost_id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["get-servers-detail", wayhost_id],
      });
    },
  });
}

/**
 * Hook pour la création d'un groupe de sécurité
 *
 * @param wayhost_id - ID du serveur pour lequel créer le groupe de sécurité
 * @param groupData - Données du groupe de sécurité à créer
 * @param options - Options pour la gestion des erreurs et des succès
 * @returns Mutation pour la création du groupe de sécurité
 */

export function useCreateSecurityGroupMutation(options?: {
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      wayhost_id,
      data,
    }: {
      wayhost_id: string;
      data: SecurityGroupMain;
    }) => {
      return await createSecurityGroupRequest(wayhost_id, data);
    },
    onSuccess: async () => {
      toast.success("Groupe de sécurité créé avec succès");
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la création du groupe de sécurité");
    },
    onSettled: async (_data, _error, variables) => {
      const { wayhost_id } = variables;
      await queryClient.invalidateQueries({
        queryKey: ["security-groups", wayhost_id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["get-servers-detail", wayhost_id],
      });
    },
  });
}

/**
 * Hook pour la modification d'un groupe de sécurité
 *
 * @param wayhost_id - ID du serveur pour lequel modifier le groupe de sécurité
 * @param sg_id - ID du groupe de sécurité à modifier
 * @param groupData - Données du groupe de sécurité à modifier
 * @param options - Options pour la gestion des erreurs et des succès
 * @returns Mutation pour la modification du groupe de sécurité
 */

export function useUpdateSecurityGroupMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      params,
      data,
    }: {
      params: UpdateSecurityGroupsParams;
      data: UpdateSecurityGroup;
    }) => {
      return await updateSecurityGroupRequest(params, data);
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      options?.onError?.(error);
    },
    onSettled: async (_data, _error, variables) => {
      const { params } = variables;
      await queryClient.invalidateQueries({
        queryKey: ["security-group", params.sg_id, params.wayhost_id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["security-groups", params.wayhost_id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["get-servers-detail", params.wayhost_id],
      });
    },
  });
}

/**
 * Hook pour la récupération des backups d'un serveur avec pagination infinie
 *
 * Gère le processus de récupération des backups d'un serveur avec scroll infini
 *
 * @param server_id - ID du serveur pour lequel récupérer les backups
 * @param enabled - Activer ou désactiver la requête
 */
export function useBackupsQuery(server_id: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ["get-backups-all", server_id],
    queryFn: async ({ pageParam = 1 }) => {
      return await getBackupsRequest({
        server_id: server_id,
        download: "no",
        per_page: "50",
        page: pageParam.toString(),
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const data = lastPage?.data;
      if (!data) return undefined;

      const currentPage = data.current_page;
      const lastPageNum = data.last_page;

      return currentPage < lastPageNum ? currentPage + 1 : undefined;
    },
    enabled: enabled && !!server_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook pour la création d'un backup
 *
 * Gère le processus de création d'un backup avec gestion des erreurs et succès
 *
 * @param options - Callbacks optionnels à exécuter en cas de succès ou d'erreur
 */
export function useCreateBackupMutation(options?: {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      params,
      data,
    }: {
      params: PostBackupsParams;
      data: PostBackups;
    }) => {
      return await createBackupsRequest(params, data);
    },
    onSuccess: (data, variables) => {
      toast.success("Backup créé avec succès");
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la création du backup");
      options?.onError?.(error);
    },
    onSettled: async (_data, _error, variables) => {
      const { params } = variables;
      await queryClient.invalidateQueries({
        queryKey: ["get-backups-all", params.wayhost_id],
      });
    },
  });
}

/**
 * Hook pour la suppression d'un backup
 *
 * Gère le processus de suppression d'un backup avec gestion des erreurs et succès
 *
 * @param options - Callbacks optionnels à exécuter en cas de succès ou d'erreur
 */
export function useDeleteBackupMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      wayhost_id,
      server_id,
    }: {
      wayhost_id: string;
      server_id: string;
    }) => {
      return await deleteBackupsRequest(wayhost_id);
    },
    onSuccess: (data, wayhost_id) => {
      toast.success("Backup supprimé avec succès");
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la suppression du backup");
      options?.onError?.(error);
    },
    onSettled: async (_data, _error, variables) => {
      const { server_id } = variables;
      await queryClient.invalidateQueries({
        queryKey: ["get-backups-all", server_id],
      });
    },
  });
}

/**
 * Hook pour la modification d'un backup
 *
 * Gère le processus de modification d'un backup avec gestion des erreurs et succès
 *
 */
export function useUpdateBackupMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      params,
      data,
    }: {
      params: UpdateBackupsParams;
      data: { name: string; description: string };
    }) => {
      return await updateBackupsRequest(params, data);
    },
    onSuccess: (data, variables) => {
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      options?.onError?.(error);
    },
    onSettled: async (_data, _error, variables) => {
      const { params } = variables;
      await queryClient.invalidateQueries({
        queryKey: ["get-backups-all", params.wayhost_id],
      });
    },
  });
}
