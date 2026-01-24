import { useRouter } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { usePasswordStrength } from "../../../hooks/usePasswordStrength";
import { useMutation } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { usersAPI } from "../../../services/http-api";
import { toast } from "sonner";
import { passwordSchema } from "../../../schema/authSchema";

const PasswordUpdate = () => {
  const router = useRouter();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [input, setInput] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const passwordStrength = usePasswordStrength(input.newPassword);

  const updatePasswordMutation = useMutation({
    mutationFn: () =>
      authAxios.patch(`${usersAPI.url}/profile/password`, {
        oldPassword: input.oldPassword,
        newPassword: input.newPassword,
        confirmPassword: input.confirmPassword,
      }),

    onSuccess: () => {
      toast.success("Password updated successfully!");
      router.navigate({ to: "/settings/account" });
    },
    onError: (error: unknown) => {
      let message = "Failed to update password. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        // @ts-expect-error - axios error type
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Confirm match
    if (input.newPassword !== input.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // New password schema validation
    const pwResult = passwordSchema.safeParse(input.newPassword);
    if (!pwResult.success) {
      newErrors.newPassword = pwResult.error.issues[0]?.message;
    }

    // Old password required
    if (!input.oldPassword.trim()) {
      newErrors.oldPassword = "Current password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors above");
      return;
    }

    updatePasswordMutation.mutate();
  };

  const isFormValid =
    input.oldPassword.trim() &&
    input.newPassword &&
    input.confirmPassword &&
    input.newPassword === input.confirmPassword &&
    passwordSchema.safeParse(input.newPassword).success;

  return (
    <div className="max-w-2xl">
      <h1 className="text-white text-2xl font-semibold">Update Password</h1>
      <p className="text-gray-400 mt-1">
        Enter your current password to set a new one. The change takes effect
        immediately.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* ─── Current Password ─── */}
        <div>
          <label className="block font-medium text-gray-300 mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              placeholder="••••••••"
              value={input.oldPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg backdrop-blur-xl pr-14"
              required
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showOldPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="mt-1.5 text-red-400 text-sm">{errors.oldPassword}</p>
          )}
        </div>

        {/* ─── New Password ─── */}
        <div>
          <label className="block font-medium text-gray-300 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="••••••••"
              value={input.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg backdrop-blur-xl pr-14"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showNewPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>

          {input.newPassword && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      i <= passwordStrength.score
                        ? passwordStrength.color.split(" ")[0]
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`font-medium text-sm ${
                  passwordStrength.score > 0
                    ? passwordStrength.color.split(" ")[1]
                    : "text-gray-400"
                }`}
              >
                {passwordStrength.label || "Enter password"}
              </p>
            </div>
          )}

          {errors.newPassword && (
            <p className="mt-1.5 text-red-400 text-sm">{errors.newPassword}</p>
          )}
        </div>

        {/* ─── Confirm Password ─── */}
        <div>
          <label className="block font-medium text-gray-300 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={input.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg backdrop-blur-xl pr-14"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-red-400 text-sm">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => router.history.back()}
            className="cursor-pointer w-fit border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl text-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updatePasswordMutation.isPending || !isFormValid}
            className="cursor-pointer w-fit bg-linear-to-br from-gray-500 to-white hover:from-gray-400 hover:to-white text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
          >
            {updatePasswordMutation.isPending
              ? "Updating..."
              : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordUpdate;
