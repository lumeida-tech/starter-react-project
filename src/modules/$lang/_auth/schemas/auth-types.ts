import * as z from "zod";
import { signInSchema, forgotPasswordSchema, resetPasswordSchema, signUpSchema, updatePasswordSchema } from "./auth-validations";

// Types exportés basés sur les schémas de validation
export type SignInSchema = z.infer<typeof signInSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

// Types de réponses API
export interface UserData {
  id: string;
  email: string;
  name: string;
}
/**
 * Interface pour les données 2FA
 */
export interface DataFor2FA {
  otp_secret: string;
  qr_url: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserData;
}

export interface LoginResponse {
  token: string;
  user: UserData;
}

/**
 * Interface pour les données utilisateur
 */
export interface User {
  id: string;
  profilePicture?: string;
  email: string;
  fullName: string;
  twoFactorEnabled: boolean;
  emailAuthEnabled?: boolean;
  emailAuthAddress?: string;
  accountType: string;
  walletAmount?: number;
  address?: string;
  phone?: string;
  whatsappNumber?: string;
  whatsappNumberEnabled?: boolean;
  isAdmin: boolean;
  enterpriseName?: string;
  enterpriseSiret?: string;
  enterpriseTva?: string;
  enterpriseSiege?: string;
  enterpriseIsValidated?: boolean;
}

export interface TwoFactorAuth {
  appAuthEnabled: boolean;
  whatsappNumberEnabled: boolean;
  emailAuthEnabled: boolean;
}

export type ConfigureTwoFactorAuthMutationVariables = {
  data: object;
  type?: "email" | "otp";
};

type TwoFactorMutationType = "email-config" | "otp-config" | "auth";

export interface TwoFactorMutationPayload {
  data: Record<string, any>;
  type?: TwoFactorMutationType;
}

export interface AuthResponseData {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  accountType: string;
  "2FA": "yes" | "no";
  whatsapp_mfa: "yes" | "no";
  phone_number?: string;
  roles: {
    admin: boolean;
  };
}
