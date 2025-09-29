import { handleHttpRequest } from "@/lib/http-client";
import { objectToFormData } from "@/lib/utils";
import type { 
  AddZoneParams,
  EditZoneParams,
  GetZonesParams,
} from "../schemas/panel-types";

/**
 * Requête pour la récupération des zones géographiques
 *
 * Envoie une requête pour la récupération des zones géographiques
 *
 */
export function getZonesRequest(params: GetZonesParams) {
  return handleHttpRequest({
    method: "GET",
    endpoint: "/api/auth/zone",
    queryParams: Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    ),
  });
}

/**
 * Requête pour l'ajout d'une zone géographique
 *
 * Envoie une requête pour l'ajout d'une zone géographique
 *
 */
export function addZoneRequest(data: AddZoneParams) {
  const payload = Object.fromEntries(
    Object.entries(data).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return handleHttpRequest({
    method: "POST",
    endpoint: "/api/auth/zone",
    payload: objectToFormData(payload),
  });
}

/**
 * Requête pour la modification d'une zone géographique
 *
 * Envoie une requête pour la modification d'une zone géographique
 *
 */
export function updateZoneRequest(zoneId: string, params: EditZoneParams) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return handleHttpRequest({
    method: "PUT",
    endpoint: `/api/auth/zone`,
    queryParams: {
      id: zoneId,
    },
    payload: objectToFormData(queryParams),
  });
}

/**
 * Requête pour la suppression d'une zone géographique
 *
 * Envoie une requête pour la suppression d'une zone géographique
 *
 */
export function deleteZoneRequest(zoneId: string) {
  return handleHttpRequest({
    method: "DELETE",
    endpoint: `/api/auth/zone`,
    queryParams: {
      id: zoneId,
    },
  });
}

/**
 * Requête pour le changement de zone géographique
 *
 * Envoie une requête pour le changement de zone géographique
 *
 */
export function changeZoneRequest(zoneId: string) {
  return handleHttpRequest({
    method: "PUT",
    endpoint: "/api/auth/switch-zone",
    queryParams: {
      zone_id: zoneId,
    },
  });
}
