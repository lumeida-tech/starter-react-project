import React from "react";
import { useAtom } from "jotai";
import {
  isSidebarCollapsedAtom,
  isProfileMenuOpenAtom,
  isSubmenuPopupVisibleAtom,
} from "../stores/panel-atoms";
import { CommandMenu } from "./command-menu";
import SlideBar from "./side-bar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";
import { useBreadcrumbs } from "../hooks/useBreadcrumbs";

/*
|--------------------------------------------------------------------------
| Dynamic Imports Section
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Types Section
|--------------------------------------------------------------------------
*/

interface LayoutWrapperProps {
  children: React.ReactNode;
}



/*
|--------------------------------------------------------------------------
| LayoutWrapper Component
|--------------------------------------------------------------------------
*/

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  /*
  |--------------------------------------------------------------------------
  | Data Section
  |--------------------------------------------------------------------------
  | All other local variables and constants.
  */

  const [isSidebarCollapsed] = useAtom(isSidebarCollapsedAtom);
  const [isProfileMenuOpen] = useAtom(isProfileMenuOpenAtom);
  const [isSubmenuPopupVisible] = useAtom(isSubmenuPopupVisibleAtom);
  
  const { breadcrumbItems } = useBreadcrumbs();

  /*
  |--------------------------------------------------------------------------
  | Hooks Section
  |--------------------------------------------------------------------------
  */

  /*
  |--------------------------------------------------------------------------
  | Methods Section
  |--------------------------------------------------------------------------
  */


  const renderBreadcrumb = () => {

    return (
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <BreadcrumbItem>
                {item.isCurrent ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>
                    {index === 0 ? <Home /> : item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Render Section
  |--------------------------------------------------------------------------
  */
  const mainContentClasses = `
    flex-1 
    transition-all 
    bg-[#F9F9F9]
    duration-300
    ${isProfileMenuOpen || isSubmenuPopupVisible ? "blur-md" : ""}
    ${isSidebarCollapsed ? "lg:ml-[80px] lg:pl-5" : "lg:ml-[200px] lg:pl-20"}
    ml-0 
    pl-4 
    pr-4 
    lg:pr-0
    pt-2 
    mt-14 
    md:mt-0
  `;

  return (
    <div className="flex flex-1 relative">
      <SlideBar />
      <div className={mainContentClasses}>
        <div className="min-h-screen bg-[#F9F9F9] p-3 lg:p-6">
          <div className="relative">
            <div className="space-y-4 lg:space-y-6 w-full mx-auto max-w-7xl">
              {/* Hide breadcrumb on very small screens */}
              <div>{renderBreadcrumb()}</div>
              <div className="pt-3 lg:pt-6">
                <CommandMenu />
                <div className="flex flex-col">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
