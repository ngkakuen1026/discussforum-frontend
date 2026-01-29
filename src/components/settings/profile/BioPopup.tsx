import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserType } from "../../../types/userTypes";
import { useRef, useState } from "react";
import authAxios from "../../../services/authAxios";
import { usersAPI } from "../../../services/http-api";
import { toast } from "sonner";
import ClickOutside from "../../../hooks/useClickOutside";
import { Pencil, X } from "lucide-react";
import TiptapEditor from "../../TiptapEditor/TiptapEditor";
import SafeHTML from "../../SafeHTML";
import type { Editor } from "@tiptap/react";

interface BioPopupProps {
  currentUser: UserType | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const BioPopup = ({ currentUser, onClose, onSuccess }: BioPopupProps) => {
  const queryClient = useQueryClient();
  const [newBio, setNewBio] = useState(currentUser?.bio || "");

  const editorRef = useRef<Editor>(null);

  const charCount = editorRef.current
    ? editorRef.current.storage.characterCount.characters()
    : 0;

  const maxChar = 400;
  const isOverLimit = charCount > maxChar;

  const updateBioMutation = useMutation({
    mutationFn: () =>
      authAxios.patch(`${usersAPI.url}/profile/me`, {
        bio: newBio.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Bio updated successfully!");
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      let message = "Update failed. Please try again";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } };
        };
        const status = axiosError.response?.status;
        const serverMessage = axiosError.response?.data?.message;
        switch (status) {
          case 500:
            message = "Server error. We're working on it";
            break;
          default:
            message = serverMessage || message;
        }
      }
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverLimit) {
      toast.error(`Bio cannot exceed ${maxChar} characters`);
      return;
    }
    updateBioMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Pencil size={18} />
              <h2 className="text-lg font-bold text-white">Change Bio</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X size={18} className="cursor-pointer" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Current Bio
              </label>
              <div
                className={`bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 ${currentUser?.bio ? "text-gray-300" : "text-gray-500 italic"}`}
              >
                <SafeHTML
                  html={currentUser?.bio || "Not Provided"}
                  className="text-white text-base leading-relaxed mb-4"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="newBio"
                className="block text-sm text-gray-300 mb-1"
              >
                New Bio
              </label>
              <TiptapEditor
                content={newBio}
                onChange={setNewBio}
                placeholder="Tell something about yourself... (supports bold, italic, links, colors)"
                variant="bio"
                maxLength={400}
                editorRef={editorRef}
              />

              <div className="text-right text-xs mt-1.5 text-gray-500">
                {charCount} / 400 characters
              </div>

              {isOverLimit && (
                <p className="text-red-400 text-xs mt-1">
                  Bio is too long (max 400 characters)
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateBioMutation.isPending}
                className="cursor-pointer bg-linear-to-br from-cyan-700 to-cyan-500 hover:from-cyan-600 hover:to-cyan-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {updateBioMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Bio"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default BioPopup;
