import React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { currentNavigationAtom } from "../stores";
import {
  ChevronRight,
  PanelLeft,
  PanelRight,
  ShoppingCart,
} from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import {
  isMobileMenuOpenAtom,
  mainNavigationItemsAtom,
  accountSettingsItemsAtom,
  serverManagementItemsAtom,
  adminNavigationItemsAtom,
  activeMenuAtom,
  activeMenuSubtitleAtom,
  isSidebarCollapsedAtom,
  expandedMenusAtom,
  isSubmenuPopupVisibleAtom,
} from "../stores/panel-atoms";
import { useNavigate } from "@tanstack/react-router";
import { useSafeDisplay } from "@/shared/use-safe-display";
import { getCurrentLang } from "@/shared/atoms";

// Portal component to render popup outside component hierarchy
const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

// Skeleton loader component for navigation items
const NavigationSkeleton = ({
  isSidebarCollapsed,
}: {
  isSidebarCollapsed: boolean;
}) => {
  const skeletonItems = Array.from({ length: 8 }, (_, index) => (
    <div key={index} className="flex justify-center">
      <div
        className={`relative ${isSidebarCollapsed ? "w-[50px]" : "w-[220px]"
          } h-[50px] mx-[15px]`}
      >
        <div
          className={`absolute w-full h-full rounded-[15px] bg-primary/10 animate-pulse ${isSidebarCollapsed ? "justify-center -ml-[15px]" : ""
            }`}
        >
          <div className="flex items-center justify-center w-full h-full px-3">
            <div
              className={`flex-shrink-0 ${isSidebarCollapsed ? "" : "mr-3"}`}
            >
              <div className="h-8 w-8 bg-primary/20 rounded animate-pulse"></div>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 flex justify-between items-center">
                <div className="h-4 bg-primary/20 rounded animate-pulse w-24"></div>
                <div className="h-4 w-4 bg-primary/20 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ));

  return <div className="space-y-2 p-4">{skeletonItems}</div>;
};

export default function SlideBar() {
  const [mounted, setMounted] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useAtom(isMobileMenuOpenAtom);
  const mainNavigationItems = useAtomValue(mainNavigationItemsAtom);
  const accountSettingsItems = useAtomValue(accountSettingsItemsAtom);
  const adminNavigationItems = useAtomValue(adminNavigationItemsAtom);
  const serverManagementItems = useAtomValue(serverManagementItemsAtom);

  // Effet pour marquer le composant comme monté côté client
  React.useEffect(() => {
    setMounted(true);
  }, []);
  const [activeMenu, setActiveMenu] = useAtom(activeMenuAtom);
  const [activeMenuSubtitle, setActiveMenuSubtitle] = useAtom(
    activeMenuSubtitleAtom
  );
  const [isSidebarCollapsed, setSidebarCollapsed] = useAtom(
    isSidebarCollapsedAtom
  );
  const [expandedMenus, setExpandedMenus] = useAtom(expandedMenusAtom);
  const [isSubmenuPopupVisible, setIsSubmenuPopupVisible] = useAtom(
    isSubmenuPopupVisibleAtom
  );
  const [popupPosition, setPopupPosition] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const buttonRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );
  const popupRef = React.useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Helper function to check if activeMenu belongs to item's submenu
  const isActiveMenuInSubmenu = (item: any) => {
    return item.submenuItems?.some(
      (subItem: any) => subItem.label === activeMenu
    );
  };

  // Gestion du click outside pour fermer le popup
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setExpandedMenus([]);
        setPopupPosition(null);
        setIsSubmenuPopupVisible(false);
      }
    };

    if (isSidebarCollapsed && expandedMenus.length > 0 && popupPosition) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isSidebarCollapsed, expandedMenus.length, popupPosition]);

  // Base sidebar classes
  const sidebarBaseClasses = `
    fixed z-50 
    h-screen rounded-tr-[70px] 
    bg-gradient-to-t from-[rgba(249,245,255,1)] to-[rgba(226,237,255,1)] 
    transition-all duration-300 
    shadow-lg flex flex-col
    ${isSidebarCollapsed ? "w-[80px]" : "w-[260px]"}
  `;

  // Desktop specific classes (always visible)
  const desktopClasses = `
    left-0 top-20
    lg:block hidden
  `;

  // Mobile drawer classes (only visible when toggled)
  const mobileDrawerClasses = `
    left-0 top-20 bottom-0
    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
    lg:hidden block
  `;

  const [currentNavigation, setCurrentNavigation] = useAtom(
    currentNavigationAtom
  );

  // Afficher le skeleton si pas encore monté OU si currentNavigation est null
  // Cela évite les erreurs de hydratation en gardant un état cohérent
  const showSkeleton = !mounted || currentNavigation === null;

  const currentNavigationItems: any = showSkeleton
    ? []
    : currentNavigation === "main"
      ? mainNavigationItems
      : currentNavigation === "manage-servers"
        ? serverManagementItems
        : currentNavigation === "account"
          ? accountSettingsItems
          : adminNavigationItems;

  const handleItemClick = (item: (typeof currentNavigationItems)[0]) => {
    // Handle navigate back action
    if (
      useSafeDisplay(item.action).isDefined &&
      item.action === "navigateBack"
    ) {
      setCurrentNavigation("main");
      navigate({ to: `/$lang/customer/dashboard`, params: { lang: getCurrentLang() } });
      setActiveMenu("Tableau de bord");
      setActiveMenuSubtitle(item.subtitle);
      setExpandedMenus([]);
      return;
    }

    // Handle items with submenu first (regardless of action)
    if (item.hasSubmenu) {
      if (expandedMenus.includes(item.label)) {
        setExpandedMenus(
          expandedMenus.filter((menu: string) => menu !== item.label)
        );
        setPopupPosition(null); // Fermer popup
        setIsSubmenuPopupVisible(false);
      } else {
        setExpandedMenus([item.label]);

        // Ne changer l'activeMenu que si l'activeMenu actuel n'est pas un sous-item de ce menu
        const isCurrentMenuInSubmenu = item.submenuItems?.some(
          (subItem: any) => subItem.label === activeMenu
        );

        if (!isCurrentMenuInSubmenu) {
          setActiveMenu(item.label);
          setActiveMenuSubtitle(item.subtitle);
        }

        // Calculer position pour popup en mode collapsed
        if (isSidebarCollapsed) {
          // Détecter si on est sur mobile pour choisir la bonne référence
          const isMobile = window.innerWidth < 768; // md breakpoint
          const buttonElement = isMobile
            ? buttonRefs.current[item.label + "_mobile"]
            : buttonRefs.current[item.label];

          if (buttonElement) {
            const rect = buttonElement.getBoundingClientRect();
            setPopupPosition({
              x: rect.right + 8,
              y: rect.top,
            });
            setIsSubmenuPopupVisible(true);
          }
        }
      }

      // if(!item?.submenuItems.find(({label}: {label: string}) => label === activeMenu)) {
      //   router.push(item?.submenuItems[0].href);
      //   setActiveMenu(item?.submenuItems[0].label);
      //   setActiveMenuSubtitle(item?.submenuItems[0].subtitle)
      // }
    }

    // Handle items with action (navigation)
    else if (item.action && useSafeDisplay(item.action).isDefined) {
      if (item.action.includes("[serverId]")) {
        item.action = item.action.replace(
          "[serverId]",
          window.location.pathname.split("/")[4]
        );
      }
      if (useSafeDisplay(item.action).isDefined) {
        navigate({ to: `/$lang/${item.action}`, params: { lang: getCurrentLang() } });
      }


      setActiveMenu(item.label);
      setActiveMenuSubtitle(item.subtitle);
      setExpandedMenus([]);
    }
    // Handle items without submenu and without action
    else {
      setActiveMenu(item.label);
      setActiveMenuSubtitle(item.subtitle);
      setExpandedMenus([]);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`${sidebarBaseClasses} ${desktopClasses}`}>
        <ScrollArea
          className={` ${isSidebarCollapsed
              ? "h-[calc(100vh-280px)]"
              : "h-[calc(100vh-230px)]"
            } mt-[50px] [&>[data-slot=scroll-area-scrollbar]>[data-slot=scroll-area-thumb]]:bg-primary/20`}
        >
          {showSkeleton ? (
            <NavigationSkeleton isSidebarCollapsed={isSidebarCollapsed} />
          ) : (
            <div className="space-y-2 p-4">
              {currentNavigationItems.map((item: any, index: any) => (
                <React.Fragment key={index}>
                  <div className="flex justify-center">
                    <div
                      className={`relative ${isSidebarCollapsed ? "w-[50px]" : "w-[220px]"
                        } h-[50px] mx-[15px]`}
                    >
                      <Button
                        ref={(el) => {
                          if (el) buttonRefs.current[item.label] = el;
                        }}
                        variant="ghost"
                        className={`absolute text-black cursor-pointer text-base font-semibold w-full h-full hover:bg-primary/20 ${isSidebarCollapsed ? "justify-center -ml-[15px]" : ""
                          } ${(item.hasSubmenu &&
                            (expandedMenus.includes(item.label) ||
                              isActiveMenuInSubmenu(item))) ||
                            (!item.hasSubmenu &&
                              activeMenu === item.label &&
                              expandedMenus.length === 0)
                            ? "gradient-btn-primary rounded-[15px] text-white hover:text-white"
                            : "text-black"
                          }`}
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex items-center w-full">
                          <div className="flex-shrink-0 mr-3">
                            {item.icon && <item.icon className="h-8 w-8" />}
                          </div>
                          {!isSidebarCollapsed && (
                            <div className="flex-1 flex justify-between items-center">
                              <span className="ml-1 text-[18px]">
                                {item.label}
                              </span>
                              {item.showChevron && (
                                <ChevronRight
                                  className={`h-6 w-6 ${item.hasSubmenu &&
                                      (expandedMenus.includes(item.label) ||
                                        isActiveMenuInSubmenu(item))
                                      ? "text-white"
                                      : "text-black"
                                    } ${item.hasSubmenu &&
                                      expandedMenus.includes(item.label)
                                      ? "transform rotate-90"
                                      : ""
                                    }`}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </Button>
                    </div>
                  </div>
                  {!isSidebarCollapsed &&
                    item.hasSubmenu &&
                    expandedMenus.includes(item.label) && (
                      <div className="ml-[26px] border-l-2 border-[#2B73F4] pl-4 space-y-3 py-2 mb-2">
                        {item.submenuItems?.map((subItem: any, idx: any) => (
                          <div
                            key={idx}
                            className={`${subItem.isHeader
                                ? "text-gray-500 text-sm font-medium mb-2"
                                : "cursor-pointer hover:text-primary transition-colors"
                              } ${activeMenu === subItem.label
                                ? "text-gradient-primary font-semibold"
                                : ""
                              }`}
                            onClick={() => {
                              if (!subItem.isHeader) {
                                setActiveMenu(subItem.label);
                                setActiveMenuSubtitle(subItem.subtitle);
                                if (subItem.href) {
                                  navigate({ to: `/$lang/${subItem.href}`, params: { lang: getCurrentLang() } });
                                }
                              }
                            }}
                          >
                            {subItem.label}
                          </div>
                        ))}
                      </div>
                    )}
                </React.Fragment>
              ))}
            </div>
          )}
        </ScrollArea>
        {/* Bottom buttons container - Desktop (conditional layout) */}
        <div
          className={`flex justify-center items-center p-4 mt-auto ${isSidebarCollapsed ? "flex-col space-y-2" : "flex-row space-x-2"
            }`}
        >
          {/* Boutique button */}
          <div
            className={`${isSidebarCollapsed
                ? "w-12 h-12 rounded-full"
                : "w-full h-12 rounded-xl"
              } overflow-hidden flex justify-center items-center`}
          >
            <Button
              variant="ghost"
              className={`${isSidebarCollapsed
                  ? "rounded-full w-12 h-12"
                  : "rounded-xl w-full h-full"
                }  gradient-btn-primary hover:bg-primary/80 flex items-center justify-center p-0`}
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {!isSidebarCollapsed && (
                <span className="ml-2 font-semibold text-white text-sm">
                  Boutique
                </span>
              )}
            </Button>
          </div>
          {/* Toggle collapse button */}
          <div>
            <Button
              variant="ghost"
              className="w-12 h-12 cursor-pointer rounded-full bg-white shadow-md flex items-center justify-center p-0"
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? (
                <PanelLeft className="h-8 w-8" />
              ) : (
                <PanelRight className="h-8 w-8" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Sidebar */}
      <div className={`${sidebarBaseClasses} ${mobileDrawerClasses}`}>
        <ScrollArea
          className={` ${isSidebarCollapsed
              ? "h-[calc(100vh-260px)]"
              : "h-[calc(100vh-200px)]"
            } mt-[50px] [&>[data-slot=scroll-area-scrollbar]>[data-slot=scroll-area-thumb]]:bg-primary/20`}
        >
          {showSkeleton ? (
            <NavigationSkeleton isSidebarCollapsed={isSidebarCollapsed} />
          ) : (
            <div className="space-y-2 p-4">
              {currentNavigationItems.map((item: any, index: any) => (
                <React.Fragment key={index}>
                  <div className="flex justify-center">
                    <div
                      className={`relative ${isSidebarCollapsed ? "w-[50px]" : "w-[220px]"
                        } h-[50px] mx-[15px]`}
                    >
                      <Button
                        ref={(el) => {
                          if (el)
                            buttonRefs.current[item.label + "_mobile"] = el;
                        }}
                        variant="ghost"
                        className={`absolute text-black cursor-pointer text-base font-semibold w-full h-full hover:bg-primary/20 ${isSidebarCollapsed ? "justify-center -ml-[15px]" : ""
                          } ${(item.hasSubmenu &&
                            (expandedMenus.includes(item.label) ||
                              isActiveMenuInSubmenu(item))) ||
                            (!item.hasSubmenu &&
                              activeMenu === item.label &&
                              expandedMenus.length === 0)
                            ? "gradient-btn-primary rounded-[15px] text-white hover:text-white"
                            : "text-black"
                          }`}
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex items-center w-full">
                          <div className="flex-shrink-0 mr-3">
                            {item.icon && <item.icon className="h-8 w-8" />}
                          </div>
                          {!isSidebarCollapsed && (
                            <div className="flex-1 flex justify-between items-center">
                              <span className="ml-1 text-[18px]">
                                {item.label}
                              </span>
                              {item.showChevron && (
                                <ChevronRight
                                  className={`h-6 w-6 ${item.hasSubmenu &&
                                      (expandedMenus.includes(item.label) ||
                                        isActiveMenuInSubmenu(item))
                                      ? "text-white"
                                      : "text-black"
                                    } ${item.hasSubmenu &&
                                      expandedMenus.includes(item.label)
                                      ? "transform rotate-90"
                                      : ""
                                    }`}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </Button>
                    </div>
                  </div>
                  {!isSidebarCollapsed &&
                    item.hasSubmenu &&
                    expandedMenus.includes(item.label) && (
                      <div className="ml-[26px] border-l-2 border-[#2B73F4] pl-4 space-y-3 py-2 mb-2">
                        {item.submenuItems?.map((subItem: any, idx: any) => (
                          <div
                            key={idx}
                            className={`${subItem.isHeader
                                ? "text-gray-500 text-sm font-medium mb-2"
                                : "cursor-pointer hover:text-primary transition-colors"
                              } ${activeMenu === subItem.label
                                ? "text-gradient-primary font-semibold"
                                : ""
                              }`}
                            onClick={() => {
                              if (!subItem.isHeader) {
                                setActiveMenu(subItem.label);
                                setActiveMenuSubtitle(subItem.subtitle);
                                setIsMobileMenuOpen(false); // Close drawer on navigation
                                if (subItem.href) {
                                  navigate({ to: `/$lang/${subItem.href}`, params: { lang: getCurrentLang() } });
                                }
                              }
                            }}
                          >
                            {subItem.label}
                          </div>
                        ))}
                      </div>
                    )}
                </React.Fragment>
              ))}
            </div>
          )}
        </ScrollArea>
        {/* Bottom buttons container - Mobile (conditional layout like desktop) */}
        <div
          className={`flex justify-center items-center p-4 ${isSidebarCollapsed ? "flex-col space-y-2" : "flex-row space-x-2"
            }`}
        >
          {/* Boutique button */}
          <div
            className={`${isSidebarCollapsed
                ? "w-12 h-12 rounded-full"
                : "w-full h-12 rounded-xl"
              } overflow-hidden flex justify-center items-center`}
          >
            <Button
              variant="ghost"
              className={`${isSidebarCollapsed
                  ? "rounded-full w-12 h-12"
                  : "rounded-xl w-full h-full"
                }  bg-primary hover:bg-primary/80 flex items-center justify-center p-0`}
              onClick={() => setIsMobileMenuOpen(false)} // Close drawer on click
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {!isSidebarCollapsed && (
                <span className="ml-2 font-semibold text-white text-sm">
                  Boutique
                </span>
              )}
            </Button>
          </div>
          {/* Toggle collapse button for mobile */}
          <div>
            <Button
              variant="ghost"
              className="w-12 h-12 cursor-pointer rounded-full bg-white shadow-md flex items-center justify-center p-0"
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? (
                <PanelLeft className="h-8 w-8" />
              ) : (
                <PanelRight className="h-8 w-8" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Portal popup for collapsed submenu */}
      {isSidebarCollapsed && expandedMenus.length > 0 && popupPosition && (
        <Portal>
          <div
            ref={popupRef}
            className="fixed min-w-[200px] bg-secondary rounded-lg shadow-2xl py-2"
            style={{
              left: popupPosition.x,
              top: popupPosition.y,
              zIndex: 2147483647, // Maximum z-index value
            }}
          >
            <div className="px-3 py-2 text-sm font-bold text-black border-b border-gray-300">
              {expandedMenus[0]}
            </div>
            {currentNavigationItems
              .find((item: any) => item.label === expandedMenus[0])
              ?.submenuItems?.map((subItem: any, idx: any) => (
                <div
                  key={idx}
                  className={`${subItem.isHeader
                      ? "text-gray-500 text-xs font-medium px-3 py-2 uppercase tracking-wide"
                      : "cursor-pointer hover:bg-gray-50 px-3 py-2 mx-2 rounded-md text-sm transition-colors"
                    } ${activeMenu === subItem.label
                      ? "bg-gradient-to-r from-primary to-hover-primary text-transparent bg-clip-text font-bold"
                      : "text-black"
                    }  `}
                  onClick={() => {
                    if (!subItem.isHeader) {
                      setActiveMenu(subItem.label);
                      setActiveMenuSubtitle(subItem.subtitle);
                      setExpandedMenus([]); // Fermer le popup
                      setPopupPosition(null);
                      setIsSubmenuPopupVisible(false);
                      if (subItem.href) {
                        navigate({ to: `/$lang/${subItem.href}`, params: { lang: getCurrentLang() } });
                      }
                    }
                  }}
                >
                  {subItem.label}
                </div>
              ))}
          </div>
        </Portal>
      )}
    </>
  );
}
