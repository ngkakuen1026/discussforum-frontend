import React from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UserRegistrationType } from "../../types/userTypes";

type FormData = UserRegistrationType;

interface RegisterStep1AccountProps {
  formData: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  updateFormData: (updates: Partial<UserRegistrationType>) => void;
  clearError: (field: keyof FormData) => void;
  validation: { text: string; color: string; icon: React.ReactNode } | null;
  handleNextStep: () => void;
  canProceed: boolean;
  navigateToLogin: () => void;
  passwordStrength: { score: number; label: string; color: string };
}

const RegisterStep1Account = ({
  formData,
  errors,
  showPassword,
  setShowPassword,
  updateFormData,
  clearError,
  validation,
  handleNextStep,
  canProceed,
  navigateToLogin,
  passwordStrength,
}: RegisterStep1AccountProps) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-semibold text-white">Account Details</h3>
      {validation && (
        <span
          className={`text-sm font-semibold ${validation.color} flex items-center gap-2 text-right`}
        >
          {validation.text} {validation.icon}
        </span>
      )}
    </div>
    {/* Username */}
    <div>
      <label className="block text-white mb-3">Username</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => {
            updateFormData({ username: e.target.value });
            clearError("username");
          }}
          className="peer w-full px-6 py-5 pr-12 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg backdrop-blur-xl"
        />
      </div>
      <div className="text-red-400 text-sm mt-2 italic">
        {errors.username && <p>{errors.username}</p>}
      </div>
    </div>
    {/* Email */}
    <div>
      <label className="block text-white mb-3">Email Address</label>
      <div className="relative">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => {
            updateFormData({ email: e.target.value });
            clearError("email");
          }}
          className="peer w-full px-6 py-5 pr-12 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg backdrop-blur-xl"
        />
      </div>
      <div className="text-red-400 text-sm mt-2">
        {errors.email && <p>{errors.email}</p>}
      </div>
    </div>
    {/* Password */}
    <div>
      <label className="block text-white mb-3">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={showPassword ? "••••••••" : "Password"}
          value={formData.password}
          onChange={(e) => {
            updateFormData({ password: e.target.value });
            clearError("password");
          }}
          className="peer w-full px-6 py-5 pr-14 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg backdrop-blur-xl"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
        </button>
      </div>
      <div className="text-red-400 text-sm mt-2 italic">
        {errors.password && <p>{errors.password}</p>}
      </div>
    </div>
    {/* Password Strength */}
    {formData.password && (
      <div className="space-y-2">
        <div className="flex gap-1">
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
          className={`text-sm font-medium ${
            passwordStrength.score > 0
              ? passwordStrength.color.split(" ")[1]
              : "text-gray-400"
          }`}
        >
          {passwordStrength.score > 0 ? passwordStrength.label : ""}
        </p>
      </div>
    )}
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      <button
        type="button"
        onClick={navigateToLogin}
        className="w-full border-2 border-white/30 hover:border-white/50 text-white font-bold py-3 px-6 rounded-2xl hover:bg-white/10 text-lg transition-all cursor-pointer"
      >
        Back to Login
      </button>
      <button
        onClick={handleNextStep}
        disabled={!canProceed}
        className={`w-full py-5 bg-linear-to-br from-gray-500 to-white text-white font-bold rounded-2xl transition-all cursor-pointer ${
          canProceed
            ? "hover:from-gray-400 hover:to-white hover:scale-105"
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  </div>
);

export default RegisterStep1Account;
