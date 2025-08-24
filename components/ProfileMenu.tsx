"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, LogOut, ChevronDown } from "lucide-react";
import EditProfileModal from "./EditProfileModal";

interface ProfileMenuProps {
  profileImage: string;
  setProfileImage: (image: string) => void;
  mockUser: {
    name: string;
    email: string;
    bio?: string;
    phone?: string;
    location?: string;
    skills?: string[];
    experience?: string;
    availability?: string;
  };
  setMockUser: (user: any) => void;
}

export default function ProfileMenu({
  profileImage,
  setProfileImage,
  mockUser,
  setMockUser,
}: ProfileMenuProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleLogout = () => {
    console.log("Logging out user...");

    // Clear any stored user data/tokens (you can add localStorage.clear() or sessionStorage.clear() if needed)
    // localStorage.removeItem('userToken')
    // sessionStorage.clear()

    // Navigate to the home page
    router.push("/");
  };

  const handleSaveProfile = (updatedUser: any) => {
    console.log("Profile updated:", updatedUser);
    // Update the user data in the parent component
    setMockUser(updatedUser);
    if (updatedUser.profile_image_url) {
      setProfileImage(updatedUser.profile_image_url);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-3 px-3 py-2 h-auto rounded-lg hover:bg-pink-900 transition-colors"
          >
            <Avatar className="h-10 w-10 ring-2 ring-blue-100">
              <AvatarImage
                src={profileImage || "/placeholder.svg"}
                alt={mockUser.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {mockUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left">
              <p className="text-sm font-semibold text-white leading-tight">
                {mockUser.name}
              </p>
              <p className="text-xs text-white leading-tight">
                {mockUser.email}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {mockUser.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {mockUser.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEditProfile}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={mockUser}
        profileImage={profileImage}
        onSave={handleSaveProfile}
      />
    </>
  );
}
