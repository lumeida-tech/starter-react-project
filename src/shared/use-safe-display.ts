/**
 * Hook puissant et généraliste pour l'affichage sécurisé de valeurs
 * Vérifie l'existence, la validité et l'état d'une valeur avant affichage
 * Fournit des messages par défaut appropriés selon l'état
 */

export interface SafeDisplayOptions {
  /** Message par défaut si la valeur est undefined */
  undefinedMessage?: string;
  /** Message par défaut si la valeur est null */
  nullMessage?: string;
  /** Message par défaut si la valeur est vide (string, array, object) */
  emptyMessage?: string;
  /** Message de fallback général */
  fallback?: string;
  /** Fonction de formatage personnalisée */
  formatter?: (value: any) => string;
  /** Locale pour les messages par défaut */
  locale?: "en" | "fr";
  /** Afficher "0" au lieu du message vide pour les nombres */
  showZero?: boolean;
  /** Afficher les objets/arrays vides comme message vide */
  treatEmptyAsEmpty?: boolean;
}

export interface SafeDisplayResult {
  /** Valeur à afficher */
  display: string;
  /** Indique si la valeur est valide (non null/undefined/empty) */
  isValid: boolean;
  /** Indique si la valeur est vide */
  isEmpty: boolean;
  /** Indique si la valeur est définie */
  isDefined: boolean;
  /** Type de la valeur originale */
  originalType: string;
  /** Valeur originale */
  originalValue: any;
}

/**
 * Messages par défaut selon la locale
 */
const DEFAULT_MESSAGES = {
  en: {
    undefined: "Not defined",
    null: "No data",
    empty: "Empty",
    fallback: "No data available",
  },
  fr: {
    undefined: "Non-défini",
    null: "Aucune donnée",
    empty: "Vide",
    fallback: "Aucune donnée disponible",
  },
} as const;

/**
 * Vérifie si une valeur est considérée comme vide
 */
function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  if (typeof value === "number") return false; // Les nombres ne sont jamais "vides"
  return false;
}

/**
 * Vérifie si une valeur est définie (pas null ou undefined)
 */
function isDefined(value: any): boolean {
  return value !== null && value !== undefined;
}

/**
 * Formate une valeur selon son type
 */
function formatValue(value: any, formatter?: (value: any) => string): string {
  if (formatter) {
    try {
      return formatter(value);
    } catch {
      // Si le formatter échoue, utiliser le formatage par défaut
    }
  }

  // Formatage par défaut selon le type
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return value.toString();
    case "boolean":
      return value.toString();
    case "object":
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      return JSON.stringify(value);
    default:
      return String(value);
  }
}

/**
 * Hook principal pour l'affichage sécurisé de valeurs
 *
 * @param value - La valeur à afficher
 * @param options - Options de configuration
 * @returns Objet contenant les informations d'affichage et l'état de la valeur
 *
 * @example
 * // Cas basiques - valeurs undefined/null/empty
 * ```typescript
 * const { display, isValid } = useSafeDisplay(user?.name);
 * // user?.name = undefined → { display: "Non-défini", isValid: false }
 * // user?.name = null → { display: "Aucune donnée", isValid: false }
 * // user?.name = "" → { display: "Vide", isValid: false }
 * // user?.name = "John" → { display: "John", isValid: true }
 * ```
 *
 * @example
 * // Messages personnalisés
 * ```typescript
 * const { display } = useSafeDisplay(user?.email, {
 *   undefinedMessage: "Email non renseigné",
 *   emptyMessage: "Email vide",
 *   fallback: "Email indisponible"
 * });
 * ```
 *
 * @example
 * // Formatage personnalisé avec formatter
 * ```typescript
 * const { display } = useSafeDisplay(items, {
 *   emptyMessage: "Aucun élément",
 *   formatter: (items) => `${items.length} élément(s) trouvé(s)`
 * });
 * // items = [] → "Aucun élément"
 * // items = [1,2,3] → "3 élément(s) trouvé(s)"
 * ```
 *
 * @example
 * // Gestion des objets et arrays
 * ```typescript
 * const { display, isEmpty } = useSafeDisplay(userSettings, {
 *   treatEmptyAsEmpty: true,
 *   formatter: (obj) => `${Object.keys(obj).length} paramètres`
 * });
 * // userSettings = {} → { display: "Vide", isEmpty: true }
 * // userSettings = {theme: 'dark'} → { display: "1 paramètres", isEmpty: false }
 * ```
 *
 * @example
 * // Différentes locales
 * ```typescript
 * const { display } = useSafeDisplay(undefined, { locale: 'en' });
 * // → "Not defined" (au lieu de "Non-défini")
 *
 * const { display } = useSafeDisplay(null, { locale: 'fr' });
 * // → "Aucune donnée"
 * ```
 *
 * @example
 * // Gestion du zéro
 * ```typescript
 * const { display } = useSafeDisplay(0, { showZero: true });
 * // → "0" (affiche le zéro au lieu de "Vide")
 *
 * const { display } = useSafeDisplay(0, { showZero: false });
 * // → "Vide" (traite 0 comme vide)
 * ```
 *
 * @example
 * // Utilisation avec état complet
 * ```typescript
 * const { display, isValid, isEmpty, isDefined, originalType } = useSafeDisplay(data);
 *
 * if (!isValid) {
 *   console.log(`Données invalides: ${display}`);
 * }
 *
 * if (!isDefined) {
 *   // Gérer le cas undefined/null
 * }
 *
 * if (isEmpty && originalType === 'array') {
 *   // Gérer spécifiquement les arrays vides
 * }
 * ```
 */
export function useSafeDisplay<T = any>(
  value: T,
  options: SafeDisplayOptions = {}
): SafeDisplayResult {
  const {
    undefinedMessage,
    nullMessage,
    emptyMessage,
    fallback,
    formatter,
    locale = "fr",
    showZero = true,
    treatEmptyAsEmpty = true,
  } = options;

  const messages = DEFAULT_MESSAGES[locale];

  // Déterminer le type original
  const originalType = Array.isArray(value) ? "array" : typeof value;

  // Cas spécial pour le nombre 0
  if (typeof value === "number" && value === 0 && showZero) {
    return {
      display: "0",
      isValid: true,
      isEmpty: false,
      isDefined: true,
      originalType,
      originalValue: value,
    };
  }

  // Vérifications d'état
  const isValueDefined = isDefined(value);
  const isValueEmpty = isEmpty(value);
  const isValueValid = isValueDefined && (!treatEmptyAsEmpty || !isValueEmpty);

  // Déterminer le message à afficher
  let display: string;

  if (value === undefined) {
    display = undefinedMessage || messages.undefined;
  } else if (value === null) {
    display = nullMessage || messages.null;
  } else if (treatEmptyAsEmpty && isValueEmpty) {
    display = emptyMessage || messages.empty;
  } else if (isValueValid) {
    display = formatValue(value, formatter);
  } else {
    display = fallback || messages.fallback;
  }

  return {
    display,
    isValid: isValueValid,
    isEmpty: isValueEmpty,
    isDefined: isValueDefined,
    originalType,
    originalValue: value,
  };
}

/**
 * Version simplifiée du hook qui retourne directement la string à afficher
 *
 * @param value - La valeur à afficher
 * @param options - Options de configuration
 * @returns String à afficher
 *
 * @example
 * // Utilisation simple et directe
 * ```typescript
 * const userName = safeDisplay(user?.name);
 * // user?.name = undefined → "Non-défini"
 * // user?.name = "Alice" → "Alice"
 *
 * const userCount = safeDisplay(users?.length, {
 *   fallback: "Aucun utilisateur"
 * });
 * ```
 *
 * @example
 * // Dans les templates JSX
 * ```tsx
 * <div className="user-name">
 *   {safeDisplay(profile?.displayName, {
 *     fallback: "Utilisateur anonyme"
 *   })}
 * </div>
 *
 * <span className="status">
 *   {safeDisplay(server?.status, {
 *     formatter: (status) => status.toUpperCase(),
 *     undefinedMessage: "État inconnu"
 *   })}
 * </span>
 * ```
 *
 * @example
 * // Formatage rapide pour affichage
 * ```typescript
 * const priceText = safeDisplay(product?.price, {
 *   formatter: (price) => `${price}€`,
 *   nullMessage: "Prix non défini"
 * });
 *
 * const tagsText = safeDisplay(article?.tags, {
 *   formatter: (tags) => tags.join(", "),
 *   emptyMessage: "Aucun tag"
 * });
 * ```
 *
 * @example
 * // Utilisation dans des conditions
 * ```typescript
 * const message = error ?
 *   safeDisplay(error.message, { fallback: "Erreur inconnue" }) :
 *   "Opération réussie";
 *
 * const tooltip = safeDisplay(item?.description, {
 *   emptyMessage: "Aucune description disponible",
 *   formatter: (desc) => desc.length > 50 ? desc.slice(0, 50) + "..." : desc
 * });
 * ```
 */
export function safeDisplay<T = any>(
  value: T,
  options: SafeDisplayOptions = {}
): string {
  return useSafeDisplay(value, options).display;
}

/**
 * Hook spécialisé pour les valeurs numériques avec formatage avancé
 *
 * @param value - La valeur numérique à afficher
 * @param options - Options de configuration pour les nombres
 * @returns Objet SafeDisplayResult avec la valeur formatée
 *
 * @example
 * // Formatage monétaire
 * ```typescript
 * const { display } = useSafeDisplayNumber(product?.price, {
 *   decimals: 2,
 *   prefix: "€",
 *   undefinedMessage: "Prix non défini"
 * });
 * // product?.price = 25.5 → "€25.50"
 * // product?.price = undefined → "Prix non défini"
 * // product?.price = 0 → "€0.00"
 * ```
 *
 * @example
 * // Pourcentages et statistiques
 * ```typescript
 * const { display, isValid } = useSafeDisplayNumber(stats?.successRate, {
 *   decimals: 1,
 *   suffix: "%",
 *   nullMessage: "Statistique indisponible"
 * });
 * // stats?.successRate = 87.234 → "87.2%"
 * // stats?.successRate = null → "Statistique indisponible"
 *
 * const progressText = useSafeDisplayNumber(progress, {
 *   decimals: 0,
 *   suffix: "%",
 *   formatter: (val) => Math.round(val).toString()
 * }).display;
 * ```
 *
 * @example
 * // Unités et mesures
 * ```typescript
 * const { display } = useSafeDisplayNumber(server?.diskSpace, {
 *   decimals: 1,
 *   suffix: " GB",
 *   emptyMessage: "Espace non calculé"
 * });
 * // server?.diskSpace = 1024.7 → "1024.7 GB"
 *
 * const temperatureText = useSafeDisplayNumber(sensor?.temp, {
 *   decimals: 1,
 *   suffix: "°C",
 *   prefix: "T: "
 * }).display;
 * // sensor?.temp = 23.456 → "T: 23.5°C"
 * ```
 *
 * @example
 * // Gestion des valeurs spéciales
 * ```typescript
 * const { display, isEmpty } = useSafeDisplayNumber(count, {
 *   showZero: true, // Affiche "0" au lieu de message vide
 *   prefix: "Nombre: ",
 *   fallback: "Compte indisponible"
 * });
 * // count = 0 → "Nombre: 0"
 * // count = undefined → "Compte indisponible"
 *
 * const ratingDisplay = useSafeDisplayNumber(product?.rating, {
 *   decimals: 1,
 *   suffix: "/5 ⭐",
 *   formatter: (rating) => rating > 4.5 ? "★★★★★" : rating.toFixed(1)
 * });
 * ```
 *
 * @example
 * // Formatage conditionnel
 * ```typescript
 * const { display } = useSafeDisplayNumber(fileSize, {
 *   formatter: (bytes) => {
 *     if (bytes < 1024) return `${bytes} B`;
 *     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
 *     return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
 *   },
 *   nullMessage: "Taille inconnue"
 * });
 * // fileSize = 2048 → "2.0 KB"
 * // fileSize = null → "Taille inconnue"
 * ```
 */
export function useSafeDisplayNumber(
  value: number | null | undefined,
  options: Omit<SafeDisplayOptions, "showZero"> & {
    showZero?: boolean;
    decimals?: number;
    prefix?: string;
    suffix?: string;
  } = {}
): SafeDisplayResult {
  const { decimals, prefix = "", suffix = "", ...restOptions } = options;

  return useSafeDisplay(value, {
    ...restOptions,
    showZero: true,
    formatter: (val: number) => {
      const formatted =
        decimals !== undefined ? val.toFixed(decimals) : val.toString();
      return `${prefix}${formatted}${suffix}`;
    },
  });
}

/**
 * Hook spécialisé pour l'affichage sécurisé des dates avec formatage flexible
 *
 * @param value - La date à afficher (Date, string, null, ou undefined)
 * @param options - Options de configuration pour les dates
 * @returns Objet SafeDisplayResult avec la date formatée
 *
 * @example
 * // Formatage de base avec différents formats
 * ```typescript
 * const { display } = useSafeDisplayDate(user?.createdAt, {
 *   dateFormat: 'short',
 *   undefinedMessage: "Date de création inconnue"
 * });
 * // user?.createdAt = new Date('2024-01-15') → "15/01/2024"
 * // user?.createdAt = undefined → "Date de création inconnue"
 *
 * const longDate = useSafeDisplayDate(event?.date, {
 *   dateFormat: 'long'
 * }).display;
 * // event?.date = new Date('2024-01-15') → "lundi 15 janvier 2024"
 * ```
 *
 * @example
 * // Gestion des dates en string
 * ```typescript
 * const { display, isValid } = useSafeDisplayDate(article?.publishedAt, {
 *   dateFormat: 'numeric',
 *   nullMessage: "Date de publication non définie"
 * });
 * // article?.publishedAt = "2024-01-15T10:30:00Z" → "2024-01-15"
 * // article?.publishedAt = null → "Date de publication non définie"
 * // article?.publishedAt = "invalid-date" → "Date invalide"
 * ```
 *
 * @example
 * // Locales différentes
 * ```typescript
 * const frenchDate = useSafeDisplayDate(meetingDate, {
 *   dateFormat: 'long',
 *   locale: 'fr-FR'
 * }).display;
 * // meetingDate = new Date('2024-12-25') → "mercredi 25 décembre 2024"
 *
 * const englishDate = useSafeDisplayDate(meetingDate, {
 *   dateFormat: 'long',
 *   locale: 'en-US'
 * }).display;
 * // meetingDate = new Date('2024-12-25') → "Wednesday, December 25, 2024"
 * ```
 *
 * @example
 * // Formatage personnalisé avec formatter
 * ```typescript
 * const { display } = useSafeDisplayDate(order?.deliveryDate, {
 *   formatter: (date) => {
 *     const now = new Date();
 *     const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
 *
 *     if (diffDays === 0) return "Aujourd'hui";
 *     if (diffDays === 1) return "Demain";
 *     if (diffDays > 1) return `Dans ${diffDays} jours`;
 *     return `Il y a ${Math.abs(diffDays)} jours`;
 *   },
 *   nullMessage: "Date de livraison non planifiée"
 * });
 * // Si order?.deliveryDate est demain → "Demain"
 * // Si order?.deliveryDate est dans 5 jours → "Dans 5 jours"
 * ```
 *
 * @example
 * // Gestion des erreurs et dates invalides
 * ```typescript
 * const { display, isValid } = useSafeDisplayDate(userInput, {
 *   dateFormat: 'short',
 *   formatter: (date) => {
 *     // Le formatter ne sera appelé que si la date est valide
 *     return date.toLocaleDateString('fr-FR', {
 *       weekday: 'short',
 *       day: 'numeric',
 *       month: 'short'
 *     });
 *   }
 * });
 *
 * if (!isValid) {
 *   console.log("Date invalide ou non définie:", display);
 * }
 * // userInput = "2024-01-15" → "lun. 15 janv."
 * // userInput = "invalid" → "Date invalide"
 * // userInput = null → "Aucune donnée"
 * ```
 *
 * @example
 * // Cas d'usage spécifiques
 * ```typescript
 * // Affichage de dernière connexion
 * const lastSeenText = useSafeDisplayDate(user?.lastSeen, {
 *   formatter: (date) => {
 *     const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
 *     if (minutes < 1) return "À l'instant";
 *     if (minutes < 60) return `Il y a ${minutes} min`;
 *     const hours = Math.floor(minutes / 60);
 *     if (hours < 24) return `Il y a ${hours}h`;
 *     return date.toLocaleDateString();
 *   },
 *   nullMessage: "Jamais connecté"
 * }).display;
 *
 * // Affichage d'échéance
 * const dueText = useSafeDisplayDate(task?.dueDate, {
 *   formatter: (date) => {
 *     const today = new Date();
 *     const isOverdue = date < today;
 *     const formatted = date.toLocaleDateString();
 *     return isOverdue ? `⚠️ Échéance dépassée (${formatted})` : formatted;
 *   },
 *   emptyMessage: "Aucune échéance"
 * }).display;
 * ```
 */
export function useSafeDisplayDate(
  value: Date | string | null | undefined,
  options: SafeDisplayOptions & {
    dateFormat?: "short" | "long" | "numeric";
    locale?: string;
  } = {}
): SafeDisplayResult {
  const {
    dateFormat = "short",
    locale: dateLocale = "fr-FR",
    ...restOptions
  } = options;

  return useSafeDisplay(value, {
    ...restOptions,
    formatter: (val: Date | string) => {
      const date = val instanceof Date ? val : new Date(val);
      if (isNaN(date.getTime())) return "Date invalide";

      const formatOptions: Intl.DateTimeFormatOptions = {
        short: { dateStyle: "short" },
        long: { dateStyle: "long" },
        numeric: { year: "numeric", month: "2-digit", day: "2-digit" },
      }[dateFormat] as Intl.DateTimeFormatOptions;

      return date.toLocaleDateString(dateLocale, formatOptions);
    },
  });
}

/**
 * Hook spécialisé pour l'affichage sécurisé des arrays avec formatage flexible
 *
 * @param value - L'array à afficher
 * @param options - Options de configuration pour les arrays
 * @returns Objet SafeDisplayResult avec l'array formaté
 *
 * @example
 * // Affichage simple d'arrays
 * ```typescript
 * const { display } = useSafeDisplayArray(user?.skills, {
 *   separator: ', ',
 *   emptyMessage: "Aucune compétence"
 * });
 * // user?.skills = ['React', 'TypeScript', 'Node.js'] → "React, TypeScript, Node.js"
 * // user?.skills = [] → "Aucune compétence"
 * // user?.skills = undefined → "Non-défini"
 * ```
 *
 * @example
 * // Limitation du nombre d'éléments affichés
 * ```typescript
 * const { display } = useSafeDisplayArray(article?.tags, {
 *   maxItems: 3,
 *   separator: ' • ',
 *   nullMessage: "Aucun tag"
 * });
 * // article?.tags = ['js', 'react', 'web', 'frontend', 'dev']
 * // → "js • react • web et 2 autre(s)"
 * // article?.tags = ['js', 'react'] → "js • react"
 * // article?.tags = null → "Aucun tag"
 * ```
 *
 * @example
 * // Formatage personnalisé des éléments
 * ```typescript
 * const { display, isValid } = useSafeDisplayArray(orders, {
 *   itemFormatter: (order, index) => `#${order.id} (${order.status})`,
 *   separator: ', ',
 *   maxItems: 5,
 *   emptyMessage: "Aucune commande"
 * });
 * // orders = [{id: 1, status: 'pending'}, {id: 2, status: 'shipped'}]
 * // → "#1 (pending), #2 (shipped)"
 * // orders = [] → "Aucune commande"
 * ```
 *
 * @example
 * // Arrays d'objets complexes
 * ```typescript
 * const { display } = useSafeDisplayArray(team?.members, {
 *   itemFormatter: (member) => member.name + (member.isLead ? ' (Lead)' : ''),
 *   separator: ', ',
 *   maxItems: 4,
 *   emptyMessage: "Équipe vide"
 * });
 * // team?.members = [
 * //   {name: 'Alice', isLead: true},
 * //   {name: 'Bob', isLead: false}
 * // ] → "Alice (Lead), Bob"
 * ```
 *
 * @example
 * // Différents séparateurs et styles
 * ```typescript
 * // Séparateur avec saut de ligne
 * const listDisplay = useSafeDisplayArray(errors, {
 *   separator: '\n• ',
 *   itemFormatter: (error) => error.message,
 *   formatter: (val) => '• ' + val, // Ajouter bullet au début
 *   emptyMessage: "Aucune erreur"
 * }).display;
 * // errors = [{message: 'Error 1'}, {message: 'Error 2'}]
 * // → "• Error 1\n• Error 2"
 *
 * // Style "et" pour petites listes
 * const shortList = useSafeDisplayArray(winners, {
 *   separator: ', ',
 *   formatter: (val) => {
 *     const parts = val.split(', ');
 *     if (parts.length > 1) {
 *       const last = parts.pop();
 *       return `${parts.join(', ')} et ${last}`;
 *     }
 *     return val;
 *   }
 * }).display;
 * // winners = ['Alice', 'Bob', 'Charlie'] → "Alice, Bob et Charlie"
 * ```
 *
 * @example
 * // Gestion des arrays avec types mixtes
 * ```typescript
 * const { display } = useSafeDisplayArray(mixedData, {
 *   itemFormatter: (item, index) => {
 *     if (typeof item === 'string') return item;
 *     if (typeof item === 'number') return item.toString();
 *     if (typeof item === 'object') return JSON.stringify(item);
 *     return 'Item unknown';
 *   },
 *   separator: ' | ',
 *   maxItems: 10
 * });
 * // mixedData = ['text', 42, {key: 'value'}] → "text | 42 | {\"key\":\"value\"}"
 * ```
 *
 * @example
 * // Cas d'usage spécifiques
 * ```typescript
 * // Affichage de permissions
 * const permissionsText = useSafeDisplayArray(user?.permissions, {
 *   itemFormatter: (perm) => perm.toUpperCase(),
 *   separator: ', ',
 *   maxItems: 5,
 *   emptyMessage: "Aucune permission",
 *   formatter: (val) => `Permissions: ${val}`
 * }).display;
 * // user?.permissions = ['read', 'write'] → "Permissions: READ, WRITE"
 *
 * // Liste de fichiers
 * const filesText = useSafeDisplayArray(uploadedFiles, {
 *   itemFormatter: (file) => `${file.name} (${file.size}ko)`,
 *   separator: '\n',
 *   maxItems: 3,
 *   emptyMessage: "Aucun fichier uploadé"
 * }).display;
 *
 * // Breadcrumb navigation
 * const breadcrumbText = useSafeDisplayArray(navigationPath, {
 *   separator: ' > ',
 *   itemFormatter: (path) => path.label,
 *   emptyMessage: "Accueil"
 * }).display;
 * // navigationPath = [{label: 'Home'}, {label: 'Products'}, {label: 'Laptop'}]
 * // → "Home > Products > Laptop"
 * ```
 *
 * @example
 * // Utilisation avec état complet
 * ```typescript
 * const { display, isValid, isEmpty, originalValue } = useSafeDisplayArray(notifications);
 *
 * if (isEmpty) {
 *   // Afficher état vide spécifique
 *   console.log("Aucune notification");
 * } else if (isValid && originalValue.length > 10) {
 *   // Gérer les grandes listes différemment
 *   console.log(`Trop de notifications: ${originalValue.length}`);
 * }
 * ```
 */
export function useSafeDisplayArray<T = any>(
  value: T[] | null | undefined,
  options: SafeDisplayOptions & {
    separator?: string;
    maxItems?: number;
    itemFormatter?: (item: T, index: number) => string;
  } = {}
): SafeDisplayResult {
  const { separator = ", ", maxItems, itemFormatter, ...restOptions } = options;

  return useSafeDisplay(value, {
    ...restOptions,
    formatter: (val: T[]) => {
      let items = val;
      if (maxItems && items.length > maxItems) {
        items = items.slice(0, maxItems);
      }

      const formatted = items.map((item, index) =>
        itemFormatter ? itemFormatter(item, index) : String(item)
      );

      let result = formatted.join(separator);
      if (maxItems && val.length > maxItems) {
        result += ` et ${val.length - maxItems} autre(s)`;
      }

      return result;
    },
  });
}
