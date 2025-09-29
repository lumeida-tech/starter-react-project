import { handleHttpRequest } from "@/lib/http-client";

export default async function useGetAvatarObjectUrl(avatarId: string) {
        try {
          const response =   await handleHttpRequest({
            method: 'GET',
            endpoint: `/api/auth/get-users-files?object_id=${avatarId}`,
            responseFormat: 'blob',
          });
    
          const objectURL = URL.createObjectURL(response);
          return objectURL;
        } catch (error) {
          console.error("Erreur lors de la récupération de l'avatar:", error);
          return null;
        }
}
