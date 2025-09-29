import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getZonesRequest,
  addZoneRequest,
  updateZoneRequest,
  deleteZoneRequest,
  changeZoneRequest,
} from "../requests/zones-requests";
import type {
  GetZonesParams,
  AddZoneParams,
  EditZoneParams,
} from "../schemas/panel-types";

/**
 * Hook pour la récupération des zones géographiques
 *
 * Gère le processus de récupération des zones géographiques
 *
 */
export function useZonesQuery(params: GetZonesParams) {
  return useQuery({
    queryFn: async () => {
      return await getZonesRequest(params);
    },
    queryKey: ["get-zones-all"],
  });
}

/**
 * Hook pour l'ajout d'une zone géographique
 *
 * Gère le processus d'ajout d'une zone géographique
 *
 */
export function useAddZoneMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AddZoneParams) => {
      return await addZoneRequest(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-zones-all"] });
      toast.success("Zone géographique ajoutée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de la zone géographique");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-zones-all"] });
    },
  });
}

/**
 * Hook pour la modification d'une zone géographique
 *
 * Gère le processus de modification d'une zone géographique
 *
 */
export function useUpdateZoneMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      zoneId,
      params,
    }: {
      zoneId: string;
      params: EditZoneParams;
    }) => {
      return await updateZoneRequest(zoneId, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-zones-all"] });
      toast.success("Zone géographique modifiée avec succès");
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: () => {
      toast.error("Erreur lors de la modification de la zone géographique");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-zones-all"] });
    },
  });
}

/**
 * Hook pour la suppression d'une zone géographique
 *
 * Gère le processus de suppression d'une zone géographique
 *
 */
export function useDeleteZoneMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (zoneId: string) => {
      return await deleteZoneRequest(zoneId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-zones-all"] });
      toast.success("Zone géographique supprimée avec succès");
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la zone géographique");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-zones-all"] });
    },
  });
}

/**
 * Hook pour le changement de zone géographique
 *
 * Gère le processus de changement de zone géographique
 *
 */
export function useChangeZoneMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (zoneId: string) => {
      return await changeZoneRequest(zoneId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-zones-all"] });
      toast.success("Zone géographique changée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors du changement de la zone géographique");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-zones-all"] });
    },
  });
}
