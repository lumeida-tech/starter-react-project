import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignUpSchema,
} from "../schemas";
import {
  signUpRequest,
  signInRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  resendActivationEmailRequest,
  activateAccountRequest,
  logoutRequest,
  googleLoginRequest,
  axmarilLoginRequest,
  getServiceInCartRequest,
  saveServiceInCartRequest,
  getUserInfoRequest,
} from "../requests/auth-requests";
import { useSetAtom, useAtomValue } from "jotai";
import {
  isSuccessfullyRegisteredAtom,
  show2FAAtom,
  inActiveAlertOpenAtom,
  invitationTokenAtom,
  userAtom,
  isAuthenticatedAtom,
  twoFactorAuthAtom,
  isForgotPasswordFormSubmittedAtom,
} from "../stores/auth-atoms";
import type { CustomHttpError } from "@/lib/http-client";
import { useNavigate } from "@tanstack/react-router";
import { openWindow } from "@/lib/utils";
import { getCurrentLang } from "@/shared/atoms";
import { authCache } from "@/utils/caching";

/**
 * Hook pour l'inscription utilisateur
 *
 * Gère le processus d'inscription avec gestion des succès/erreurs
 * et redirection vers la page de connexion après inscription réussie
 */
export function useRegisterMutation() {
  const setIsSuccessfullyRegistered = useSetAtom(isSuccessfullyRegisteredAtom);
  const invitationToken = useAtomValue(invitationTokenAtom);

  return useMutation({
    mutationFn: async (data: SignUpSchema) => {
      const response = await signUpRequest(data, invitationToken);
      return response;
    },
    onSuccess: () => {
      setIsSuccessfullyRegistered(true);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la connexion utilisateur
 *
 * Gère le processus de connexion avec gestion des succès/erreurs
 * et redirection vers le tableau de bord après connexion réussie
 */
export function useLoginMutation() {
  const setShow2FA = useSetAtom(show2FAAtom);
  const setInActiveAlertOpen = useSetAtom(inActiveAlertOpenAtom);
  const setUser = useSetAtom(userAtom);
  const setAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setTwoFactorAuth = useSetAtom(twoFactorAuthAtom);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: any) => {
      return await signInRequest(data);
    },
    onSuccess: (data: any) => {
      const newTwoFactorAuth = {
        appAuthEnabled: data["2FA"] === "yes",
        whatsappNumberEnabled: data["whatsapp_mfa"] === "yes",
        emailAuthEnabled: data["email_mfa"] === "yes",
      };

      setTwoFactorAuth(newTwoFactorAuth);
      if (
        newTwoFactorAuth.appAuthEnabled ||
        newTwoFactorAuth.whatsappNumberEnabled ||
        newTwoFactorAuth.emailAuthEnabled
      ) {
        setShow2FA(true);
      } else {
        toast.success("Connexion réussie !");
        const {
          id,
          email,
          firstname,
          lastname,
          accountType,
          roles: { admin: isAdmin },
        } = data;
        setUser({
          id,
          email,
          fullName: `${firstname} ${lastname}`,
          twoFactorEnabled: data["2FA"] === "yes",
          whatsappNumberEnabled: data["whatsapp_mfa"] === "yes",
          whatsappNumber: data["phone_number"],
          accountType,
          isAdmin,
        });
        setAuthenticated(true);

        if (window.location.pathname.split("/")[3] === "account") {
          //return navigate({to: `/cart/facturation`});
        }

        if (window.location.pathname.split("/")[4] === "account") {
          // return navigate({to: `/checkout/${window.location.pathname.split("/")[3]}/facturation`});
        }
        navigate({to: `/$lang/customer/dashboard`, params: { lang: getCurrentLang() }});
      }
    },
    onError: (error: CustomHttpError) => {
      error.status == 403
        ? setInActiveAlertOpen(true)
        : toast.error(error.message);
    },
  });
}

/**
 * Hook pour l'activation du compte utilisateur
 *
 * Gère le processus d'activation du compte utilisateur
 * avec notifications de succès/erreur
 */
export function useActivateAccountMutation() {
  return useMutation({
    mutationFn: async (token: string) => {
      return await activateAccountRequest(token);
    },
  });
}

/**
 * Hook pour la demande de réinitialisation de mot de passe
 *
 * Gère le processus d'envoi d'un lien de réinitialisation
 * de mot de passe avec notifications de succès/erreur
 */
export function useForgotPasswordMutation() {
  const setIsForgotPasswordFormSubmitted = useSetAtom(
    isForgotPasswordFormSubmittedAtom
  );
  return useMutation({
    mutationFn: async (data: ForgotPasswordSchema) => {
      return await forgotPasswordRequest(data);
    },
    onSuccess: () => {
      setIsForgotPasswordFormSubmitted(true);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la réinitialisation de mot de passe
 *
 * Gère le processus de définition d'un nouveau mot de passe
 * avec notifications de succès/erreur
 */
export function useResetPasswordMutation() {
  const setIsForgotPasswordFormSubmitted = useSetAtom(
    isForgotPasswordFormSubmittedAtom
  );
  return useMutation({
    mutationFn: async (payload: {
      data: ResetPasswordSchema;
      token: string;
    }) => {
      return await resetPasswordRequest(payload.data, payload.token);
    },
    onSuccess: () => {
      setIsForgotPasswordFormSubmitted(true);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour renvoyer l'email d'activation
 *
 * Gère le processus de renvoi d'un email d'activation
 * avec notifications de succès/erreur
 */
export function useResendActivationEmailMutation() {
  return useMutation({
    mutationFn: async (email: string) => {
      return await resendActivationEmailRequest(email);
    },
    onSuccess: () => {
      toast.success("Email d'activation renvoyé avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la connexion avec Google
 *
 * Gère le processus de connexion avec Google
 * avec notifications de succès/erreur
 */
export function useGoogleLoginMutation() {
  return useMutation({
    mutationFn: async (redirectUrl: string) => {
      return await googleLoginRequest(redirectUrl);
    },
    onSuccess: (data) => {
      openWindow(data.redirect_url);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la connexion avec AXMARIL
 *
 * Gère le processus de connexion avec AXMARIL
 * avec notifications de succès/erreur
 */
export function useAxmarilLoginMutation() {
  return useMutation({
    mutationFn: async (redirectUrl: string) => {
      return await axmarilLoginRequest(redirectUrl);
    },
    onSuccess: (data) => {
      openWindow(data.redirect_uri);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la déconnexion
 *
 * Gère le processus de déconnexion
 * avec notifications de succès/erreur
 */
export function useLogoutMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      return await logoutRequest();
    },
    onSuccess: () => {
      authCache.clear();
      toast.success("Déconnexion réussie");
      navigate({to: `/$lang/sign-in`, params: { lang: getCurrentLang() }});
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la récupération des services ajouté
 * par le client dans le panier
 *
 * Envoie une requête pour la récupération des services
 */
export function useGetServiceInCartQuery() {
  return useQuery({
    queryFn: async () => {
      return await getServiceInCartRequest();
    },
    queryKey: ["get-service-in-cart"],
  });
}

/**
 * Hook pour Sauvegarder les services sélectionné
 * par le client dans le panier
 *
 * Gère le processus de sauvegarde des services
 *
 */
export function useSaveServiceInCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: object) => {
      return await saveServiceInCartRequest(payload);
    },
    onSuccess: () => { },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["save-service-in-cart"] });
    },
  });
}

/**
 * Hook pour la récupération des informations de l'utilisateur
 * 
 * Gère le processus de récupération des informations de l'utilisateur
 * avec notifications de succès/erreur
 */
export function useUserInfoQuery() {
  return useQuery({
    queryFn: async () => {
      return await getUserInfoRequest();
    },
    queryKey: ["user-info"],
  });
}
