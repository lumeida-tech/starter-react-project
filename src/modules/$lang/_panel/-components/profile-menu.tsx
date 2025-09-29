/*
|--------------------------------------------------------------------------
| Imports Section
|--------------------------------------------------------------------------
*/

import { useRouter, useLocation } from "@tanstack/react-router";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  FileTextIcon,
  PowerIcon,
  SettingsIcon,
  WalletIcon,
  GlobeIcon,
  User,
  LayoutDashboard,
} from "lucide-react";
import React, { useMemo } from "react";
import { Separator } from "@/shared/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  activeMenuAtom,
  isProfileMenuOpenAtom,
  activeMenuSubtitleAtom,
} from "../stores";
import { useLogoutMutation } from "@/modules/$lang/_auth/hooks";
import { useAtom } from "jotai";
import { userAtom } from "@/modules/$lang/_auth/stores";
import { currentNavigationAtom } from "../stores";

/*
|--------------------------------------------------------------------------
| Types Section
|--------------------------------------------------------------------------
| List of all types used inside the component
|
*/

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  href: string;
}

/*
|--------------------------------------------------------------------------
| ProfileMenu Component
|--------------------------------------------------------------------------
*/

export default function ProfileMenu() {
  /*
    |--------------------------------------------------------------------------
    | Data Section
    |--------------------------------------------------------------------------
    | List of all variables used inside the component
    |
    */
  const defaultMenuItems: MenuItem[] = [
    {
      icon: <SettingsIcon className="w-5 h-5" />,
      label: "Mon compte",
      subtitle: "Gestion de vos informations personnelles",
      href: "/customer/profile",
    },
    {
      icon: <FileTextIcon className="w-5 h-5" />,
      label: "Facturations",
      subtitle: "Gestion de vos factures",
      href: "/customer/profile/billing",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M14.5011 22H18.0011C18.5315 22 19.0402 21.7893 19.4153 21.4142C19.7903 21.0391 20.0011 20.5304 20.0011 20V7L15.0011 2H6.00106C5.47062 2 4.96192 2.21071 4.58684 2.58579C4.21177 2.96086 4.00106 3.46957 4.00106 4V8M14.0011 2V6C14.0011 6.53043 14.2118 7.03914 14.5868 7.41421C14.9619 7.78929 15.4706 8 16.0011 8H20.0011M7.00106 17V22M7.00106 17L11.7011 14.2M7.00106 17L2.30106 14.2M3.00106 13.1C2.69288 13.2779 2.43773 13.5348 2.26195 13.8441C2.08616 14.1535 1.9961 14.5042 2.00106 14.86V18.1C1.98948 18.4562 2.07329 18.809 2.24383 19.122C2.41437 19.4349 2.66544 19.6966 2.97106 19.88L6.00106 21.7C6.30774 21.8827 6.65773 21.9799 7.01469 21.9817C7.37166 21.9835 7.72259 21.8896 8.03106 21.71L11.0011 19.9C11.3092 19.7221 11.5644 19.4652 11.7402 19.1559C11.9159 18.8465 12.006 18.4958 12.0011 18.14V14.9C12.0126 14.5438 11.9288 14.191 11.7583 13.878C11.5877 13.5651 11.3367 13.3034 11.0311 13.12L8.00106 11.3C7.69437 11.1173 7.34438 11.0201 6.98742 11.0183C6.63046 11.0165 6.27953 11.1104 5.97106 11.29L3.00106 13.1Z"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      label: "Mes commandes",
      subtitle: "Gestion de vos commandes",
      href: "/customer/profile/receipts",
    },
    {
      icon: <WalletIcon className="w-5 h-5" />,
      label: "Portefeuille",
      subtitle: "Gestion de vos informations de portefeuille",
      href: "/customer/profile/wallet",
    },
  ];
  const router = useRouter();
  const location = useLocation();
  const [currentNavigation, setCurrentNavigation] = useAtom(
    currentNavigationAtom
  );
  const [activeMenu, setActiveMenu] = useAtom(activeMenuAtom);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useAtom(
    isProfileMenuOpenAtom
  );
  const [activeMenuSubtitle, setActiveMenuSubtitle] = useAtom(
    activeMenuSubtitleAtom
  );
  const [user] = useAtom(userAtom);
  const { mutate: logoutMutation, isPending: isLogoutPending } =
    useLogoutMutation();

  const menuItems = useMemo(() => {
    const items = [];

    // Add default menu items first
    items.push(...defaultMenuItems);

    // Add conditional navigation action at the bottom
    const isInPanelOrAdmin =
      location.pathname.includes("/customer") || location.pathname.includes("/admin");

    if (isInPanelOrAdmin) {
      // If on /customer or /admin → Show "Site web"
      items.push({
        icon: <GlobeIcon className="w-5 h-5" />,
        label: "Site web",
        subtitle: "Retourner au site web",
        href: "/",
      });
    } else {
      // If elsewhere → Show "Espace client"
      items.push({
        icon: <User className="w-5 h-5" />,
        label: "Espace client",
        subtitle: "Accéder à votre espace client",
        href: "/customer/dashboard",
      });
    }

    // Add admin menu if user is admin
    if (user?.isAdmin) {
      items.push({
        icon: <LayoutDashboard className="w-5 h-5" />,
        label: "Espace d'administration",
        subtitle: "Gestion de votre espace d'administration",
        href: "/admin",
      });
    }

    return items;
  }, [user?.isAdmin, location.pathname]);

  /*
    |--------------------------------------------------------------------------
    | Methods Section
    |--------------------------------------------------------------------------
    | List of all functions used inside the component
    |
    */

  const getInitiales = useMemo(() => {
    if (!user?.fullName) return "";
    return user.fullName.replace(/^(\S)\S*\s+(?:\S+\s+)*(\S)\S*$/, "$1$2");
  }, [user?.fullName]);

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.href === "/admin") {
      setCurrentNavigation("admin");
      setActiveMenu("Utilisateurs");
      setActiveMenuSubtitle(
        "Gérer les utilisateurs de Wayhost directement ici"
      );
      //router.push("/admin/users");
    } else if (item.href === "/") {
      // Navigate to website - reset panel navigation state
      //router.push("/");
    } else if (item.href === "/customer/dashboard") {
      // Navigate to customer dashboard
      setCurrentNavigation("main");
      setActiveMenu("Tableau de bord");
      setActiveMenuSubtitle("Statistiques et gestion de vos services");
      //router.push("/customer/dashboard");
    } else {
      setActiveMenu(item.label);
      setActiveMenuSubtitle(item.subtitle || "");
      //router.push(item.href);
      setCurrentNavigation("account");
    }
    setIsProfileMenuOpen(false);
  };

  const handleLogoutAction = () => {
    logoutMutation();
  };

  const renderProfileHeader = () => (
    <div className="flex flex-col items-center">
      <Avatar className="w-[100px] h-[100px] mt-8">
        <AvatarImage src="" alt="profile-image" />
        <AvatarFallback className="text-base font-normal text-[25px] bg-[#c3d6f9] text-black">
          {getInitiales}
        </AvatarFallback>
      </Avatar>

      <div className="w-full px-8 mt-4">
        <div className="flex items-center flex-row justify-center gap-1 font-normal text-black font-roboto text-[16px] not-italic leading-normal whitespace-nowrap">
          <p>Email :</p>
          <p className="underline truncate">{user?.email}</p>
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={() => null} className="pt-2 pr-[22px] cursor-pointer pb-2 pl-[21px] h-10 w-[182px] hover:bg-[#2b73f4] bg-[#2b73f4] rounded-[15px] flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M17 3H7C4.79 3 3 4.79 3 7V17C3 19.21 4.79 21 7 21H19C20.11 21 21 20.11 21 19V9C21 8.46957 20.7893 7.96086 20.4142 7.58579C20.0391 7.21071 19.5304 7 19 7V5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3ZM17 5V7H7C6.27 7 5.59 7.2 5 7.54V7C5 5.9 5.9 5 7 5M15.5 15.5C14.67 15.5 14 14.83 14 14C14 13.17 14.67 12.5 15.5 12.5C16.33 12.5 17 13.17 17 14C17 14.83 16.33 15.5 15.5 15.5Z"
                fill="white"
              />
            </svg>
            <span className="font-normal text-white text-[16px] not-italic leading-normal">
              Solde : <span className="font-bold">{user?.walletAmount?.toFixed(2)} € </span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMenuItems = () => (
    <div className="w-full px-6 mt-6 space-y-4">
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={() => handleMenuItemClick(item)}
          className="flex items-center gap-3 cursor-pointer px-2 py-1 rounded text-[16px] hover:bg-gray-50 transition-colors"
        >
          {item.icon}
          <span className="font-normal text-black">{item.label}</span>
        </div>
      ))}
    </div>
  );

  const renderLogoutSection = () => (
    <div className="mt-4">
      <Separator className="w-full h-0.5" />
      <Dialog>
        <DialogTrigger asChild>
          <div className="px-6 py-2">
            <div className="flex items-center gap-3 cursor-pointer px-2 py-1 rounded hover:bg-red-50 transition-colors">
              <PowerIcon className="w-5 h-5 text-[#b93400]" />
              <span className="text-[#BA3500] font-roboto text-[16px] not-italic font-normal leading-normal">
                Se déconnecter
              </span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle className="text-black font-roboto text-2xl not-italic font-extrabold leading-[117.217%] pt-4">
              Déconnexion de votre compte
            </DialogTitle>
          </DialogHeader>
          <div>
            <p className="text-black font-inter text-base not-italic font-normal leading-normal">
              Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
            </p>
          </div>
          <DialogFooter>
            <Button
              disabled={isLogoutPending}
              onClick={handleLogoutAction}
              type="button"
              className="gradient-btn-primary px-10 py-5 text-[16px]"
            >
              {isLogoutPending ? "Veuillez patienter..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  /*
    |--------------------------------------------------------------------------
    | Hooks Section
    |--------------------------------------------------------------------------
    | List of all hooks used inside the component
    |
    */

  /*
    |--------------------------------------------------------------------------
    | Render Section
    |--------------------------------------------------------------------------
    | The component's render method
    |
    */
  return (
    <Card className="w-[300px] rounded-[40px] overflow-hidden border-2 border-solid border-[#f1f1f1] h-auto">
      <CardContent className="p-0 h-full flex flex-col">
        {renderProfileHeader()}
        <Separator className="w-full h-0.5 mt-8" />
        {renderMenuItems()}
        {renderLogoutSection()}
      </CardContent>
    </Card>
  );
}
