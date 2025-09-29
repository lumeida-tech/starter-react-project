import { atom, getDefaultStore } from "jotai";
import { atomWithStorage } from "jotai/utils";

import {
  Home,
  AtSign,
  Settings,
  Shield,
  CreditCard,
  Wallet,
  ArrowLeft,
  Globe,
  Server,
  Building2,
  ActivitySquare,
  FileBoxIcon,
  UsersIcon,
  ScrollIcon,
  Warehouse,
  BadgePercent,
  MonitorCog,
  Router,
  FileKey2,
  GlobeLock,
  DatabaseBackup,
} from "lucide-react";
import type { NavigationItem, NavigationType, VpsServerDetails } from "../schemas";

// Jotai store global (utile hors React, ex: dans une fonction)
const store = getDefaultStore();

/**
 * Items de navigation principaux
 */
export const mainNavigationItemsAtom = atom<NavigationItem[]>([
  {
    icon: Home,
    label: "Tableau de bord",
    subtitle: "Statistiques et gestion de vos services",
    showChevron: false,
    hasSubmenu: false,
    action: "/customer/dashboard",
  },
  {
    icon: AtSign,
    label: "Domaines",
    showChevron: true,
    hasSubmenu: true,
    action: undefined,
    submenuItems: [
      { label: "Mes domaines", isHeader: true },
      { label: "Enregistrer un domaine", subtitle: "Enregistrer un domaine" },
      { label: "Transférer un domaine", subtitle: "Transférer un domaine" },
      { label: "Gestion DNS", subtitle: "Gestion DNS" },
    ],
  },
  {
    icon: Globe,
    label: "Hébergements",
    showChevron: true,
    hasSubmenu: true,
    action: undefined,
    submenuItems: [
      { label: "Mes hébergements", isHeader: true },
      { label: "Commander", subtitle: "Commander un hébergement" },
      { label: "Options", subtitle: "Options de votre hébergement" },
    ],
  },
  {
    icon: Server,
    label: "Mes serveurs",
    subtitle: "Gestion de vos serveurs",
    showChevron: false,
    hasSubmenu: false,
    action: "/customer/servers",
  },
  {
    icon: Building2,
    label: "Colocations",
    showChevron: true,
    hasSubmenu: true,
    action: undefined,
    submenuItems: [
      { label: "Mes colocations", isHeader: true },
      {
        label: "Demander un devis",
        subtitle: "Demander un devis pour une colocation",
      },
      { label: "Datacenters", subtitle: "Gestion de vos datacenters" },
    ],
  },
]);

/**
 * État du popup de sous-menu (visible ou non)
 */
export const isSubmenuPopupVisibleAtom = atom<boolean>(false);

/**
 * option action server
 */
export const optionActionServerAtom = atomWithStorage("optionActionServer", "");

/**
 * Items de navigation des paramètres de compte
 */
export const accountSettingsItemsAtom = atom<NavigationItem[]>([
  {
    icon: ArrowLeft,
    label: "Menu principal",
    showChevron: false,
    hasSubmenu: false,
    submenuItems: undefined,
    action: "navigateBack",
  },
  {
    icon: Settings,
    label: "Mon compte",
    showChevron: false,
    subtitle: "Gestion de vos informations personnelles",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/customer/profile",
  },
  {
    icon: Shield,
    label: "Sécurité",
    showChevron: false,
    subtitle: "Gestion de vos informations de sécurité",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/customer/profile/security",
  },
  {
    icon: CreditCard,
    label: "Facturations",
    showChevron: false,
    subtitle: "Gestion de vos informations de facturation",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/customer/profile/billing",
  },
  {
    icon: Wallet,
    label: "Portefeuille",
    showChevron: false,
    subtitle: "Gestion de vos informations de portefeuille",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/customer/profile/wallet",
  },
  {
    icon: FileBoxIcon,
    label: "Mes commandes",
    showChevron: false,
    subtitle: "Gestion de vos commandes",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/customer/profile/receipts",
  },
  {
    icon: ActivitySquare,
    label: "Activités du compte",
    showChevron: false,
    subtitle: "Gestion de vos activités",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/customer/profile/activities",
  },
]);

/**
 * Données du serveur actuellement affiché
 */
export const currentServerDetailAtom = atom<VpsServerDetails | null>(null);

/**
 * Items de navigation des paramètres d'un serveur
 */
export const serverManagementItemsAtom = atom<NavigationItem[]>([
  {
    icon: ArrowLeft,
    label: "Menu principal",
    showChevron: false,
    hasSubmenu: false,
    submenuItems: undefined,
    action: "navigateBack",
  },
  {
    icon: Server,
    label: "Aperçu du serveur",
    showChevron: false,
    hasSubmenu: false,
    submenuItems: undefined,
    action: `/customer/servers/[serverId]/server-overview`,
  },
  {
    icon: GlobeLock,
    label: "Alias DNS",
    showChevron: false,
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/customer/servers/[serverId]/dns-alias",
  },
  {
    icon: Router,
    label: "Adresse IP",
    showChevron: false,
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/customer/servers/[serverId]/ip-address",
  },
  {
    icon: FileKey2,
    label: "Clé SSH",
    showChevron: false,
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/customer/servers/[serverId]/ssh-key",
  },
  {
    icon: Shield,
    label: "Pare-feu",
    showChevron: false,
    hasSubmenu: false,
    submenuItems: undefined,
    action: `/customer/servers/[serverId]/firewall`,
  },
  {
    icon: DatabaseBackup,
    label: "Backup",
    showChevron: false,
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/customer/servers/[serverId]/backup",
  },
]);

/**
 * Items de navigation admin
 */
export const adminNavigationItemsAtom = atom<NavigationItem[]>([
  {
    icon: ArrowLeft,
    label: "Menu principal",
    showChevron: false,
    hasSubmenu: false,
    submenuItems: undefined,
    action: "navigateBack",
  },
  {
    icon: Building2,
    label: "Infrastructures",
    showChevron: false,
    subtitle: "Gestion de votre infrastructure",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/admin/infrastructure",
  },

  {
    icon: UsersIcon,
    label: "Utilisateurs",
    showChevron: false,
    subtitle: "Gestion de vos utilisateurs",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/admin/users",
  },
  {
    icon: Globe,
    label: "Gestion des zones",
    showChevron: false,
    subtitle: "Gestion des zones géographiques",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/admin/zones",
  },
  {
    icon: ScrollIcon,
    label: "Gestion des offres",
    showChevron: false,
    subtitle: "Gestion de vos offres",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/admin/offers",
  },
  {
    icon: MonitorCog,
    label: "Gestion des OS",
    showChevron: false,
    subtitle: "Gestion de vos OS",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/admin/os",
  },

  {
    icon: BadgePercent,
    label: "Promotions",
    showChevron: false,
    subtitle: "Promotions",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/admin/promotions",
  },

  {
    icon: Warehouse,
    label: "Inventaires",
    showChevron: false,
    subtitle: "Gestion de vos inventaires",
    hasSubmenu: false,
    submenuItems: undefined,
    action: "/admin/inventory",
  },
]);

/**
 * Navigation actuelle
 */
export const currentNavigationAtom = atomWithStorage<NavigationType | null>(
  "currentNavigation",
  null
);

/**
 * Menus développés
 */
export const expandedMenusAtom = atom<string[]>([]);

/**
 * État de la sidebar (collapsée ou non)
 */
export const isSidebarCollapsedAtom = atom<boolean>(false);

/**
 * État du menu de profil (ouvert ou fermé)
 */
export const isProfileMenuOpenAtom = atom<boolean>(false);

/**
 * État du menu de commande (ouvert ou fermé)
 */
export const isCommandMenuOpenAtom = atom<boolean>(false);

/**
 * État du menu mobile (ouvert ou fermé)
 */
export const isMobileMenuOpenAtom = atom<boolean>(false);

/**
 * Menu actif
 */
export const activeMenuAtom = atom<string>("Tableau de bord");

/**
 * Sous-titre du menu actif
 */
export const activeMenuSubtitleAtom = atom<string>(
  "Statistiques et gestion de vos services"
);

/**
 * État du formulaire d'ajout d'OS
 */
export const isServerAddOsOpenAtom = atom<boolean>(false);

/**
 * État du formulaire d'ajout de serveur
 */
export const isServerAddOpenAtom = atom<boolean>(false);

// ============================================================================
// FONCTIONS D'ACTIONS
// ============================================================================

/**
 * État du formulaire d'ajout d'OS
 */
export const isAddOsDataAtom = atom<string>("");

/**
 * État du formulaire d'ajout d'OS
 */
export const editOsLogoAtom = atomWithStorage<string>("editOsLogo", "");

// ============================================================================
// FONCTIONS D'ACTIONS
// ============================================================================

/**
 * Bascule l'état d'un menu (développé/réduit)
 */
export function toggleExpandMenu(menu: string) {
  const currentMenus = store.get(expandedMenusAtom);
  const newMenus = currentMenus.includes(menu)
    ? currentMenus.filter((m) => m !== menu)
    : [...currentMenus, menu];
  store.set(expandedMenusAtom, newMenus);
}

// ============================================================================
// FONCTIONS UTILITAIRES (Pour faciliter l'usage)
// ============================================================================

/**
 * Récupère les items de navigation selon le type
 */
export function getNavigationItems(type: NavigationType): NavigationItem[] {
  switch (type) {
    case "main":
      return store.get(mainNavigationItemsAtom);
    case "account":
      return store.get(accountSettingsItemsAtom);
    case "admin":
      return store.get(adminNavigationItemsAtom);
    default:
      return store.get(mainNavigationItemsAtom);
  }
}

/**
 * Vérifie si un menu est développé
 */
export function isMenuExpanded(menu: string): boolean {
  const currentExpandedMenus = store.get(expandedMenusAtom);
  return currentExpandedMenus.includes(menu);
}

/**
 * Ferme tous les menus
 */
export function closeAllMenus() {
  store.set(expandedMenusAtom, []);
}

/**
 * Navigation retour
 */
export function navigateBack() {
  store.set(currentNavigationAtom, "main");
}
