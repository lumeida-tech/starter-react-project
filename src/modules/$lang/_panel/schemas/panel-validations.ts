import * as z from "zod";

/**
 * Constantes partagées pour la validation des offres serveurs
 */
const SERVER_OFFER_PATTERNS = {
  required: (field: string) => `${field} est requis`,
  minLength: (field: string, length: number) =>
    `${field} doit contenir au moins ${length} caractères`,
  minValue: (field: string, value: number) =>
    `${field} doit être supérieur ou égal à ${value}`,
  maxValue: (field: string, value: number) =>
    `${field} doit être inférieur ou égal à ${value}`,
  positive: (field: string) => `${field} doit être un nombre positif`,
  array: (field: string) => `${field} doit contenir au moins un élément`,
};

/**
 * Types d'offres serveur disponibles
 */
const SERVER_TYPES = [
  "vps",
  "dedicated",
  "physical",
  "gpu",
  "custom",
  "mutualized",
  "vps_mutualized",
] as const;

/**
 * Validation des zones géographiques avec structure zones_info
 */
const zoneValidation = {
  zones_info: z
    .record(
      z.object({
        os: z.array(z.string()),
      })
    )
    .optional(),
};

/**
 * Validation des spécifications techniques
 */
const technicalSpecsValidation = {
  ram: z
    .number()
    .min(1, {
      message: SERVER_OFFER_PATTERNS.minValue("La RAM", 1),
    })
    .max(1024, {
      message: SERVER_OFFER_PATTERNS.maxValue("La RAM", 1024),
    }),
  disk: z
    .number()
    .min(1, {
      message: SERVER_OFFER_PATTERNS.minValue("Le disque", 1),
    })
    .max(10000, {
      message: SERVER_OFFER_PATTERNS.maxValue("Le disque", 10000),
    }),
  vcpus: z
    .number()
    .min(1, {
      message: SERVER_OFFER_PATTERNS.minValue("Le nombre de vCPUs", 1),
    })
    .max(128, {
      message: SERVER_OFFER_PATTERNS.maxValue("Le nombre de vCPUs", 128),
    }),
};

/**
 * Validation des prix
 */
const priceValidation = z.object({
  m: z.number().min(0.01, {
    message: SERVER_OFFER_PATTERNS.positive("Le prix mensuel"),
  }),
  y: z.number().min(0.01, {
    message: SERVER_OFFER_PATTERNS.positive("Le prix annuel"),
  }),
});

/**
 * Schéma de base pour l'offre serveur (sans les validations complexes)
 */
const baseServerOfferSchema = z.object({
  // Informations géographiques (optionnelles)
  ...zoneValidation,

  // Informations générales
  type: z.enum(SERVER_TYPES, {
    errorMap: () => ({ message: "Le type de serveur est requis" }),
  }),

  name: z
    .string()
    .trim()
    .min(3, { message: SERVER_OFFER_PATTERNS.minLength("Le nom", 3) })
    .max(100, { message: SERVER_OFFER_PATTERNS.maxValue("Le nom", 100) }),

  public: z.boolean(),
  popular: z.boolean(),

  description: z
    .string()
    .trim()
    .min(10, { message: SERVER_OFFER_PATTERNS.minLength("La description", 10) })
    .max(1000, {
      message: SERVER_OFFER_PATTERNS.maxValue("La description", 1000),
    }),

  // Prix et économies
  price: priceValidation,

  savings_percentage: z
    .number()
    .min(0, {
      message: SERVER_OFFER_PATTERNS.minValue("Le pourcentage d'économie", 0),
    })
    .max(100, {
      message: SERVER_OFFER_PATTERNS.maxValue("Le pourcentage d'économie", 100),
    }),

  savings_money: z.number().min(0, {
    message: SERVER_OFFER_PATTERNS.minValue("Le montant d'économie", 0),
  }),

  // Spécifications techniques
  ...technicalSpecsValidation,

  // Upsells optionnels
  upsell: z
    .array(
      z.string().trim().min(1, {
        message: "Le nom de l'upsell ne peut pas être vide",
      })
    )
    .optional(),
});

/**
 * Schéma de validation pour l'ajout d'une offre serveur
 */
export const addServerOfferSchema = baseServerOfferSchema.superRefine(
  (data, ctx) => {
    // Validation cohérence prix mensuel vs annuel
    const expectedYearlyPrice = data.price.m * 12;
    const actualSavings = expectedYearlyPrice - data.price.y;
    const calculatedSavingsPercentage =
      (actualSavings / expectedYearlyPrice) * 100;

    // Vérifier que le prix annuel offre bien une réduction
    if (data.price.y >= expectedYearlyPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le prix annuel doit être inférieur au prix mensuel × 12",
        path: ["price", "y"],
      });
    }

    // Vérifier la cohérence du pourcentage d'économie
    const tolerancePercentage = 1; // 1% de tolérance
    if (
      Math.abs(calculatedSavingsPercentage - data.savings_percentage) >
      tolerancePercentage
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Le pourcentage d'économie doit correspondre à la différence de prix (calculé: ${calculatedSavingsPercentage.toFixed(
          2
        )}%)`,
        path: ["savings_percentage"],
      });
    }
  }
);

/**
 * Schéma de validation pour la mise à jour d'une offre serveur
 */
export const updateServerOfferSchema = baseServerOfferSchema
  .partial({
    type: true, // Le type ne peut pas être modifié après création
  })
  .superRefine((data, ctx) => {
    // Ne pas appliquer les validations complexes si les champs nécessaires ne sont pas présents
    if (!data.price) return;

    // Validation cohérence prix mensuel vs annuel
    const expectedYearlyPrice = data.price.m * 12;
    const actualSavings = expectedYearlyPrice - data.price.y;
    const calculatedSavingsPercentage =
      (actualSavings / expectedYearlyPrice) * 100;

    // Vérifier que le prix annuel offre bien une réduction
    if (data.price.y >= expectedYearlyPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le prix annuel doit être inférieur au prix mensuel × 12",
        path: ["price", "y"],
      });
    }

    // Vérifier la cohérence du pourcentage d'économie si fourni
    if (data.savings_percentage !== undefined) {
      const tolerancePercentage = 1; // 1% de tolérance
      if (
        Math.abs(calculatedSavingsPercentage - data.savings_percentage) >
        tolerancePercentage
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Le pourcentage d'économie doit correspondre à la différence de prix (calculé: ${calculatedSavingsPercentage.toFixed(
            2
          )}%)`,
          path: ["savings_percentage"],
        });
      }
    }

    // Vérifier la cohérence du montant d'économie si fourni
    if (data.savings_money !== undefined) {
      if (Math.abs(actualSavings - data.savings_money) > 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Le montant d'économie doit correspondre à la différence de prix (calculé: ${actualSavings.toFixed(
            2
          )}€)`,
          path: ["savings_money"],
        });
      }
    }
  });

/**
 * Types de systèmes d'exploitation disponibles
 */
const OS_TYPES = ["linux", "windows", "unix", "bsd"] as const;

/**
 * Schéma de validation pour l'ajout d'un système d'exploitation (formulaire)
 */
export const addOsSchema = z
  .object({
    // Informations de base
    name: z
      .string()
      .trim()
      .min(2, { message: SERVER_OFFER_PATTERNS.minLength("Le nom", 2) })
      .max(100, { message: SERVER_OFFER_PATTERNS.maxValue("Le nom", 100) }),

    type: z.enum(OS_TYPES, {
      errorMap: () => ({
        message: "Le type de système d'exploitation est requis",
      }),
    }),

    version: z
      .string()
      .trim()
      .min(1, { message: SERVER_OFFER_PATTERNS.minLength("La version", 2) }),

    // Spécifications techniques individuelles (pour le formulaire)
    ...technicalSpecsValidation,

    // Informations des zones géographiques
    zones_info: z.record(z.string()),

    // Logo
    files: z.union([z.string(), z.instanceof(File)]),
  })
  .transform((data) => {
    // Transformation automatique des champs individuels en supported_specs JSON
    return {
      name: data.name,
      type: data.type,
      version: data.version,
      supported_specs: JSON.stringify({
        c: data.vcpus,
        m: data.ram,
        d: data.disk,
      }),
      zones_info: data.zones_info ? JSON.stringify(data.zones_info) : undefined,
      files: data.files,
    };
  });

/**
 * Schéma de validation pour la modification d'un système d'exploitation
 */
export const updateOsSchema = z
  .object({
    // Informations de base
    name: z
      .string()
      .trim()
      .min(2, { message: SERVER_OFFER_PATTERNS.minLength("Le nom", 2) })
      .max(100, { message: SERVER_OFFER_PATTERNS.maxValue("Le nom", 100) })
      .optional(),

    type: z
      .enum(OS_TYPES, {
        errorMap: () => ({
          message: "Le type de système d'exploitation est requis",
        }),
      })
      .optional(),

    version: z
      .string()
      .trim()
      .min(1, { message: SERVER_OFFER_PATTERNS.minLength("La version", 2) })
      .optional(),

    // Spécifications techniques individuelles (pour le formulaire)
    vcpus: technicalSpecsValidation.vcpus.optional(),
    ram: technicalSpecsValidation.ram.optional(),
    disk: technicalSpecsValidation.disk.optional(),

    // Informations des zones géographiques
    zones_info: z.record(z.string()),

    // Logo (optionnel)
    files: z
      .union([z.string().optional(), z.instanceof(File).optional()])
      .optional(),
  })
  .transform((data) => {
    // Transformer les champs individuels en supported_specs JSON (si présents)
    const result: any = {
      name: data.name,
      type: data.type,
      version: data.version,
      zones_info: data.zones_info ? JSON.stringify(data.zones_info) : undefined,
      files: data.files,
    };

    // Ajouter supported_specs seulement si au moins une spécification est fournie
    if (
      data.vcpus !== undefined ||
      data.ram !== undefined ||
      data.disk !== undefined
    ) {
      result.supported_specs = JSON.stringify({
        c: data.vcpus || 1,
        m: data.ram || 1,
        d: data.disk || 20,
      });
    }

    return result;
  });

/**
 * Constantes pour la validation des codes promo
 */
const PROMO_CODE_PATTERNS = {
  required: (field: string) => `${field} est requis`,
  minLength: (field: string, length: number) =>
    `${field} doit contenir au moins ${length} caractères`,
  maxLength: (field: string, length: number) =>
    `${field} ne peut pas dépasser ${length} caractères`,
  minValue: (field: string, value: number) =>
    `${field} doit être supérieur ou égal à ${value}`,
  maxValue: (field: string, value: number) =>
    `${field} doit être inférieur ou égal à ${value}`,
  invalidFormat: (field: string) => `Format de ${field} invalide`,
  futureDate: (field: string) => `${field} doit être dans le futur`,
  invalidEmail: "Adresse email invalide",
};

/**
 * Types de remise disponibles
 */
const DISCOUNT_TYPES = ["percentage", "fixed"] as const;

/**
 * Types de cible disponibles
 */
const TARGET_TYPES = ["all", "new", "specific"] as const;

/**
 * Cycles de facturation disponibles
 */
const BILLING_CYCLES = ["monthly", "yearly"] as const;

/**
 * Validation du code promo
 */
const promoCodeValidation = z
  .string()
  .trim()
  .min(3, { message: PROMO_CODE_PATTERNS.minLength("Le code promo", 3) })
  .max(50, { message: PROMO_CODE_PATTERNS.maxLength("Le code promo", 50) })
  .regex(/^[A-Z0-9_-]+$/i, {
    message:
      "Le code promo ne peut contenir que des lettres, chiffres, tirets et underscores",
  });

/**
 * Validation de la valeur de remise
 */
const discountValueValidation = z
  .number()
  .min(0.01, { message: PROMO_CODE_PATTERNS.minValue("La valeur", 0.01) });

/**
 * Validation des dates
 */
const dateValidation = z
  .string()
  .min(1, { message: PROMO_CODE_PATTERNS.required("La date") });

/**
 * Validation du temps
 */
const timeValidation = z
  .string()
  .min(1, { message: PROMO_CODE_PATTERNS.required("L'heure") })
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Format d'heure invalide (HH:MM)",
  });

/**
 * Validation des emails dans target_users
 */
const emailArrayValidation = z
  .array(z.string().email({ message: PROMO_CODE_PATTERNS.invalidEmail }).trim())
  .optional();

/**
 * Schéma de base pour les codes promo
 */
const basePromoCodeSchema = z.object({
  code: promoCodeValidation,

  discount_type: z.enum(DISCOUNT_TYPES, {
    errorMap: () => ({ message: "Le type de remise est requis" }),
  }),

  value: discountValueValidation,

  start_date: dateValidation,
  start_time: timeValidation,
  expiration_date: dateValidation,
  expiration_time: timeValidation,

  max_usage: z
    .number()
    .min(1, { message: PROMO_CODE_PATTERNS.minValue("L'usage maximum", 1) })
    .max(100000, {
      message: PROMO_CODE_PATTERNS.maxValue("L'usage maximum", 100000),
    }),

  target_type: z.enum(TARGET_TYPES, {
    errorMap: () => ({ message: "Le type de cible est requis" }),
  }),

  target_users: emailArrayValidation,

  min_purchase: z
    .number()
    .min(0, { message: PROMO_CODE_PATTERNS.minValue("L'achat minimum", 0) }),

  is_active: z.boolean(),

  applicables_offers: z.array(z.string().trim().min(1)).optional(),

  applicables_cycles: z.array(z.enum(BILLING_CYCLES)).min(1, {
    message: "Au moins un cycle de facturation doit être sélectionné",
  }),

  one_time_per_user: z.boolean(),

  per_user_limit: z
    .number()
    .min(1, {
      message: PROMO_CODE_PATTERNS.minValue("La limite par utilisateur", 1),
    })
    .max(1000, {
      message: PROMO_CODE_PATTERNS.maxValue("La limite par utilisateur", 1000),
    }),
});

/**
 * Schéma de validation pour l'ajout d'un code promo
 */
export const addPromoCodeSchema = basePromoCodeSchema.superRefine(
  (data, ctx) => {
    // Validation de la valeur selon le type de remise
    if (data.discount_type === "percentage" && data.value > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le pourcentage ne peut pas dépasser 100%",
        path: ["value"],
      });
    }

    // Validation des dates
    const startDateTime = new Date(`${data.start_date}T${data.start_time}`);
    const expirationDateTime = new Date(
      `${data.expiration_date}T${data.expiration_time}`
    );
    const now = new Date();

    if (startDateTime <= now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La date de début doit être dans le futur",
        path: ["start_date"],
      });
    }

    if (expirationDateTime <= startDateTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "La date d'expiration doit être postérieure à la date de début",
        path: ["expiration_date"],
      });
    }

    // Validation des utilisateurs cibles
    if (
      data.target_type === "specific" &&
      (!data.target_users || data.target_users.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Au moins un utilisateur doit être spécifié pour ce type",
        path: ["target_users"],
      });
    }

    if (
      data.target_type === "new" &&
      data.target_users &&
      data.target_users.length > 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Aucun utilisateur ne doit être spécifié pour ce type",
        path: ["target_users"],
      });
    }
  }
);

/**
 * Schéma de validation pour la modification d'un code promo
 */
export const updatePromoCodeSchema = basePromoCodeSchema
  .partial()
  .superRefine((data, ctx) => {
    // Validation de la valeur selon le type de remise (si fournie)
    if (data.discount_type === "percentage" && data.value && data.value > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le pourcentage ne peut pas dépasser 100%",
        path: ["value"],
      });
    }

    // Validation des dates (si fournies)
    if (
      data.start_date &&
      data.start_time &&
      data.expiration_date &&
      data.expiration_time
    ) {
      const startDateTime = new Date(`${data.start_date}T${data.start_time}`);
      const expirationDateTime = new Date(
        `${data.expiration_date}T${data.expiration_time}`
      );

      if (expirationDateTime <= startDateTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "La date d'expiration doit être postérieure à la date de début",
          path: ["expiration_date"],
        });
      }
    }

    // Validation des utilisateurs cibles (si fournie)
    if (
      data.target_type === "specific" &&
      (!data.target_users || data.target_users.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Au moins un utilisateur doit être spécifié pour ce type",
        path: ["target_users"],
      });
    }

    if (
      data.target_type === "new" &&
      data.target_users &&
      data.target_users.length > 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Aucun utilisateur ne doit être spécifié pour ce type",
        path: ["target_users"],
      });
    }
  });

/**
 * Constantes pour la validation des groupes de sécurité
 */
const SECURITY_GROUP_PATTERNS = {
  required: (field: string) => `${field} est requis`,
  minLength: (field: string, length: number) =>
    `${field} doit contenir au moins ${length} caractères`,
  maxLength: (field: string, length: number) =>
    `${field} ne peut pas dépasser ${length} caractères`,
  invalidFormat: (field: string) => `Format de ${field} invalide`,
  array: (field: string) => `${field} doit contenir au moins un élément`,
};

/**
 * Directions de règles disponibles
 */
const RULE_DIRECTIONS = ["ingress", "egress"] as const;

/**
 * Types Ethernet disponibles
 */
const ETHER_TYPES = ["IPv4", "IPv6"] as const;

/**
 * Validation des règles de sécurité
 */
const securityRuleValidation = z.object({
  cidr: z
    .string()
    .trim()
    .min(1, { message: SECURITY_GROUP_PATTERNS.required("CIDR") })
    .regex(
      /^(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}\/(?:[0-9]|[1-2][0-9]|3[0-2])|(?:[0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}\/(?:[0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))$/,
      { message: "Format CIDR invalide (ex: 192.168.1.0/24 ou 2001:db8::/32)" }
    ),

  direction: z.enum(RULE_DIRECTIONS, {
    errorMap: () => ({ message: "La direction est requise" }),
  }),

  ethertype: z.enum(ETHER_TYPES, {
    errorMap: () => ({ message: "Le type Ethernet est requis" }),
  }),

  from_port: z
    .number()
    .min(1, { message: "Le port source doit être supérieur à 0" }),

  ip_protocol: z
    .string()
    .trim()
    .min(1, { message: SECURITY_GROUP_PATTERNS.required("Protocole IP") }),

  to_port: z
    .number()
    .min(1, { message: "Le port destination doit être supérieur à 0" }),
});

/**
 * Schéma de validation pour le formulaire principal de groupe de sécurité
 * (name, description, rules - sans champs temporaires)
 */
export const securityGroupMainSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: SECURITY_GROUP_PATTERNS.minLength("Le nom", 3) })
      .max(100, { message: SECURITY_GROUP_PATTERNS.maxLength("Le nom", 100) }),

    description: z
      .string()
      .trim()
      .max(500, {
        message: SECURITY_GROUP_PATTERNS.maxLength("La description", 500),
      })
      .optional(),

    rules: z
      .array(securityRuleValidation)
      .min(1, {
        message: SECURITY_GROUP_PATTERNS.array("Les règles"),
      })
      .max(999, { message: "Maximum 999 règles autorisées" }),
  })
  .superRefine((data, ctx) => {
    // Validation de la cohérence des ports
    data.rules.forEach((rule, index) => {
      if (rule.from_port > rule.to_port) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Le port source doit être inférieur ou égal au port destination",
          path: ["rules", index, "from_port"],
        });
      }
    });
  });

/**
 * Schéma de validation pour l'ajout d'une règle (formulaire temporaire)
 * Ajoute la validation de cohérence des ports
 */
export const newRuleSchema = securityRuleValidation.superRefine((data, ctx) => {
  // Validation de la cohérence des ports lors de l'ajout d'une règle
  if (data.from_port > data.to_port) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Le port source doit être inférieur ou égal au port destination",
      path: ["from_port"],
    });
  }
});

/**
 * Schéma de validation pour la modification d'un groupe de sécurité
 */
export const updateSecurityGroupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: SECURITY_GROUP_PATTERNS.minLength("Le nom", 3) })
      .max(100, { message: SECURITY_GROUP_PATTERNS.maxLength("Le nom", 100) })
      .optional(),
    description: z
      .string()
      .trim()
      .max(500, {
        message: SECURITY_GROUP_PATTERNS.maxLength("La description", 500),
      })
      .optional(),

    rules: z
      .array(securityRuleValidation)
      .max(999, { message: "Maximum 999 règles autorisées" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validation de la cohérence des ports
    data.rules?.forEach((rule, index) => {
      if (rule.from_port > rule.to_port) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Le port source doit être inférieur ou égal au port destination",
          path: ["rules", index, "from_port"],
        });
      }
    });
  });

/**
 * Types inférés des schémas
 */
export type SecurityGroupMain = z.infer<typeof securityGroupMainSchema>;
export type NewRule = z.infer<typeof newRuleSchema>;

/**
 * Constantes pour la validation des zones géographiques
 */
const ZONE_PATTERNS = {
  required: (field: string) => `${field} est requis`,
  minLength: (field: string, length: number) =>
    `${field} doit contenir au moins ${length} caractères`,
  maxLength: (field: string, length: number) =>
    `${field} ne peut pas dépasser ${length} caractères`,
  invalidFormat: (field: string) => `Format de ${field} invalide`,
  invalidCoordinate: (field: string) =>
    `${field} doit être une coordonnée valide`,
};

/**
 * Types de statuts disponibles pour les zones
 */
const ZONE_STATUS_TYPES = ["Active", "Down", "Maintenance", "Restarting", "Degraded"] as const;

/**
 * Types de continents disponibles
 */
const CONTINENT_TYPES = [
  "Europe",
  "North America",
  "South America",
  "Asia",
  "Africa",
] as const;

/**
 * Validation des coordonnées GPS
 */
const coordinateValidation = {
  latitude: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Optionnel
        const num = parseFloat(val);
        return !isNaN(num) && num >= -90 && num <= 90;
      },
      {
        message: ZONE_PATTERNS.invalidCoordinate("La latitude"),
      }
    ),
  longitude: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Optionnel
        const num = parseFloat(val);
        return !isNaN(num) && num >= -180 && num <= 180;
      },
      {
        message: ZONE_PATTERNS.invalidCoordinate("La longitude"),
      }
    ),
};

/**
 * Schéma de base pour les zones géographiques
 */
const baseZoneSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: ZONE_PATTERNS.minLength("Le nom", 2) })
    .max(100, { message: ZONE_PATTERNS.maxLength("Le nom", 100) })
    .optional(),

  country: z
    .string()
    .trim()
    .min(2, { message: ZONE_PATTERNS.minLength("Le pays", 2) })
    .max(100, { message: ZONE_PATTERNS.maxLength("Le pays", 100) }),

  continent: z.enum(CONTINENT_TYPES, {
    errorMap: () => ({ message: "Le continent est requis" }),
  }),

  status: z.enum(ZONE_STATUS_TYPES, {
    errorMap: () => ({ message: "Le statut est requis" }),
  }),

  flag: z
    .string()
    .trim()
    .min(2, { message: ZONE_PATTERNS.minLength("Le code du drapeau", 2) })
    .max(2, { message: ZONE_PATTERNS.maxLength("Le code du drapeau", 2) })
    .optional(),

  town: z
    .string()
    .trim()
    .max(100, { message: ZONE_PATTERNS.maxLength("La ville", 100) })
    .optional(),

  files: z.union([z.string(), z.instanceof(File)]).optional(),

  ...coordinateValidation,
});

/**
 * Schéma de validation pour l'ajout d'une zone géographique
 */
export const addZoneSchema = baseZoneSchema.superRefine((data, ctx) => {
  // Validation que si latitude est fournie, longitude doit l'être aussi
  if (data.latitude && !data.longitude) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La longitude est requise si la latitude est fournie",
      path: ["longitude"],
    });
  }

  if (data.longitude && !data.latitude) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La latitude est requise si la longitude est fournie",
      path: ["latitude"],
    });
  }

  // Validation du format du flag (code pays ISO)
  if (data.flag && !/^[a-z]{2}$/i.test(data.flag)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "Le code du drapeau doit être un code pays ISO à 2 lettres (ex: fr, us)",
      path: ["flag"],
    });
  }
});

/**
 * Schéma de validation pour la modification d'une zone géographique
 */
export const updateZoneSchema = baseZoneSchema
  .partial()
  .superRefine((data, ctx) => {
    // Même validation que pour l'ajout mais avec des champs optionnels
    if (data.latitude && !data.longitude) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La longitude est requise si la latitude est fournie",
        path: ["longitude"],
      });
    }

    if (data.longitude && !data.latitude) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La latitude est requise si la longitude est fournie",
        path: ["latitude"],
      });
    }

    if (data.flag && !/^[a-z]{2}$/i.test(data.flag)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Le code du drapeau doit être un code pays ISO à 2 lettres (ex: fr, us)",
        path: ["flag"],
      });
    }
  });

export const addSshKeySchema = z.object({
  key_name: z
    .string()
    .trim()
    .min(1, { message: "Le nom de la clé est requis" })
    .max(100, {
      message: "Le nom de la clé ne peut pas dépasser 100 caractères",
    }),
  public_key: z
    .string()
    .trim()
    .min(1, { message: "La clé publique est requise" })
    .optional()
    .or(z.null()),
  private_key: z
    .string()
    .trim()
    .min(1, { message: "La clé privée est requise" })
    .optional()
    .or(z.null()),
});

/**
 * Schéma de validation pour la mise à jour du mot de passe
 */
export const updatePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(12, {
      message: "Le mot de passe doit contenir au moins 12 caractères",
    })
    .regex(/[A-Z]/, {
      message: "Le mot de passe doit contenir au moins une majuscule",
    })
    .regex(/[0-9]/, {
      message: "Le mot de passe doit contenir au moins un chiffre",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Le mot de passe doit contenir au moins un caractère spécial",
    }),
});

/**
 * Schéma de validation pour l'ajout d'un backup
 */
export const addBackupsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Le nom du backup est requis" })
    .max(100, {
      message: "Le nom du backup ne peut pas dépasser 100 caractères",
    })
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, {
      message: "La description du backup ne peut pas dépasser 500 caractères",
    })
    .optional(),
  period: z.enum(["m", "y"]).optional(),
  plan: z.number().optional(),
  auto_renew: z.boolean().optional(),
});
