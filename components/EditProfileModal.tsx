"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    bio?: string;
    phone?: string;
    location?: string;
    skills?: string[];
    experience?: string;
    availability?: string;
    profile_image_url?: string;
  } | null;
  profileImage?: string;
  onSave: (updatedUser: any) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  profileImage = "",
  onSave,
}: EditProfileModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
    location: "",
    skills: [] as string[],
  });

  const [newProfileImage, setNewProfileImage] = useState(profileImage);

  useEffect(() => {
    if (initialData) {
      const fullName =
        initialData.name ||
        (initialData.firstName && initialData.lastName
          ? `${initialData.firstName} ${initialData.lastName}`
          : initialData.firstName || initialData.lastName || "");

      setFormData({
        name: fullName,
        email: initialData.email || "",
        bio: initialData.bio || "",
        phone: initialData.phone || "",
        location: initialData.location || "",
        skills: initialData.skills || [],
      });
      setNewProfileImage(
        initialData.profile_image_url || profileImage || "/placeholder.svg"
      );
    }
  }, [initialData, profileImage]);

  const handleSave = async () => {
    setIsLoading(true);
    let uploadedImageUrl = initialData?.profile_image_url;

    try {
      // 1. Upload image if a new one is selected
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);

        const uploadResponse = await fetch("/api/profile/upload-image", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Failed to upload image");
        }
        const uploadResult = await uploadResponse.json();
        uploadedImageUrl = uploadResult.profileImageUrl;
      }

      // 2. Save the rest of the profile data
      const profileUpdatePayload = {
        firstName: formData.name.split(" ")[0] || "",
        lastName: formData.name.split(" ").slice(1).join(" ") || "",
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        skills: formData.skills,
        bio: formData.bio,
        profile_image_url: uploadedImageUrl,
      };

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileUpdatePayload),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      console.log("[v0] Profile updated successfully:", result);

      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      });

      const updatedUser = result.user;
      const transformedUser = {
        ...updatedUser,
        name: `${updatedUser.first_name || ""} ${
          updatedUser.last_name || ""
        }`.trim(),
        phone: updatedUser.phone_number,
      };
      onSave(transformedUser);

      onClose();
    } catch (error) {
      console.error("[v0] Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Your Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={newProfileImage || "/placeholder.svg"}
                  alt={formData.name || "User"}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                  {formData.name
                    ? formData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-pink-600 text-white p-1 rounded-full cursor-pointer hover:bg-pink-700">
                <Camera className="h-3 w-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter>
            <Button
              className="border-pink-800 bg-white text-pink-800 "
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-pink-800 "
              type="button"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
