import { useUserInfoQuery } from "@/modules/$lang/_panel/hooks";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/shared/components/ui/dropdown-menu";
import { ArrowBigDown, ArrowDownIcon, ArrowDownNarrowWide, ArrowDownSquareIcon, ArrowDownWideNarrow, ChevronDownIcon, Loader2Icon } from "lucide-react";
import { isProfileMenuOpenAtom } from "@/modules/$lang/_panel/stores";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { isAuthenticatedAtom, userAtom } from "@/modules/$lang/_auth/stores";
import useGetAvatarObjectUrl from "../hooks/useGetAvatarObjectUrl";

import ProfileMenu from "./profile-menu";

export default function UserDropdown() {
  const [user, setUser] = useAtom(userAtom);
  const [isAuthenticated, setAuthenticated] = useAtom(isAuthenticatedAtom);
  const { status, data, error, isFetching } = useUserInfoQuery();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useAtom(
    isProfileMenuOpenAtom
  );

  const getInitiales = useMemo(
    () => () =>
      user?.fullName?.replace(/^(\S)\S*\s+(?:\S+\s+)*(\S)\S*$/, "$1$2"),
    [user?.fullName]
  );

  const fullNameFormatted = useMemo(() => {
    return user?.fullName.replace(/(\S+)\s+(\S).*/, "$1 $2.");
  }, [user?.fullName]);
  const [finalImageUrl, setFinalImageUrl] = useState<string | Blob | undefined>(
    undefined
  );
  const [isAvatarLoading, setIsAvatarLoading] = useState<boolean>(false);

  async function fetchUserAvatar() {
    if (!user?.profilePicture) return;
    setIsAvatarLoading(true);
    const avatarUrl = await useGetAvatarObjectUrl(
      user.profilePicture.split("object_id=")[1]
    );
    setFinalImageUrl(avatarUrl!);
    setIsAvatarLoading(false);
  }

  useEffect(() => {
    if (user?.profilePicture) {
      fetchUserAvatar();
    }
  }, [user?.profilePicture]);

  useEffect(() => {
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
    <>
      {isFetching ? (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-300" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[115px] bg-gray-300" />
          </div>
        </div>
      ) : (
        <DropdownMenu
          open={isProfileMenuOpen}
          onOpenChange={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        >
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2.5 text-lg text-[rgba(4,27,66,1)] font-bold cursor-pointer">
              {isAvatarLoading ? (
                <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-gray-300">
                  <Loader2Icon color="blue" className="h-5 w-5 animate-spin" />
                </div>
              ) : (
                <Avatar className="w-[50px] h-[50px]">
                  <AvatarImage src={finalImageUrl} alt="profile-image" />
                  <AvatarFallback className="text-lg font-normal bg-[#c3d6f9] text-black">
                    {getInitiales()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="hidden md:block self-stretch my-auto text-[#041B42]">
                {fullNameFormatted}
              </div>
              
              <ChevronDownIcon   className="hidden text-[#041B42] md:block aspect-[1.08] object-contain self-stretch shrink-0 my-auto rounded-sm" />   
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="w-auto h-auto !bg-transparent !border-none !shadow-none"
          >
            <ProfileMenu />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
