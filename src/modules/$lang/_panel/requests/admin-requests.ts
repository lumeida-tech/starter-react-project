import { handleHttpRequest } from "@/lib/http-client";

/**
 * Requête pour inviter un admin
 *
 * Envoie une requête pour inviter un admin
 * à l'utilisateur.
 */
export function inviteAdminRequest(data: any) {
    return handleHttpRequest({
        method: "POST",
        endpoint: "/api/auth/invite-user",
        payload: data,
        queryParams: {
            redirected_url: process.env.NEXT_PUBLIC_APP_URL+`/accept-invitation?email=${data.email}` || "",
        }
    });
}

/**
 * Requête pour récupérer tous les utilisateurs
 *
 * Envoie une requête pour récupérer tous les utilisateurs
 * à l'utilisateur.
 */
export function getAllUsersRequest(queryParams: any) {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/auth/all-user",
    queryParams: {
      ...queryParams,
    },
  });
}

/**
 * Requête pour récupérer l'avatar d'un utilisateur
 *
 * Envoie une requête pour récupérer l'avatar d'un utilisateur
 * à l'utilisateur.
 */
export function getUserAvatarRequest(profilePicId: string) {
  return handleHttpRequest({
    method: "GET",
    endpoint: `/api/auth/get-users-files?object_id=${profilePicId}`,
    responseFormat: "blob",
  });
}

/**
 * Requête pour activer un compte entreprise
 *
 * Envoie une requête pour activer   un compte entreprise
 * à l'utilisateur.
 */
export function activateEnterpriseRequest(payload: object) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/admin/activate-enterprise-account",
    payload: payload,
  });
}

/**
 * Requête pour refuser un compte entreprise
 *
 * Envoie une requête pour refuser un compte entreprise
 * à l'utilisateur.
 */
export function rejectEnterpriseRequest(payload: object) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/reject-documents",
    payload: payload,
  });
}

/**
 * Requête pour changer le role d'un utilisateur
 *
 * Envoie une requête pour changer le role d'un utilisateur
 * à l'utilisateur.
 */
export function changeUserRoleRequest(payload: object) {
  return handleHttpRequest({
    method: "PUT",
    endpoint: "/api/auth/change-user-role",
    payload: payload,
  });
}

/**
 * Requête pour récupéer la liste des utilisateurs invités
 *
 * Envoie une requête pour récupéer la liste des utilisateurs invités
 * à l'utilisateur.
 */
export function getInvitedUsersRequest() {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/auth/invited-users",
  });
}
