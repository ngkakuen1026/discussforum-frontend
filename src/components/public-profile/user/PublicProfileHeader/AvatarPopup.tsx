import React, { useRef, useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import ClickOutside from "../../../../hooks/useClickOutside";
import authAxios from "../../../../services/authAxios";
import { usersAPI } from "../../../../services/http-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UserType } from "../../../../types/userTypes";
import { getUserAvatar } from "../../../../utils/userUtils";

interface AvatarPopupProps {
  onClose: () => void;
  publicUser: UserType;
}

const AvatarPopup = ({ onClose, publicUser }: AvatarPopupProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [dragActive, setDragActive] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profile_image", file);
      await authAxios.post(
        `${usersAPI.url}/profile/me/profile-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
    onSuccess: () => {
      toast.success("Avatar updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      queryClient.invalidateQueries({
        queryKey: ["user", publicUser.id.toString()],
      });
      onClose();
    },
    onError: () => {
      toast.error("Failed to upload avatar");
    },
  });

  // Delete mutation — for "Set Default Avatar"
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await authAxios.delete(`${usersAPI.url}/profile/me/profile-image`);
    },
    onSuccess: () => {
      toast.success("Avatar reset to default!");
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      queryClient.invalidateQueries({
        queryKey: ["user", publicUser.id.toString()],
      });
      setPreviewUrl(null);
      setSelectedFile(null);
      onClose();
    },
    onError: () => {
      toast.error("Failed to reset avatar");
    },
  });

  const handleFile = (file: File) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Only JPG, PNG, GIF, and WebP are allowed."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUrlInsert = async () => {
    if (!imageUrlInput.trim()) return;

    try {
      const response = await fetch(imageUrlInput, { mode: "cors" });
      if (!response.ok) throw new Error("Invalid image URL");
      const blob = await response.blob();

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(blob.type)) {
        toast.error(
          "Invalid image type. Only JPG, PNG, GIF, and WebP are supported."
        );
        return;
      }

      const file = new File([blob], "avatar-from-url.jpg", { type: blob.type });
      handleFile(file);
      setImageUrlInput("");
    } catch (error) {
      console.error("Failed to load image from URL" + error);
      toast.error(
        "Failed to load image from URL. Check if it's valid and publicly accessible."
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpdate = () => {
    if (!selectedFile) {
      toast.error("No image selected");
      return;
    }
    uploadMutation.mutate(selectedFile);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-7xl flex flex-col lg:flex-row">
          {/* LEFT SIDE — 60% */}
          <div className="flex-6 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-6">
              <div className="flex items-center gap-3 text-white">
                <Camera size={16} />
                <h2 className="text-lg font-bold">Upload Avatar</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
                disabled={uploadMutation.isPending || deleteMutation.isPending}
              >
                <X size={16} className="cursor-pointer" />
              </button>
            </div>

            {/* Paste URL */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paste Image URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  disabled={uploadMutation.isPending}
                />
                <button
                  onClick={handleUrlInsert}
                  disabled={!imageUrlInput.trim() || uploadMutation.isPending}
                  className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-medium transition disabled:opacity-50"
                >
                  {uploadMutation.isPending ? "Updating..." : "Insert"}
                </button>
              </div>
            </div>

            <div className="text-center text-gray-500 font-medium">OR</div>

            {/* Drag & Drop */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Choose from Device
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
                disabled={uploadMutation.isPending}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                  ${dragActive ? "border-cyan-500 bg-cyan-900/20" : "border-gray-600 hover:border-cyan-500"}
                  ${uploadMutation.isPending ? "opacity-50 pointer-events-none" : ""}
                `}
              >
                {uploadMutation.isPending ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-cyan-400">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="mx-auto text-cyan-400 mb-4" />
                    <p className="text-white text-lg">
                      Drop image here or click to browse
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="text-center text-gray-200 text-sm">
              Images upload service provided by{" "}
              <a
                href="https://cloudinary.com/"
                target="_blank"
                className="hover:underline text-orange-300"
              >
                Cloudinary
              </a>
            </div>

            {/* Bottom Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending || uploadMutation.isPending}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl text-lg"
              >
                {deleteMutation.isPending ? "Setting..." : "Set Default Avatar"}
              </button>
              <button
                onClick={handleUpdate}
                disabled={
                  !selectedFile ||
                  uploadMutation.isPending ||
                  deleteMutation.isPending
                }
                className="cursor-pointer bg-linear-to-br from-gray-500 to-white hover:from-gray-400 hover:to-white text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {uploadMutation.isPending ? "Updating..." : "Update Avatar"}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE — 40%, centered preview */}
          <div className="flex-4 bg-gray-800/30 flex flex-col items-center justify-center p-12">
            <span className="text-lg text-gray-400 mb-4">
              {previewUrl
                ? "Avatar Preview"
                : publicUser.profile_image
                  ? "Current Avatar"
                  : "No Avatar"}
            </span>

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="w-96 h-96 rounded-full object-cover border-8 border-gray-700 shadow-2xl"
              />
            ) : publicUser.profile_image ? (
              <img
                src={getUserAvatar({
                  profile_image: publicUser.profile_image,
                  gender: publicUser.gender,
                })}
                alt={`${publicUser.username}'s current avatar`}
                className="w-96 h-96 rounded-full object-cover border-8 border-gray-700 shadow-2xl"
              />
            ) : (
              <div className="w-96 h-96 rounded-full bg-gray-800 flex items-center justify-center border-8 border-dashed border-gray-700">
                <Camera size={40} className="text-gray-500" />
              </div>
            )}
          </div>
        </div>
      </ClickOutside>
    </div>
  );
};

export default AvatarPopup;
