import * as z from "zod";

/**
 * Constantes partagées pour la validation
 */
const EMAIL_PATTERN = {
  invalid: "Email invalide",
};

const PASSWORD_PATTERNS = {
  min: (length: number) =>
    `Le mot de passe doit contenir au moins ${length} caractères`,
  uppercase: "Le mot de passe doit contenir au moins une majuscule",
  digit: "Le mot de passe doit contenir au moins un chiffre",
  special: "Le mot de passe doit contenir au moins un caractère spécial",
  mismatch: "Les mots de passe ne correspondent pas",
};

const FIELD_PATTERNS = {
  required: (field: string) => `${field} est requis`,
  minLength: (field: string, length: number) =>
    `${field} doit contenir au moins ${length} caractères`,
};

/**
 * Définitions des champs réutilisables
 */
const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: EMAIL_PATTERN.invalid });

const passwordField = z
  .string()
  .min(8, { message: PASSWORD_PATTERNS.min(8) })
  .regex(/[A-Z]/, { message: PASSWORD_PATTERNS.uppercase })
  .regex(/[0-9]/, { message: PASSWORD_PATTERNS.digit })
  .regex(/[^A-Za-z0-9]/, { message: PASSWORD_PATTERNS.special });

const simplePasswordField = z
  .string()
  .min(6, { message: PASSWORD_PATTERNS.min(6) });

/**
 * Schéma de validation pour la connexion
 */
export const signInSchema = z.object({
  username: z.string().trim(),
  password: simplePasswordField,
});

/**
 * Schéma de validation pour le code OTP
 */
export const otpSchema = z.object({
  code: z.string().min(6, {
    message: "Le code OTP doit contenir 6 chiffres.",
  }),
});

/**
 * Schéma de validation pour la récupération de mot de passe
 */
export const forgotPasswordSchema = z.object({
  email: emailField,
});

/**
 * Schéma de validation pour la réinitialisation du mot de passe
 */
export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: PASSWORD_PATTERNS.mismatch,
    path: ["confirmPassword"],
  });

/**
 * Schéma de validation pour l'inscription
 */
export const signUpSchema = z
  .object({
    firstname: z
      .string()
      .trim()
      .min(3, { message: FIELD_PATTERNS.minLength("Le prénom", 3) }),

    lastname: z
      .string()
      .trim()
      .min(3, { message: FIELD_PATTERNS.minLength("Le nom", 3) }),

    email: emailField,
    password: passwordField,
    confirmPassword: z.string(),
    accountType: z.enum(["user", "enterprise"]),

    // Champs spécifiques pour les entreprises
    name: z.string().trim().optional(),
    siret_number: z.string().trim().optional(),
    head_office: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    // Validation des mots de passe
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: PASSWORD_PATTERNS.mismatch,
        path: ["confirmPassword"],
      });
    }

    // Validations spécifiques pour les comptes entreprise
    if (data.accountType === "enterprise") {
      // Validation nom d'entreprise
      if (!data.name || data.name.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            FIELD_PATTERNS.required("Le nom de l'entreprise") +
            " pour un compte professionnel",
          path: ["name"],
        });
      }

      // Validation SIRET
      if (!data.siret_number) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            FIELD_PATTERNS.required("Le numéro SIRET") +
            " pour un compte professionnel",
          path: ["siret_number"],
        });
      } else if (!/^\d{14}$/.test(data.siret_number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le numéro SIRET doit contenir exactement 14 chiffres",
          path: ["siret_number"],
        });
      }

      // Validation adresse
      if (!data.head_office) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            FIELD_PATTERNS.required("L'adresse") +
            " pour un compte professionnel",
          path: ["head_office"],
        });
      }
    }
  });

/**
 * Schéma de validation pour la mise à jour du mot de passe
 */
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: passwordField,
    confirmPassword: passwordField,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: PASSWORD_PATTERNS.mismatch,
    path: ["confirmPassword"],
  });
