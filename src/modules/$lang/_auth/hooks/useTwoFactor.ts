import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  configureTwoFactorAuthRequest,
  disableTwoFactorAuthRequest,
  twoFactorAuthRequest,
  whatsappAuthRequest,
  configureWhatsAppAuthRequest,
  disableWhatsAppAuthRequest,
  validateWhatsAppNumberRequest,
  updateWhatsAppNumberRequest,
  sendOTPCodeRequest,
} from "../requests";
import { useNavigate } from "@tanstack/react-router";
import {
  dataFor2FAAtom,
  disableEmail2FAAtom,
  email2FAStepAtom,
  isWhatsAppNumberConfigDialogOpenAtom,
  show2FAConfigDialogAtom,
  showEmail2FADialogAtom,
  step2FAAtom,
  wantDisableWhatsAppAuthAtom,
} from "../stores";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { userAtom, show2FAAtom, isAuthenticatedAtom } from "../stores";
import type {
  AuthResponseData,
  ConfigureTwoFactorAuthMutationVariables,
  TwoFactorMutationPayload,
} from "../schemas";
import { getCurrentLang } from "@/shared/atoms";

/**
 * Hook pour la connexion avec deux facteurs
 *
 * Gère le processus de connexion avec deux facteurs
 * avec notifications de succès/erreur
 */

export function useTwoFactorAuthMutation() {
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const setShow2FA = useSetAtom(show2FAAtom);
  const setAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setShow2FAConfigDialog = useSetAtom(show2FAConfigDialogAtom);
  const setStep2FA = useSetAtom(step2FAAtom);

  const setShowEmail2FADialog = useSetAtom(showEmail2FADialogAtom);
  const setEmail2FAStep = useSetAtom(email2FAStepAtom);
  const navigate = useNavigate();

  const handleEmailConfigSuccess = () => {
    if (!user) return;
    setUser({ ...user, emailAuthEnabled: true });
    setShowEmail2FADialog(false);
    setEmail2FAStep(1);
  };

  const handleOtpConfigSuccess = () => {
    if (!user) return;

    setUser({ ...user, twoFactorEnabled: true });
    setShow2FAConfigDialog(false);
    setStep2FA(1);
    toast.success("Double authentification activée avec succès !");
  };

  const handleAuthSuccess = (data: AuthResponseData) => {
    const {
      id,
      email,
      firstname,
      lastname,
      accountType,
      roles: { admin: isAdmin },
      "2FA": twoFactorStatus,
      whatsapp_mfa: whatsappMfaStatus,
      phone_number: phoneNumber,
    } = data;

    const userProfile = {
      id,
      email,
      fullName: `${firstname} ${lastname}`,
      twoFactorEnabled: twoFactorStatus === "yes",
      whatsappNumberEnabled: whatsappMfaStatus === "yes",
      whatsappNumber: phoneNumber,
      accountType,
      isAdmin,
    };

    setUser(userProfile);
    setAuthenticated(true);
    setShow2FA(false);

    navigate({to: `/$lang/customer/dashboard`, params: { lang: getCurrentLang() }});
    toast.success("Connexion réussie !");
  };

  return useMutation<any, Error, TwoFactorMutationPayload>({
    mutationFn: async ({ data, type }: TwoFactorMutationPayload) => {
      return await twoFactorAuthRequest(data, type === "email-config" ? "email" : type === "auth" ? "otp": "email" );
    },
    onSuccess: (data, variables) => {
      const { type } = variables;
      switch (type) {
        case "email-config":
          handleEmailConfigSuccess();
          break;
        case "otp-config":
          handleOtpConfigSuccess();
          break;
        default:
          handleAuthSuccess(data);
          break;
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la configuration de l'authentification à deux facteurs {
 * 
 * Gère le processus de configuration de l'authentification à deux facteurs
 * avec notifications de succès/erreur
 */

export function useConfigureTwoFactorAuthMutation() {
  const setStep2FA = useSetAtom(step2FAAtom);
  const setDataFor2FA = useSetAtom(dataFor2FAAtom);

  const setEmail2FAStep = useSetAtom(email2FAStepAtom);
  return useMutation<any, Error, ConfigureTwoFactorAuthMutationVariables>({
    mutationFn: async ({
      data,
      type,
    }: ConfigureTwoFactorAuthMutationVariables) => {
      return await configureTwoFactorAuthRequest(data, type);
    },
    onSuccess: (data: any, variables) => {
      const { type } = variables;
      if (type === "email") {
        setDataFor2FA(data.data);
        setEmail2FAStep(2);
      } else {
        setDataFor2FA(data.data);
        setStep2FA(2);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la désactivation de l'authentification à deux facteurs
 * 
 * Gère le processus de désactivation de l'authentification à deux facteurs
 * avec notifications de succès/erreur
 */

export function useDisableTwoFactorAuthMutation() {
  const setShow2FAConfigDialog = useSetAtom(show2FAConfigDialogAtom);

  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const setShowEmail2FADialog = useSetAtom(showEmail2FADialogAtom);
  const setDisableEmail2FA = useSetAtom(disableEmail2FAAtom);
  return useMutation<any, Error, ConfigureTwoFactorAuthMutationVariables>({
    mutationFn: async ({
      data,
      type,
    }: ConfigureTwoFactorAuthMutationVariables) => {
      return await disableTwoFactorAuthRequest(data, type);
    },
    onSuccess: (variables) => {
      const { type } = variables;
      if (type === "email") {
        setShowEmail2FADialog(false);
        setUser({ ...user!, emailAuthEnabled: false });
        toast.success(
          "Double authentification via email désactivée avec succès !"
        );
        setDisableEmail2FA(false);
      } else {
        setShow2FAConfigDialog(false);
        setUser({ ...user!, twoFactorEnabled: false });
        toast.success("Double authentification désactivée avec succès !");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la configuration de l'authentification via WhatsApp
 * 
 * Gère le processus de configuration de l'authentification via WhatsApp
 * avec notifications de succès/erreur
 */
export function useConfigureWhatsAppAuthMutation() {
  const setStep2FA = useSetAtom(step2FAAtom);

  return useMutation({
    mutationFn: async (data: object) => {
      return await configureWhatsAppAuthRequest(data);
    },
    onSuccess: () => {
      setStep2FA(2);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la désactivation de l'authentification via WhatsApp
 * 
 * Gère le processus de désactivation de l'authentification via WhatsApp
 * avec notifications de succès/erreur
 */
export function useDisableWhatsAppAuthMutation() {
  const setIsWhatsAppNumberConfigDialogOpen = useSetAtom(
    isWhatsAppNumberConfigDialogOpenAtom
  );
  const setWantDisableWhatsAppAuth = useSetAtom(wantDisableWhatsAppAuthAtom);

  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  return useMutation({
    mutationFn: async (data: object) => {
      return await disableWhatsAppAuthRequest(data);
    },
    onSuccess: () => {
      setIsWhatsAppNumberConfigDialogOpen(false);
      setUser({
        ...user!,
        whatsappNumberEnabled: false,
        whatsappNumber: undefined,
      });
      setWantDisableWhatsAppAuth(false);
      toast.success("Authentification via WhatsApp désactivée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour l'authentification via code reçu sur WhatsApp
 * 
 * Gère le processus d'authentification via code reçu sur WhatsApp
 * avec notifications de succès/erreur
 */
export function useWhatsAppAuthMutation() {
  const setUser = useSetAtom(userAtom);
  const setShow2FA = useSetAtom(show2FAAtom);
  const setAuthenticated = useSetAtom(isAuthenticatedAtom);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: object) => {
      return await whatsappAuthRequest(data);
    },
    onSuccess: (data: any) => {
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
      navigate({to: `/$lang/customer/dashboard`, params: { lang: getCurrentLang() }});
      toast.success("Connexion réussie !");
      setShow2FA(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour l'envoi du code de vérification via WhatsApp
 * 
 * Gère le processus d'envoi du code de vérification via WhatsApp
 * avec notifications de succès/erreur
 */
type SendOTPCodeMutationVariables = {
  email: string;
  type?: "email" | "number";
};

export function useSendOTPCodeMutation() {
  return useMutation<any, Error, SendOTPCodeMutationVariables>({
    mutationFn: async ({ email, type }: SendOTPCodeMutationVariables) => {
      return await sendOTPCodeRequest(email, type);
    },
    onSuccess: () => {
      toast.success("Code de vérification envoyé avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la validation du numéro WhatsApp
 * 
 * Gère le processus de validation du numéro WhatsApp
 * avec notifications de succès/erreur
 */
type ValidateWhatsAppNumberMutationVariables = {
  data: object;
  forUpdate: boolean;
};
export function useValidateWhatsAppNumberMutation() {
  const setStep2FA = useSetAtom(step2FAAtom);
  const setIsWhatsAppNumberConfigDialogOpen = useSetAtom(
    isWhatsAppNumberConfigDialogOpenAtom
  );

  const [user, setUser] = useAtom(userAtom);
  return useMutation<any, Error, ValidateWhatsAppNumberMutationVariables>({
    mutationFn: async ({
      data,
      forUpdate,
    }: ValidateWhatsAppNumberMutationVariables) => {
      return await validateWhatsAppNumberRequest(data, forUpdate);
    },
    onSuccess: (data, variables) => {
      const { forUpdate } = variables;

      if (forUpdate) {
        setUser({
          ...user!,
          whatsappNumberEnabled: true,
          whatsappNumber: data.data.whatsapp_number,
        });
        toast.success("Numéro WhatsApp mis à jour avec succès !");
        setIsWhatsAppNumberConfigDialogOpen(false);
        setStep2FA(1);
      } else {
        setUser({
          ...user!,
          whatsappNumberEnabled: true,
          whatsappNumber: data.data.whatsapp_number,
        });
        toast.success("Numéro WhatsApp validé avec succès !");
        setIsWhatsAppNumberConfigDialogOpen(false);
        setStep2FA(1);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook pour la mise à jour du numéro WhatsApp
 * 
 * Gère le processus de mise à jour du numéro WhatsApp
 * avec notifications de succès/erreur
 */
export function useUpdateWhatsAppNumberMutation() {
  const setStep2FA = useSetAtom(step2FAAtom);
  return useMutation({
    mutationFn: async (data: object) => {
      return await updateWhatsAppNumberRequest(data);
    },
    onSuccess: () => {
      setStep2FA(2);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
