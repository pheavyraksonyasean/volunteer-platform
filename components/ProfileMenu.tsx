"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { EditProfileModal } from "@/components/application-modal";
import { useRouter } from "next/navigation";

interface ProfileMenuProps {
  profileImage: string;
  setProfileImage: (image: string) => void;
  mockUser: {
    name: string;
    email: string;
  };
}

export default function ProfileMenu({
  profileImage,
  setProfileImage,
  mockUser,
}: ProfileMenuProps) {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const router = useRouter();

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="focus:outline-none"
            aria-label="Open settings menu"
          >
            <Avatar>
              <AvatarImage src={profileImage} />
              <AvatarFallback>CF</AvatarFallback>
            </Avatar>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 flex flex-col gap-1">
          <button
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none"
            onClick={() => setShowEditProfile(true)}
          >
            Edit Profile
          </button>
          <button
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none text-red-600"
            onClick={() => {
              router.push("/");
            }}
          >
            Log Out
          </button>
        </PopoverContent>
      </Popover>

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSubmit={(data) => {
          if (data.image instanceof File) {
            setProfileImage(URL.createObjectURL(data.image));
          } else if (typeof data.image === "string") {
            setProfileImage(data.image);
          }
          // TODO: handle profile update
          console.log("Profile updated:", data);
        }}
        initialData={{ ...mockUser, image: profileImage }}
      />
    </>
  );
}
