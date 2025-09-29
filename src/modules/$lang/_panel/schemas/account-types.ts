/**
 * Interface pour les données utilisateur du panel
 */
// Définir le type User pour le typage strict
export interface User {
  id: string | number;
  fullName: string;
  email: string;
  status: string;
  creationDate: string;
  role: string;
  services: string;
  hasProfilePic: boolean;
  profilePicId?: string;
  isVerified: boolean;
  entrepriseStatus?: boolean;
  enterpriseName?: string;
  accountType?: string;
  address?: string;
  phoneNumber?: string;
  siretNumber?: string;
  tvaNumber?: string;
  kbisNumber: string;
  initials: string;
  wallet: number;
}

/**
 * Interface pour les données 2FA
 */
export interface DataFor2FA {
  otp_secret: string;
  qr_url: string;
}

/**
 * Type pour le statut d'activation du compte
 */
export type AccountActivationStatus = 'pending' | 'activated' | 'failed'; 

// Define type for pixel crop area
export type Area = { x: number; y: number; width: number; height: number }
  

export interface AddBillingAddressFormProps {
  onCancel: () => void;
  onSave: (address: BillingAddress) => void;
  initialValues?: BillingAddress;
  isEditMode?: boolean;
  isLoading?: boolean;
}

export interface BillingAddress {
  uuid?: string;
  id: number;
  firstname: string;
  lastname: string;
  address: string;
  phone: string;
  company: string;
  vat: string;
  isDefault: boolean;
}
