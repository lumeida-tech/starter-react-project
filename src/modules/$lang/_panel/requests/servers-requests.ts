import { handleHttpRequest, handleImageRequest } from "@/lib/http-client";
import { objectToFormData } from "@/lib/utils";
import type {
  AddOperatingSystemValidated,
  SecurityGroupMain,
  AddServerOffer,
  GetSecurityGroupsParams,
  UpdateOperatingSystem,
  UpdateSecurityGroup,
  UpdateSecurityGroupsParams,
  GetSshKeyParams,
  GetBackupsParams,
  PostBackupsParams,
  PostBackups,
  UpdateBackupsParams,
  InstanciateBackupsParams,
} from "../schemas";

////////////////////////////////// VPS /////////////////////////////

/**
 * Requête pour la récupération des serveurs commandé par le client
 *
 * Envoie une requête pour la récupération des serveurs commandé par le client
 *
 */
// export function getServersAllRequest(per_page: string, page: string)
export function getServersAllRequest() {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/server/all",
    // queryParams: {
    //   per_page: per_page,
    //   page: page,
    // },
  });
}

/**
 * Requête pour la récupération des détails d'un serveurs commandé par le client
 *
 * Envoie une requête pour la récupération des détails d'un serveurs commandé par le client
 *
 */
export function getServersDetailRequest(id: string) {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/server/detail",
    queryParams: {
      wayhost_id: id,
    },
  });
}

/**
 * Requête pour éteindre / allumer ou redémarrer un serveurs commandé par le client
 *
 * Envoie une requête pour éteindre / allumer ou redémarrer un serveurs commandé par le client
 *
 */
export function onOffServersRequest(id: string, restart: string) {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/server/on-off",
    queryParams: {
      wayhost_id: id,
      reboot: restart,
    },
    responseFormat: "stream",
  });
}

/**
 * Requête pour changer le mot de passe des serveurs commandé par le client
 *
 * Envoie une requête pour le changement du mot de passe des serveurs commandé par le client
 *
 * @param id - ID du serveur à supprimer
 */
export function changePasswordRequest(
  serverId: string,
  userPassword: string,
  newPassword: string
) {
  return handleHttpRequest({
    method: "PUT",
    endpoint: `/api/server/change-password`,
    queryParams: {
      server_id: serverId,
    },
    payload: {
      userpassword: userPassword,
      newpassword: newPassword,
    },
  });
}

/**
 * Requête pour la récupération de URL des serveurs
 *
 * Envoie une requête pour la récupération de URL des serveurs
 *
 */
export function getConsoleURLServersRequest(id: string) {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/server/console",
    queryParams: {
      wayhost_id: id,
    },
  });
}

/**
 * Requête pour la suppression des serveurs commandé par le client
 *
 * Envoie une requête pour la suppression des serveurs commandé par le client
 *
 * @param id - ID du serveur à supprimer
 */
export function deleteServersRequest(id: string, type: string) {
  return handleHttpRequest({
    method: "DELETE",
    endpoint: `/api/server/delete`,
    queryParams: {
      wayhost_id: id,
      type: type,
    },
  });
}

/**
 * Requête pour récupérer les clé ssh d'un serveur commandé par le client
 *
 * Envoie une requête pour la récupération des clé ssh d'un serveurs commandé par le client
 *
 * @param serverId - ID du serveur
 * @param keyId - ID de la clé
 * @param download - Pour télécharger la clé
 */
export function getSshKeyRequest(params: GetSshKeyParams) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  return handleHttpRequest({
    method: "GET",
    endpoint: `/api/server/ssh-key`,
    queryParams: queryParams,
    responseFormat: params.download ? "blob" : "json",
  });
}

/**
 * Requête pour ajouter une clé ssh a un serveur commandé par le client
 *
 * Envoie une requête pour ajouter une clé ssh a un serveurs commandé par le client
 *
 * @param serverId - ID du serveur
 * @param keyName - Nom de la clé
 * @param publicKey - La clé public
 * @param privateKey - La clé privée
 */
export function addSshKeyRequest(
  serverId: string,
  keyName: string,
  publicKey?: string | null,
  privateKey?: string | null
) {
  const payload = Object.fromEntries(
    Object.entries({
      key_name: keyName,
      public_key: publicKey,
      private_key: privateKey,
    }).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return handleHttpRequest({
    method: "POST",
    endpoint: `/api/server/ssh-key`,
    queryParams: {
      server_id: serverId,
    },
    payload: payload,
  });
}

/**
 * Requête pour la suppression des clé ssh d'un serveurs commandé par le client
 *
 * Envoie une requête pour la suppression des clé ssh d'un serveurs commandé par le client
 *
 * @param keyName - Nom de la clé ssh
 */
export function deleteSshKeyRequest(keyName: string) {
  return handleHttpRequest({
    method: "DELETE",
    endpoint: `/api/server/ssh-key`,
    queryParams: {
      key_name: keyName,
    },
  });
}

/**
 * Requête pour la récupération des offres serveurs vps
 *
 * Envoie une requête pour la récupération des offres serveurs vps
 *
 */
export function getOfferServersRequest(serverType: string) {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/server/prices",
    queryParams: {
      type: serverType,
    },
  });
}

/**
 * Requête pour la création des offres serveurs vps
 *
 * Envoie une requête pour la création des offres serveurs vps
 *
 * @param offerData - Données de l'offre à créer
 */
export function createOfferServersRequest(offerData: AddServerOffer) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/server/prices",
    payload: offerData,
  });
}

/**
 * Requête pour la suppression des offres serveurs vps
 *
 * Envoie une requête pour la suppression des offres serveurs vps
 *
 * @param wayhostId - ID de l'offre à supprimer
 */
export function deleteOfferServersRequest(wayhostId: string) {
  return handleHttpRequest({
    method: "DELETE",
    endpoint: `/api/server/prices`,
    queryParams: {
      wayhost_id: wayhostId,
    },
  });
}

/////////////////////////////// OS ////////////////////////////////////

/**
 * Requête pour la récupération des images(OS) des serveurs
 *
 * Envoie une requête pour la récupération des images(OS) des serveurs
 *
 */
export function getOsRequest(scope?: string, zone_name?: string) {
  const queryParams = Object.fromEntries(
    Object.entries({
      scope: scope || "all",
      zone_name: zone_name || "",
    }).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/server/images",
    queryParams: queryParams,
  });
}

/**
 * Requête pour la récupération d'une image(OS) des serveurs
 *
 * Envoie une requête pour la récupération d'une image(OS) des serveurs
 *
 */
export function getOsByIdRequest(osId: string, getLogo?: string) {
  const shouldGetLogo = getLogo === "yes";

  if (shouldGetLogo) {
    return handleImageRequest({
      method: "GET",
      endpoint: "/api/server/images",
      queryParams: {
        scope: "all",
        id: osId,
        get_logo: "yes",
      },
      timeout: 60000,
    });
  } else {
    return handleHttpRequest({
      method: "GET",
      endpoint: "/api/server/images",
      queryParams: {
        scope: "all",
        id: osId,
        get_logo: getLogo || "no",
      },
      responseFormat: "json",
    });
  }
}

/**
 * Requête pour la création d'une image(OS) des serveurs
 *
 * Envoie une requête pour la création d'une image(OS) des serveurs
 *
 */
export function createOsRequest(osData: AddOperatingSystemValidated) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/server/images",
    payload: osData.files instanceof File ? objectToFormData(osData) : osData,
  });
}

/**
 * Requête pour la modification d'une image(OS) des serveurs
 *
 * Envoie une requête pour la modification d'une image(OS) des serveurs
 *
 */
export function updateOsRequest(
  image_id: string,
  osData: UpdateOperatingSystem
) {
  return handleHttpRequest({
    method: "PUT",
    endpoint: "/api/server/images",
    queryParams: {
      image_id: image_id,
    },
    payload: objectToFormData(osData),
  });
}

/**
 * Requête pour la suppression d'une image(OS) des serveurs
 *
 * Envoie une requête pour la suppression d'une image(OS) des serveurs
 *
 */
export function deleteOsRequest(image_id: string) {
  return handleHttpRequest({
    method: "DELETE",
    endpoint: "/api/server/images",
    queryParams: {
      image_id: image_id,
    },
  });
}

/////////////////////// SECURITY GROUPS ////////////////////////////

/**
 * Requête pour la récupération des groupes de sécurité
 *
 * Envoie une requête pour la récupération des groupes de sécurité
 *
 */
export function getSecurityGroupsRequest(params?: GetSecurityGroupsParams) {
  const queryParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/server/security-group",
    queryParams: queryParams,
  });
}

/**
 * Requête pour la création d'un groupe de sécurité
 *
 * Envoie une requête pour la création d'un groupe de sécurité
 *
 * @param groupData - Données du groupe de sécurité à créer
 */
export function createSecurityGroupRequest(
  wayhost_id: string,
  groupData: SecurityGroupMain
) {
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/server/security-group",
    queryParams: {
      wayhost_id: wayhost_id,
    },
    payload: groupData,
  });
}

/**
 * Requête pour la modification d'un groupe de sécurité
 *
 * Envoie une requête pour la modification d'un groupe de sécurité
 *
 * @param groupId - ID du groupe de sécurité à modifier
 * @param groupData - Données du groupe de sécurité à modifier
 */
export function updateSecurityGroupRequest(
  params: UpdateSecurityGroupsParams,
  groupData?: UpdateSecurityGroup
) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return handleHttpRequest({
    method: "PUT",
    endpoint: "/api/server/security-group",
    queryParams: queryParams,
    payload: groupData,
  });
}

/**
 * Requête pour la suppression d'un groupe de sécurité
 *
 * Envoie une requête pour la suppression d'un groupe de sécurité
 *
 * @param groupId - ID du groupe de sécurité à supprimer
 */
export function deleteSecurityGroupRequest(sg_id: string) {
  return handleHttpRequest({
    method: "DELETE",
    endpoint: "/api/server/security-group",
    queryParams: {
      sg_id: sg_id,
    },
  });
}

/////////////////////////// BACKUPS ////////////////////////////////

/**
 * Requête pour la récupération des backups
 *
 * Envoie une requête pour la récupération des backups
 *
 */
export function getBackupsRequest(params: GetBackupsParams) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/server/backup",
    queryParams: queryParams,
  });
}

/**
 * Requête pour la création d'un backup
 *
 * Envoie une requête pour la création d'un backup
 *
 * @param groupData - Données du backup à créer
 */
export function createBackupsRequest(
  params: PostBackupsParams,
  payload: PostBackups
) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/server/backup",
    queryParams: queryParams,
    payload: payload,
  });
}

/**
 * Requête pour l'instanciation d'un backup
 *
 * Envoie une requête pour l'instanciation d'un backup
 *
 * @param params - Paramètres du backup à instancier
 * @param payload - Données du backup à instancier
 */
export function instanciateBackupsRequest(
  params: InstanciateBackupsParams,
  payload: any
) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/server/backup/instantiate",
    queryParams: queryParams,
    payload: payload,
  });
}

/**
 * Requête pour la modification d'un backup
 *
 * Envoie une requête pour la modification d'un backup
 *
 * @param params - Paramètres du backup à modifier
 * @param payload - Données du backup à modifier
 */
export function updateBackupsRequest(
  params: UpdateBackupsParams,
  payload?: any
) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return handleHttpRequest({
    method: "PUT",
    endpoint: "/api/server/backup",
    queryParams: queryParams,
    payload: payload,
  });
}

/**
 * Requête pour la suppression d'un backup
 *
 * Envoie une requête pour la suppression d'un backup
 *
 * @param wayhost_id - ID du backup à supprimer
 */
export function deleteBackupsRequest(wayhost_id: string) {
  return handleHttpRequest({
    method: "DELETE",
    endpoint: "/api/server/backup",
    queryParams: {
      wayhost_id: wayhost_id,
    },
  });
}
