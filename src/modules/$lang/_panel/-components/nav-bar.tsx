/*
|--------------------------------------------------------------------------
| Imports Section
|--------------------------------------------------------------------------
*/

import { useEffect, useState, useRef } from "react";
import {
  CommandIcon,
  ShoppingCart,
  MenuIcon,
  SearchIcon,
  X,
  Languages,
  Moon,
  Bell,
  Blocks,
} from "lucide-react";


import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

// import { ProfileMenu } from "./profile/profile-menu";
import { useAtom } from "jotai";

import UserDropdown from "./user-dropdown";

import {
  isCommandMenuOpenAtom,
  isMobileMenuOpenAtom,
} from "../stores/panel-atoms";

import { userAtom, isAuthenticatedAtom } from "@/modules/$lang/_auth/stores";

import {
  useOsQuery,
  useUserInfoQuery,

} from "../hooks";
import { Link, useRouter } from "@tanstack/react-router";
import { useGetServiceInCartQuery } from "../../_auth/hooks/useAuth";
import { langAtom } from "@/shared/atoms";

/*
|--------------------------------------------------------------------------
| Types Section
|--------------------------------------------------------------------------
*/

// No specific types needed for this component

/*
|--------------------------------------------------------------------------
| HeaderSection Component
|--------------------------------------------------------------------------
*/

export default function NavBar() {
  const [currentLang, setCurrentLang] = useAtom(langAtom);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLang: string) => {
    if (newLang !== currentLang) {
      setCurrentLang(newLang);
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(/^\/(fr|en)/, `/${newLang}`);
      router.history.push(newPath);
      setShowLangDropdown(false);
    }
  };
  /*
    |--------------------------------------------------------------------------
    | Data Section
    |--------------------------------------------------------------------------
    | List of all variables used inside the component
    |
    */
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useAtom(
    isCommandMenuOpenAtom
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useAtom(isMobileMenuOpenAtom);

  const [user, setUser] = useAtom(userAtom);
  const [isAuthenticated, setAuthenticated] = useAtom(isAuthenticatedAtom);

  const [serviceInCart, setServiceInCart] = useState(0);
  //const [checkoutData_cart, setCheckoutDataCart] = useAtom(checkoutDataCart);

  const { status, data, error, isFetching } = useUserInfoQuery();



  /*
    |--------------------------------------------------------------------------
    | Methods Section
    |--------------------------------------------------------------------------
    | List of all functions used inside the component
    |
    */


  useEffect(() => {
    // console.log("User info", data);
    if (status === "success") {
      const {
        id,
        email,
        name,
        siret_number,
        numero_tva,
        firstname,
        lastname,
        phone_number,
        profile_picture,
        address,
        head_office,
        enterprise_status,
        balance,
        configured_email_mfa,
        accountType,
        roles: { admin: isAdmin },
      } = data?.data;

      setUser({
        id,
        email,
        profilePicture: profile_picture,
        enterpriseName: name,
        enterpriseSiege: head_office,
        enterpriseSiret: siret_number,
        enterpriseTva: numero_tva,
        enterpriseIsValidated: enterprise_status === "enable",
        address,
        walletAmount: balance,
        phone: phone_number,
        emailAuthAddress: configured_email_mfa,
        emailAuthEnabled: data?.data["email_mfa"] === "yes",
        fullName: `${firstname} ${lastname}`,
        twoFactorEnabled: data?.data["2FA"] === "yes",
        whatsappNumberEnabled: data?.data["whatsapp_mfa"] === "yes",
        whatsappNumber: data?.data["whatsapp_number"],
        accountType,
        isAdmin,
      });
      setAuthenticated(true);
    }


  }, [data]);

  return (
    <header className="w-full fixed z-50 h-20 bg-white border-b border-border flex items-center justify-between gap-4 px-4 md:px-8 lg:px-14">
      {/* Mobile menu toggle - only visible on small screens */}
      <div className="flex lg:hidden">
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`mr-2 h-10 w-10 text-white ${isMobileMenuOpen
              ? "bg-error hover:bg-error/80 transition-colors"
              : "bg-primary hover:bg-primary/80 transition-colors"
            }`}
        >
          {isMobileMenuOpen ? (
            <X className="h-8 w-8 text-white" />
          ) : (
            <MenuIcon className="h-8 w-8" />
          )}
        </Button>
      </div>

      {/* Logo */}
      <div className="flex items-center h-10 md:h-8">
        <Link to="/" className="flex items-center">
          <img
            width={216}
            height={78}
            alt="Logo"
            src={"/logo.svg"}
            className="w-auto h-12 md:h-auto"
          />
        </Link>
      </div>

      {/* Search - hidden on mobile */}
      <div className="hidden md:block relative w-[409px] max-w-full">
        <div className="absolute inset-y-0 left-[23px] flex items-center pointer-events-none">
          <SearchIcon className="h-6 w-6 text-[#727272]" />
        </div>

        <Input
          className="!h-[50px] pl-[70px] cursor-pointer pr-[100px] !bg-[rgba(243,243,243,1)] rounded-[50px] font-medium text-[#727272] !shadow-none"
          placeholder="Recherche..."
          readOnly
          onClick={() => setIsCommandMenuOpen(true)}
        />
        <div className="absolute right-[50px] top-1/2 transform -translate-y-1/2 flex space-x-1">
          <div className="w-[25px] h-[25px] bg-white rounded-[5px] flex items-center justify-center">
            <CommandIcon className="h-4 w-4 text-[#bfbfbf]" />
          </div>
          <div className="w-[25px] h-[25px] bg-white rounded-[5px] flex items-center justify-center">
            <span className="[font-family:'Roboto',Helvetica] font-black text-[#bfbfbf] text-lg">
              K
            </span>
          </div>
        </div>
      </div>

      {/* Right section - icons and profile */}
      <div className="flex items-center gap-4 md:gap-[40px_45px]">
        {/* Desktop icons */}
        <div className="hidden lg:flex gap-[15px] md:gap-[25px] items-center">
          <div className="relative">
            <button 
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1"
            >
              <Languages className="h-5 w-5 md:h-6 md:w-6 text-[#727272] hover:text-primary aspect-[1] object-contain shrink-0 cursor-pointer" />
              {currentLang === 'fr' ? '🇫🇷' : '🇬🇧'}
            </button>
            
            {showLangDropdown && (
              <div 
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <button
                  onClick={() => handleLanguageChange('fr')}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  🇫🇷 Français
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>
          <Moon className="h-5 w-5 md:h-6 md:w-6 mr-2 text-[#727272] focus:text-primary aspect-[1] object-contain shrink-0 cursor-pointer" />

          <Bell className="h-5 w-5 md:h-6 md:w-6 mr-2 text-[#727272] focus:text-primary aspect-[1] object-contain shrink-0 cursor-pointer" />

          <div
            className={`relative flex items-center justify-center ${serviceInCart && "bg-gray-100"
              } rounded-full p-2 cursor-pointer`}
            onClick={() => {
              // router.push("/cart/recap");
            }}
          >
            {serviceInCart > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                {serviceInCart}
              </span>
            )}
            <ShoppingCart className="relative h-5 w-5 md:h-6 md:w-6 text-[#727272]" />
          </div>
        </div>

        {/* Compact mobile/tablet icons - visible md to lg */}

        <div className=" md:flex lg:hidden items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative flex items-center justify-center cursor-pointer h-12 w-12 rounded-full hover:bg-gray-100 transition-colors">
                <Blocks className="w-7 h-7 opacity-70" />
                {serviceInCart > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {serviceInCart}
                  </span>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2">
              <div className="flex flex-col gap-2">
                <DropdownMenuItem className="focus:text-primary">
                  <Languages className="h-4 w-4 mr-2 focus:text-primary" />
                  Langue
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:text-primary">
                  <Moon className="h-4 w-4 mr-2 focus:text-primary" />
                  Thème
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:text-primary">
                  <Bell className="h-4 w-4 mr-2 focus:text-primary" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="focus:text-primary relative"
                  onClick={() => {
                    //router.push("/cart/recap");
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2 focus:text-primary" />
                  Panier
                  {serviceInCart > 0 && (
                    <span className="absolute  right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {serviceInCart}
                    </span>
                  )}
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Profile dropdown - simplified on mobile */}
        <UserDropdown />
      </div>

      {/* Mobile search - only visible on small screens */}
      <div className="fixed top-20 left-0 right-0 z-30 md:hidden px-4 py-3 bg-white border-b border-gray-200">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-[#727272]" />
          </div>
          <Input
            className="!h-[45px] pl-12 cursor-pointer !bg-[rgba(243,243,243,1)] rounded-[50px] font-medium text-[#727272] !shadow-none"
            placeholder="Recherche..."
            readOnly
            onClick={() => setIsCommandMenuOpen(true)}
          />
        </div>
      </div>
    </header>
  );
}
