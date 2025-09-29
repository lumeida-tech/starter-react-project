/*
|--------------------------------------------------------------------------
| Imports Section
|--------------------------------------------------------------------------
*/

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/shared/components/ui/command";
import {
  Home,
  User,
  Wallet,
  Server,
  Globe,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import React from "react";
import { useAtom } from "jotai";
import { isCommandMenuOpenAtom } from "../stores";

/*
|--------------------------------------------------------------------------
| Types Section
|--------------------------------------------------------------------------
| List of all types used inside the component
|
*/

interface CommandAction {
  icon: React.ReactNode;
  label: string;
}

export function CommandMenu() {
  /*
    |--------------------------------------------------------------------------
    | Data Section
    |--------------------------------------------------------------------------
    | List of all variables used inside the component
    |
    */

  // Store state
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useAtom(
    isCommandMenuOpenAtom
  );

  // Router
  const router = useRouter();

  // Command actions data
  const commandActions = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Tableau de bord",
      href: "/customer/dashboard"
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Profil",
      href: "/customer/profile"
    },
    {
      icon: <Wallet className="h-5 w-5" />,
      label: "Portefeuille",
      href: "/customer/profile/wallet"
    },
    {
      icon: <Server className="h-5 w-5" />,
      label: "Mes serveurs",
      href: "/customer/servers"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      label: "Mes domaines",
      href: "/customer/domains"
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Boutique",
      href: "/customer/store"
    }
  ];

  /*
    |--------------------------------------------------------------------------
    | Methods Section
    |--------------------------------------------------------------------------
    | List of all functions used inside the component
    |
    */

  // Handle keyboard shortcut
  const handleKeyboardShortcut = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsCommandMenuOpen(!isCommandMenuOpen);
    }
  };

  /*
    |--------------------------------------------------------------------------
    | Hooks Section
    |--------------------------------------------------------------------------
    | List of all hooks used inside the component
    |
    */

  // Keyboard shortcut effect
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyboardShortcut);
    return () =>
      document.removeEventListener("keydown", handleKeyboardShortcut);
  }, [isCommandMenuOpen]);

  /*
    |--------------------------------------------------------------------------
    | Render Section
    |--------------------------------------------------------------------------
    | The component's render method
    |
    */
  return (
    <Dialog open={isCommandMenuOpen} onOpenChange={setIsCommandMenuOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command>
          <CommandInput
            placeholder="Rechercher une action..."
            className="h-12 pl-11 pr-3 text-sm leading-3 bg-background"
          />
          <CommandList>
            <CommandEmpty>
              Aucune action trouvée.
            </CommandEmpty>
            <CommandGroup heading="Actions rapides">
              {commandActions.map((action) => (
                <CommandItem
                  key={action.label}
                  onSelect={() => {
                   // router.push(action.href);
                    setIsCommandMenuOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-3 p-3 hover:bg-accent"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
