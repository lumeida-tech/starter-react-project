import {
  Home,
  AtSign,
  Settings,
  Shield,
  CreditCard,
  Wallet,
  Activity,
  ArrowLeft,
  Globe,
  Server,
  Building2,
  ActivitySquare,
  ListOrderedIcon,
  FileBoxIcon,
  UsersIcon,
  ScrollIcon,
  Warehouse,
} from "lucide-react";

/**
 * Interface pour les items de navigation
 */
export interface NavigationItem {
  icon:
    | typeof Home
    | typeof AtSign
    | typeof Settings
    | typeof Shield
    | typeof CreditCard
    | typeof Wallet
    | typeof Activity
    | typeof ArrowLeft
    | typeof Globe
    | typeof Server
    | typeof Building2
    | typeof ActivitySquare
    | typeof ListOrderedIcon
    | typeof FileBoxIcon
    | typeof UsersIcon
    | typeof ScrollIcon
    | typeof Warehouse;
  label: string;
  subtitle?: string;
  showChevron: boolean;
  hasSubmenu: boolean;
  submenuItems?: Array<{
    label: string;
    isHeader?: boolean;
    href?: string;
    subtitle?: string;
  }>;
  action?: string | "navigateBack";
}


export interface SecurityGroupAction {
  type: "edit" | "delete";
  groupId: string;
}

/**
 * Type pour la navigation actuelle
 */
export type NavigationType = "main" | "account" | "admin" | "manage-servers";

/**
 * Interface pour l'ajout d'une offre serveur
 */
export interface AddServerOffer {
  zones_info?: { [zoneName: string]: { os: string[] } };
  type:
    | "vps"
    | "dedicated"
    | "physical"
    | "gpu"
    | "custom"
    | "mutualized"
    | "vps_mutualized";
  name: string;
  public: boolean;
  popular: boolean;
  description: string;
  price: {
    m: number;
    y: number;
  };
  savings_percentage: number;
  savings_money: number;
  ram: number;
  disk: number;
  vcpus: number;
  upsell?: string[];
}

/**
 * Interface d'une offre serveur
 */
export interface ServerOffer {
  type: string;
  public: boolean;
  popular: boolean;
  zones_info:
    | {
        [zoneName: string]: {
          os: string[];
          opid: string;
          op_info: {
            id: string;
            name: string;
            ram: number;
            disk: number;
            swap: string;
            "OS-FLV-EXT-DATA:ephemeral": number;
            "OS-FLV-DISABLED:disabled": boolean;
            vcpus: number;
            "os-flavor-access:is_public": boolean;
            rxtx_factor: number;
            links: Array<{
              rel: string;
              href: string;
            }>;
          };
        };
      }
    | string;
  wayhost_id: string;
  name: string;
  savings_percentage: number;
  savings_money: number;
  description: string;
  tag: string;
  user_count?: number;
  price: {
    m: number;
    y: number;
  };
  specs: {
    ram: number;
    disk: number;
    vcpus: number;
  };
  flavor_type: string;
  zone_name: string;
}

/**
 * Interface pour les détails d'un serveur VPS
 */
export interface VpsServerDetails {
  wayhost_id: string;
  opid: string;
  subid: string;
  name: string;
  email: string;
  ssh_key_name: string;
  os_name: string;
  type: string;
  flavor_info: {
    custom: boolean;
    id: string;
    name: string;
    tag: string;
    specs: {
      ram: number;
      disk: number;
      vcpus: number;
    };
  };
  status: string;
  created_at: string;
  expired: boolean;
  zone_name: string;
  backup_config: {
    automatic: boolean;
    frequency: {
      daily?: string;
      monthly?: string;
      weekly?: string;
    };
  };
  net_id: string;
  stack_id: string;
  stackid: string;
  tenant_id: string;
  subscription: {
    id: string;
    card_id: string;
    period: string;
    duration: number;
    email: string;
    service: string;
    service_info: {
      wayhost_id: string;
      os_name: string;
      zone_name: string;
      flavor_info: {
        custom: boolean;
        id: string;
        name: string;
        tag: string;
        specs: {
          ram: number;
          disk: number;
          vcpus: number;
        };
      };
    };
    status: string;
    auto_renew: boolean;
    created_date: string;
    expiration_date: string;
  };
  access_root: string | null;
  ssh_keys: string[];
  backups: string[];
  dns_alias: string[];
  security_groups: {
    name: string;
  }[];
  ips: {
    [key: string]: {
      version: number;
      addr: string;
      "OS-EXT-IPS:type": string;
      "OS-EXT-IPS-MAC:mac_addr": string;
    }[];
  };
  state: string;
  expiration_date: string;
}

/**
 * Interface d'un système d'exploitation
 */
export interface OperatingSystem {
  id: string;
  name: string;
  zones_info: { [zoneName: string]: string } | string;
  type: string;
  version: string;
  image_opid?: string;
  supported_specs: string;
  logo: string;
  created_at: string;
}

/**
 * Interface pour l'ajout d'un système d'exploitation pour le formulaire
 */
export interface AddOperatingSystem {
  name: string;
  zones_info: { [zoneName: string]: string };
  type: string;
  version: string;
  supported_specs: {
    ram: number;
    disk: number;
    vcpus: number;
  };
  files?: File | string;
}

/**
 * Interface pour l'ajout d'un système d'exploitation pour la soumission du formulaire
 */
export interface AddOperatingSystemValidated {
  name: string;
  zones_info: string;
  type: string;
  version: string;
  supported_specs: string;
  files?: File | string;
}

/**
 * Interface pour un système d'exploitation OpenStack
 */
export interface OpenStackOs {
  "owner_specified.openstack.md5": string;
  "owner_specified.openstack.sha256": string;
  "owner_specified.openstack.object": string;
  name: string;
  disk_format: string;
  container_format: string;
  visibility: string;
  size: number;
  virtual_size: number;
  status: string;
  checksum: string;
  protected: boolean;
  min_ram: number;
  min_disk: number;
  owner: string;
  os_hidden: boolean;
  os_hash_algo: string;
  os_hash_value: string;
  id: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  self: string;
  file: string;
  schema: string;
}

/**
 * Interface pour la modification d'un système d'exploitation
 */
export interface UpdateOperatingSystem {
  name?: string;
  zones_info: string;
  type?: string;
  version?: string;
  supported_specs?: string;
  files?: File | string;
}

export interface ZoneImage {
  id: string;
  name: string;
  url: string;
  type?: string;
  version?: string;
}

/**
 * Interface d'une zone géographique
 */
export interface Zone {
  id: string;
  status: string;
  created_date: string;
  name: string;
  country: string;
  continent: string;
  latitude: string;
  longitude: string;
  town: string;
  config_file?: string | null;
  user_count: number;
  server_count: number;
  config_file_url: string;
  flag: string;
  images: ZoneImage[];
}

/**
 * Interface des params de la requête pour la récupération des zones géographiques
 */
export interface GetZonesParams {
  id?: string;
  country?: string;
  continent?: string;
  config_file_example?: "no" | "yes";
}

/**
 * Type des continents disponibles
 */
export type Continent =
  | "Europe"
  | "North America"
  | "South America"
  | "Asia"
  | "Africa";

export type ZoneStatus =
  | "Active"
  | "Down"
  | "Maintenance"
  | "Restarting"
  | "Degraded";

/**
 * Interface des params de la requête pour ajouter des zones géographiques
 */
export interface AddZoneParams {
  name?: string;
  country: string;
  continent: Continent;
  status: ZoneStatus;
  flag?: string;
  latitude?: string;
  longitude?: string;
  town?: string;
  files?: File | string;
}

/**
 * Interface des params de la requête pour modifier une zone géographique
 */
export interface EditZoneParams {
  name?: string;
  country?: string;
  continent?: Continent;
  status?: ZoneStatus;
  flag?: string;
  latitude?: string;
  longitude?: string;
  town?: string;
  files?: File | string;
}

export type DiscountType = "percentage" | "fixed";
export type TargetType = "new" | "existing";
export type PromoCodeStatus = "upcoming" | "active" | "inactive" | "expired";
export type PromoCodeType = "code" | "auto";

/**
 * Interface des promotions
 */
export interface PromoCode {
  code: string;
  id: string;
  promo_type: PromoCodeType;
  discount_type: DiscountType;
  value: number;
  start_date: string;
  end_date: string;
  max_usage: number;
  used_count: number;
  min_purchase: number;
  is_active: boolean;
  applicables_cycles: string[];
  applicables_services: string[];
  one_time_per_user: boolean;
  per_user_limit: number;
  target_type: TargetType;
  target_users: string[];
  created_by: string;
  created_at: string;
  status: PromoCodeStatus;
}

export interface PromoCodeParams {
  id?: string;
  code?: string;
  page?: number;
  limit?: number;
  no_pagination?: boolean;
  status?: PromoCodeStatus;
}

export interface PromoCodeUsersParams {
  code_id: string;
  email_filter?: string;
  page?: number;
  limit?: number;
  //no_pagination?: boolean;
  status_filter?: PromoCodeStatus;
  service_filter?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Interface de la requête pour ajouter ou modifier une promotion
 */
export interface AddPromoCode {
  code: string;
  promo_type: PromoCodeType;
  discount_type: DiscountType;
  value: number;
  start_date: string;
  start_time: string;
  expiration_date: string;
  expiration_time: string;
  max_usage: number;
  target_type: TargetType;
  target_users?: string[];
  min_purchase: number;
  is_active: boolean;
  applicables_offers?: string[];
  applicables_cycles: string[];
  one_time_per_user: boolean;
  per_user_limit: number;
}

export interface UpdatePromoCode {
  code?: string;
  promo_type?: PromoCodeType;
  discount_type?: DiscountType;
  value?: number;
  start_date?: string;
  start_time?: string;
  expiration_date?: string;
  expiration_time?: string;
  max_usage?: number;
  target_type?: TargetType;
  target_users?: string[];
  min_purchase?: number;
  is_active?: boolean;
  applicables_offers?: string[];
  applicables_cycles?: string[];
  one_time_per_user?: boolean;
  per_user_limit?: number;
}

/**
 * Interface des groupes de sécurité
 */
export interface GetSecurityGroupsParams {
  sg_id?: string;
  wayhost_id?: string;
}

export interface UpdateSecurityGroupsParams {
  sg_id?: string;
  wayhost_id?: string;
  action?: "add" | "remove";
}

export interface SecurityGroup {
  id: string;
  name: string;
  stateful: boolean;
  tenant_id: string;
  description: string;
  shared: boolean;
  security_group_rules: SecurityGroupRule[];
  tags: any[];
  created_at: string;
  updated_at: string;
  revision_number: number;
  project_id: string;
}

export interface SecurityGroupRule {
  id: string;
  tenant_id: string;
  security_group_id: string;
  ethertype: string;
  direction: string;
  protocol: string | null;
  port_range_min: number | null;
  port_range_max: number | null;
  remote_ip_prefix: string | null;
  remote_address_group_id: string | null;
  normalized_cidr: string | null;
  remote_group_id: string;
  standard_attr_id: number;
  description: string | null;
  tags: any[];
  created_at: string;
  updated_at: string;
  revision_number: number;
  project_id: string;
}

export interface UpdateSecurityGroup {
  name?: string;
  description?: string;
  rules_to_add?: {
    cidr: string;
    direction: "ingress" | "egress";
    ethertype: "IPv4" | "IPv6";
    from_port: number;
    ip_protocol: string;
    to_port: number;
  }[];
  rules_to_remove?: string[];
}

/**
 * Interface pour les clés SSH
 */

export interface GetSshKeyParams {
  server_id: string;
  key_id?: string;
  download: boolean;
}

export interface SshKey {
  keypair: {
    name: string;
    public_key: string;
    fingerprint: string;
    key_type?: string;
    key_id?: string;
    created_at?: string;
  };
}

export interface SshKeyDetails {
  public_key: string;
  private_key: string;
}

export interface AddSshKey {
  key_name?: string;
  public_key?: string | null;
  private_key?: string | null;
}

/**
 * Interface pour les backups
 */

export interface GetBackupsParams {
  wayhost_id?: string; // for get one backup
  server_id?: string; // for get all backups
  download?: "no" | "yes";
  per_page?: string;
  page?: string;
}

export interface PostBackupsParams {
  wayhost_id: string;
  upload?: "no" | "yes";
  clone?: "no" | "yes";
  billing_address?: string;
}

export interface UpdateBackupsParams {
  wayhost_id: string;
  upload?: "no" | "yes";
}

export interface InstanciateBackupsParams {
  wayhost_id: string;
  billing_address?: string;
}

export interface PostBackups {
  name: string;
  description?: string;
  period?: "m" | "y";
  plan?: number;
  auto_renew?: boolean;
}

export interface BackupsType {
  opid: string;
  wayhost_id: string;
  name: string;
  description?: string;
  zone_name: string;
  from_server_name: string;
  from_server_id: string;
  created_date: string;
  expiration_date: string | null;
  email: string;
  size: string | null;
  virtual_size: string | null;
}
