import React, { useState } from "react";
import type { UserType } from "../../../types/userTypes";
import ClickOutside from "../../../hooks/useClickOutside";
import { Pencil, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { usersAPI } from "../../../services/http-api";
import { toast } from "sonner";
import { nameSchema } from "../../../schema/userDataSchema";
import z from "zod";

interface FullNamePopupProps {
  currentUser: UserType | null;
  onClose: () => void;
}

const FullNamePopup = ({ currentUser, onClose }: FullNamePopupProps) => {
  const queryClient = useQueryClient();
  const [input, setInput] = useState({
    first_name: currentUser?.first_name || "",
    last_name: currentUser?.last_name || "",
  });
  const [firstNameValidationError, setFirstNameValidationError] = useState<
    string | null
  >(null);
  const [lastNameValidationError, setLastNameValidationError] = useState<
    string | null
  >(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInput((prev) => ({ ...prev, [id]: value }));

    if (id === "first_name") setFirstNameValidationError(null);
    if (id === "last_name") setLastNameValidationError(null);
  };

  const validateField = (field: "first" | "last", value: string) => {
    const trimmed = value.trim();
    const setter =
      field === "first"
        ? setFirstNameValidationError
        : setLastNameValidationError;

    if (!trimmed) {
      setter(null);
      return true;
    }

    try {
      nameSchema.parse(trimmed);
      setter(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setter(err.issues[0]?.message ?? "Invalid name");
        return false;
      }
      setter("Invalid name");
      return false;
    }
  };

  const updateNameMutation = useMutation({
    mutationFn: () =>
      authAxios.patch(`${usersAPI.url}/profile/me`, {
        first_name: input.first_name.trim() || "",
        last_name: input.last_name.trim() || "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Name updated successfully!");
      onClose();
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

    const isFirstNameValid = validateField("first", input.first_name);
    const isLastNameValid = validateField("last", input.last_name);

    if (!isFirstNameValid || !isLastNameValid) {
      toast.error("Please fix the name fields");
      return;
    }

    updateNameMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Pencil size={18} />
              <h2 className="text-lg font-bold text-white">Change Fullname</h2>
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
                Current Fullname
              </label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300">
                {currentUser?.first_name && currentUser.last_name
                  ? currentUser.first_name + currentUser.last_name
                  : "Not Provided"}
              </div>
            </div>

            <div>
              <label
                htmlFor="first_name"
                className="block text-sm text-gray-300 mb-1"
              >
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                value={input.first_name}
                onChange={handleOnChange}
                placeholder={
                  currentUser?.first_name
                    ? "Update First Name"
                    : "Enter First Name"
                }
                className={`w-full border-gray-700 bg-gray-800 border  rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition`}
                autoFocus
              />

              {firstNameValidationError && (
                <p className="text-red-400 text-sm mt-1.5">
                  {firstNameValidationError}
                </p>
              )}

              {/* Character counter */}
              <div className="text-right text-xs mt-1.5 text-gray-500">
                {input.first_name.trim().length} / 50 characters
              </div>
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm text-gray-300 mb-1"
              >
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                value={input.last_name}
                onChange={handleOnChange}
                placeholder={
                  currentUser?.last_name
                    ? "Update Last Name"
                    : "Enter Last Name"
                }
                className={`w-full border-gray-700 bg-gray-800 border  rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition`}
              />

              {lastNameValidationError && (
                <p className="text-red-400 text-sm mt-1.5">
                  {lastNameValidationError}
                </p>
              )}

              {/* Character counter */}
              <div className="text-right text-xs mt-1.5 text-gray-500">
                {input.last_name.trim().length} / 50 characters
              </div>
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
                disabled={updateNameMutation.isPending}
                className="cursor-pointer bg-linear-to-br from-cyan-700 to-cyan-500 hover:from-cyan-600 hover:to-cyan-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {updateNameMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Name"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default FullNamePopup;
