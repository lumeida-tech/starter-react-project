
import { useAtom, useSetAtom } from "jotai";
import { useLocation } from "@tanstack/react-router";
import {
  activeMenuAtom,
  activeMenuSubtitleAtom,
  currentNavigationAtom,
  mainNavigationItemsAtom,
  accountSettingsItemsAtom,
  adminNavigationItemsAtom,
  serverManagementItemsAtom,
  expandedMenusAtom,
} from "../stores/panel-atoms";
import type  { NavigationItem, NavigationType } from "../schemas";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

/*
|--------------------------------------------------------------------------
| Types Section
|--------------------------------------------------------------------------
*/

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

/*
|--------------------------------------------------------------------------
| Configuration des mappings pour le breadcrumb
|--------------------------------------------------------------------------
*/

const NON_CLICKABLE_SECTIONS = [
  "admin",
  "customer",
  "dashboard",
  //"servers", // cette section est désactivé car elle entre en conflit avec le mapping des serveurs
  "profile",
];

const BREADCRUMB_MAPPINGS: Record<string, string> = {
  // Sections principales - alignées avec les labels de la sidebar
  admin: "Administration",
  customer: "Client",
  dashboard: "Tableau de bord",
  servers: "Mes serveurs", // Aligné avec mainNavigationItemsAtom
  profile: "Mon compte", // Aligné avec accountSettingsItemsAtom

  // Sous-sections admin - alignées avec adminNavigationItemsAtom
  users: "Utilisateurs",
  promotions: "Promotions",
  os: "Gestion des OS", // Aligné avec adminNavigationItemsAtom
  offers: "Offres",
  infrastructure: "Infrastructures", // Ajout manquant
  inventory: "Inventaires", // Ajout manquant

  // Types d'offres
  vps: "VPS",
  dedicated: "Dédiés",
  physical: "Physiques",
  gpu: "GPU",
  custom: "Sur mesure",

  // Sections serveur - alignées avec serverManagementItemsAtom
  "server-overview": "Aperçu du serveur", // Aligné avec serverManagementItemsAtom
  settings: "Paramètres",
  "ssh-key": "Clé SSH", // Aligné avec serverManagementItemsAtom
  firewall: "Pare-feu",
  backup: "Backup", // Aligné avec serverManagementItemsAtom
  "dns-alias": "Alias DNS", // Aligné avec serverManagementItemsAtom
  "ip-address": "Adresse IP", // Aligné avec serverManagementItemsAtom

  // Sections profil - alignées avec accountSettingsItemsAtom
  wallet: "Portefeuille",
  receipts: "Mes commandes", // Aligné avec accountSettingsItemsAtom
  billing: "Facturations", // Aligné avec accountSettingsItemsAtom
  activities: "Activités du compte", // Aligné avec accountSettingsItemsAtom
  security: "Sécurité",

  // Actions
  add: "Ajouter",
  edit: "Modifier",
  form: "Formulaire",
};

/*
|--------------------------------------------------------------------------
| Navigation Mapping Functions
|--------------------------------------------------------------------------
*/

/**
 * Détermine le type de navigation basé sur le pathname avec une logique robuste
 */
const getNavigationTypeFromPath = (path: string): NavigationType => {
  // Nettoyer le path et extraire les segments
  const segments = path.split("/").filter((s) => s && s !== "fr" && s !== "en");

  if (segments.length === 0) return "main";

  // Vérifier le pattern admin
  if (segments.includes("admin")) return "admin";

  // Vérifier le pattern profile/account
  if (segments.includes("profile")) return "account";

  // Vérifier le pattern serveur avec ID (gestion serveur)
  // Pattern: /customer/servers/[serverId]/[action]
  if (segments.includes("servers") && segments.length >= 4) {
    const serverIndex = segments.indexOf("servers");
    // Vérifier s'il y a un ID après "servers" et une action après l'ID
    if (serverIndex >= 0 && segments[serverIndex + 2]) {
      return "manage-servers";
    }
  }

  return "main";
};

/**
 * Trouve l'item de navigation correspondant à un pathname
 */
const findNavigationItemFromPath = (
  path: string,
  navigationItems: NavigationItem[],
  navigationType: NavigationType
): { item: NavigationItem | null; subItem: any | null } => {
  const segments = path.split("/").filter((s) => s && s !== "fr" && s !== "en");

  if (segments.length === 0) return { item: null, subItem: null };

  // Pour la gestion des serveurs avec ID
  if (navigationType === "manage-servers") {
    const lastSegment = segments[segments.length - 1];

    // Mapping direct des actions de serveur
    const serverActionMappings: Record<string, string> = {
      "server-overview": "Aperçu du serveur",
      "dns-alias": "Alias DNS",
      "ip-address": "Adresse IP",
      "ssh-key": "Clé SSH",
      firewall: "Pare-feu",
      backup: "Backup",
    };

    const matchingLabel = serverActionMappings[lastSegment];
    if (matchingLabel) {
      const item = navigationItems.find((nav) => nav.label === matchingLabel);
      if (item) return { item, subItem: null };
    }

    return { item: null, subItem: null };
  }

  // Pour les autres types de navigation
  for (const navItem of navigationItems) {
    // Vérification directe par action
    if (
      navItem.action &&
      typeof navItem.action === "string" &&
      navItem.action !== "navigateBack"
    ) {
      // Normaliser les chemins pour comparaison
      const actionSegments = navItem.action.split("/").filter((s) => s);

      // Pour les actions simples (ex: /customer/dashboard)
      if (actionSegments.length === segments.length) {
        let matches = true;
        for (let i = 0; i < actionSegments.length; i++) {
          if (
            actionSegments[i] !== segments[i] &&
            !actionSegments[i].startsWith("[")
          ) {
            matches = false;
            break;
          }
        }
        if (matches) return { item: navItem, subItem: null };
      }

      // Pour les chemins qui commencent par l'action
      const actionPath = "/" + actionSegments.join("/");
      if (path.startsWith(actionPath) || path === actionPath) {
        return { item: navItem, subItem: null };
      }
    }

    // Vérifier dans les sous-menus
    if (navItem.submenuItems) {
      for (const subItem of navItem.submenuItems) {
        if (
          subItem.href &&
          (path.startsWith(subItem.href) || path === subItem.href)
        ) {
          return { item: navItem, subItem };
        }
      }
    }
  }

  return { item: null, subItem: null };
};

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

/**
 * Génère automatiquement les éléments de breadcrumb à partir du pathname
 */
const generateBreadcrumbFromPath = (path: string): BreadcrumbItem[] => {
  const segments = path
    .split("/")
    .filter((segment) => segment && segment !== "fr" && segment !== "en"); // Filtrer locale et segments vides

  const items: BreadcrumbItem[] = [{ label: "Accueil", href: "/" }];

  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Détecter les paramètres dynamiques (IDs, UUIDs, tokens, etc.)
    const isDynamicParam =
      segment.match(/^[\d]+$/) || // Nombres purs
      segment.match(/^[a-f0-9-]{36}$/) || // UUIDs
      (segment.match(/^[a-zA-Z0-9_-]{8,}$/) && segment.match(/[\d]/)) || // Tokens avec chiffres
      (segment.startsWith("[") && segment.endsWith("]")); // Paramètres de route [serverId]

    let label: string;
    if (isDynamicParam) {
      // Pour les paramètres dynamiques, utiliser un label générique ou essayer de déduire le type
      if (segments[index - 1] === "servers") {
        label = `Détails du serveur`;
      } else if (segments[index - 1] === "users") {
        label = `Détails de l'utilisateur`;
      } else if (segments[index - 1] === "firewall") {
        label = `Détails du pare-feu`;
      } else {
        label = segment;
      }
    } else {
      // Utiliser le mapping ou le segment tel quel en capitalisant
      label =
        BREADCRUMB_MAPPINGS[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    // Construire l'href correct
    let href = currentPath;

    // Déterminer si l'élément doit être cliquable
    const isLast = index === segments.length - 1;
    const isAction = ["add", "edit", "form"].includes(segment);
    const isMainSection = NON_CLICKABLE_SECTIONS.includes(segment);

    // Un élément est non-cliquable si :
    // - C'est le dernier élément OU
    // - C'est une action (add, edit, form) OU
    // - C'est une section principale (admin, customer, etc.) OU
    // - C'est un paramètre dynamique (ID, UUID, etc.)
    const isClickable =
      !isLast && !isAction && !isMainSection && !isDynamicParam;

    items.push({
      label,
      href: isClickable ? href : undefined,
      isCurrent: isLast,
    });
  });

  return items;
};

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

/**
 * Hook pour gérer la logique des breadcrumbs avec synchronisation sidebar
 */
export const useBreadcrumbs = () => {
  const { pathname } = useLocation();
  const [activeMenu] = useAtom(activeMenuAtom);
  const setActiveMenu = useSetAtom(activeMenuAtom);
  const setActiveMenuSubtitle = useSetAtom(activeMenuSubtitleAtom);
  const setCurrentNavigation = useSetAtom(currentNavigationAtom);
  const setExpandedMenus = useSetAtom(expandedMenusAtom);

  // Navigation items
  const mainNavigationItems = useAtomValue(mainNavigationItemsAtom);
  const accountSettingsItems = useAtomValue(accountSettingsItemsAtom);
  const adminNavigationItems = useAtomValue(adminNavigationItemsAtom);
  const serverManagementItems = useAtomValue(serverManagementItemsAtom);

  // Synchronisation automatique complète URL → Sidebar
  useEffect(() => {
    if (!pathname) return;

    const navigationType = getNavigationTypeFromPath(pathname);
    let navigationItems: NavigationItem[] = [];

    // Déterminer les items de navigation selon le type
    switch (navigationType) {
      case "admin":
        navigationItems = adminNavigationItems;
        break;
      case "account":
        navigationItems = accountSettingsItems;
        break;
      case "manage-servers":
        navigationItems = serverManagementItems;
        break;
      default:
        navigationItems = mainNavigationItems;
        break;
    }

    // Trouver l'item correspondant
    const { item, subItem } = findNavigationItemFromPath(
      pathname,
      navigationItems,
      navigationType
    );

    // Mettre à jour tous les états de navigation
    setCurrentNavigation(navigationType);

    // Réinitialiser les menus développés lors du changement de section
    setExpandedMenus([]);

    if (item) {
      // Déterminer le label et subtitle appropriés
      const menuLabel = subItem ? subItem.label : item.label;
      const menuSubtitle = subItem ? subItem.subtitle : item.subtitle || "";

      // Mettre à jour le menu actif
      setActiveMenu(menuLabel);
      setActiveMenuSubtitle(menuSubtitle);

      // Gérer les sous-menus si nécessaire
      if (subItem && item.hasSubmenu) {
        setExpandedMenus([item.label]);
      }
    } else {
      // Fallback si aucun item trouvé - utiliser des valeurs par défaut selon la section
      switch (navigationType) {
        case "admin":
          setActiveMenu("Administration");
          setActiveMenuSubtitle("Panel d'administration");
          break;
        case "account":
          setActiveMenu("Mon compte");
          setActiveMenuSubtitle("Gestion de votre compte");
          break;
        case "manage-servers":
          setActiveMenu("Gestion serveur");
          setActiveMenuSubtitle("Gestion de votre serveur");
          break;
        default:
          setActiveMenu("Tableau de bord");
          setActiveMenuSubtitle("Statistiques et gestion de vos services");
          break;
      }
    }
  }, [
    pathname,
    setActiveMenu,
    setActiveMenuSubtitle,
    setCurrentNavigation,
    setExpandedMenus,
    mainNavigationItems,
    accountSettingsItems,
    adminNavigationItems,
    serverManagementItems,
  ]);

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    try {
      // Essayer de générer automatiquement depuis l'URL
      if (pathname && pathname.split("/").length > 2) {
        const generatedItems = generateBreadcrumbFromPath(pathname);
        if (generatedItems.length > 1) {
          return generatedItems;
        }
      }
    } catch (error) {
      console.warn(
        "Erreur lors de la génération automatique du breadcrumb:",
        error
      );
    }

    // Fallback vers le système actuel
    return [
      { label: "Accueil", href: "/" },
      { label: "Tableau de bord", href: "/customer/dashboard" },
      { label: activeMenu, isCurrent: true },
    ];
  };

  return {
    breadcrumbItems: getBreadcrumbItems(),
  };
};
