import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inviteAdminRequest, getAllUsersRequest, getUserAvatarRequest, activateEnterpriseRequest, rejectEnterpriseRequest, changeUserRoleRequest, getInvitedUsersRequest } from "../requests";
import { toast } from "sonner";

/**
 * Hook pour l'invitation d'un admin
 * 
 * Gère le processus d'invitation d'un admin
 * avec notifications de succès/erreur
 */
export function useInviteAdminMutation() {
    const queryClient = useQueryClient();

    return useMutation<any, Error, { data: object }>({
        mutationFn: async ({ data }: { data: object }) => {
            return await inviteAdminRequest(data);
        },
        onSuccess: () => {
            toast.success("Admin invité avec succès !");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["invited-users"] });
        },
    });
}

/**
 * Hook pour la récupération de tous les utilisateurs
 * 
 * Gère le processus de récupération de tous les utilisateurs
 * avec notifications de succès/erreur
 */
export function useGetAllUsersQuery(queryParams: any, enabled: boolean | null = null) {
    return useQuery({
        queryFn: async () => {
            return await getAllUsersRequest(queryParams);
        },

        queryKey: ["users", queryParams],
        enabled: enabled ?? true
    });
}

/**
 * Hook pour la récupération de l'avatar d'un utilisateur
 * 
 * Gère le processus de récupération de l'avatar d'un utilisateur
 * avec notifications de succès/erreur
 */
export function useGetUserAvatarQuery(profilePicId: string, enabled: boolean = true) {
    return useQuery({
        queryFn: async () => {
            return await getUserAvatarRequest(profilePicId);
        },
        queryKey: ["user-avatar", profilePicId],
        enabled: enabled
    });
}


/**
 * Hook pour l'activation d'un compte entreprise
 * 
 * Gère le processus d'activation d'un compte entreprise
 * avec notifications de succès/erreur
 */ 
export function useActivateEnterpriseMutation() {
    return useMutation<any, Error, { data: object }>({
        mutationFn: async ({ data }: { data: object }) => {
            return await activateEnterpriseRequest(data);
        },
        onSuccess: () => {
            toast.success("Compte entreprise activé avec succès !");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}


/**
 * Hook pour la refuser d'un compte entreprise
 * 
 * Gère le processus de refuser d'un compte entreprise
 * avec notifications de succès/erreur
 */ 
export function useRejectEnterpriseMutation() {
    return useMutation<any, Error, { data: object }>({
        mutationFn: async ({ data }: { data: object }) => {
            return await rejectEnterpriseRequest(data);
        },
        onSuccess: () => {
            toast.success("Compte entreprise refuser avec succès !");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}   

/**
 * Hook pour la changer le role d'un utilisateur
 * 
 * Gère le processus de changer le role d'un utilisateur
 * avec notifications de succès/erreur
 */ 
export function useChangeUserRoleMutation() {
    return useMutation<any, Error, { data: object }>({
        mutationFn: async ({ data }: { data: object }) => {
            return await changeUserRoleRequest(data);
        },
        onSuccess: () => {
            toast.success("Role utilisateur changé avec succès !");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

/**
 * Hook pour la récupération de la liste des utilisateurs invités
 * 
 * Gère le processus de récupération de la liste des utilisateurs invités
 * avec notifications de succès/erreur
 */ 
export function useGetInvitedUsersQuery() {
    return useQuery({
        queryFn: async () => {
            return await getInvitedUsersRequest();
        },
        queryKey: ["invited-users"],
    });     
}   
        
