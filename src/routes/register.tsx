import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Upload, X, ChevronDown, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "lodash";
import authAxios from "../services/authAxios";
import { toast } from "sonner";
import type { UserRegistrationType } from "../types/userTypes";
import { authAPI } from "../services/http-api";
import { registerSchema } from "../schema/authSchema";
import type z from "zod";
import { usePasswordStrength } from "../hooks/usePasswordStrength";

type FormData = z.infer<typeof registerSchema>;

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserRegistrationType>({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const updateFormData = (updates: Partial<UserRegistrationType>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNextStep = () => {
    const result = registerSchema.safeParse({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path[0] as keyof FormData;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      toast.error(`Please fix the errors before continue`);
      return;
    }

    setErrors({});
    setCurrentStep((step) => Math.min(step + 1, 4));
  };
  const handleBackStep = () => setCurrentStep((step) => Math.max(step - 1, 1));
  const { score, label, color } = usePasswordStrength(formData.password);

  const canProceed =
    Object.keys(errors).length === 0 &&
    usernameStatus === "available" &&
    emailStatus === "available";

  const clearError = (field: keyof FormData) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profile_image", file);
      const res = await authAxios.post(
        `${authAPI.url}/register/upload-temp`,
        formData
      );
      return res.data;
    },
    onSuccess: (data) => {
      updateFormData({
        temp_image_id: data.tempId,
        preview_image_url: data.url,
      });
      setImagePreview(data.url);
      toast.success("Image uploaded!");
    },
    onError: () => {
      toast.error("Upload failed");
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  const cleanupMutation = useMutation({
    mutationFn: (tempId: string) =>
      authAxios.post(`${authAPI.url}/register/cleanup-temp`, { tempId }),
    onError: () => toast.error("Failed to cleanup image"),
  });

  const registerMutation = useMutation({
    mutationFn: (data: UserRegistrationType) =>
      authAxios.post(`${authAPI.url}/register`, data),
    onSuccess: () => {
      toast.success("Account created successfully!");
      navigate({ to: "/login" });
    },
    onError: (error: unknown) => {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message || "Registration failed"
        );
      } else {
        toast.error("Registration failed");
      }
    },
  });

  // DB username and email check
  // Username check mutation
  const checkUsernameMutation = useMutation({
    mutationFn: (username: string) =>
      authAxios.post(`${authAPI.url}/register/check-username`, { username }),
    onError: () => {},
  });

  // Email check mutation
  const checkEmailMutation = useMutation({
    mutationFn: (email: string) =>
      authAxios.post(`${authAPI.url}/register/check-email`, { email }),
    onError: () => {},
  });

  const checkUsernameMutationRef = useRef(checkUsernameMutation);
  const checkEmailMutationRef = useRef(checkEmailMutation);

  const debouncedCheckUsername = useCallback(
    debounce((username: string) => {
      if (username.length < 1) {
        setUsernameStatus("idle");
        return;
      }
      setUsernameStatus("checking");
      checkUsernameMutationRef.current.mutate(username, {
        onSuccess: () => setUsernameStatus("available"),
        onError: () => setUsernameStatus("taken"),
      });
    }, 300),
    []
  );

  const debouncedCheckEmail = useCallback(
    debounce((email: string) => {
      if (!email.includes("@") || !email.includes(".")) {
        setEmailStatus("idle");
        return;
      }
      setEmailStatus("checking");
      checkEmailMutationRef.current.mutate(email, {
        onSuccess: () => setEmailStatus("available"),
        onError: () => setEmailStatus("taken"),
      });
    }, 300),
    []
  );

  useEffect(() => {
    debouncedCheckUsername(formData.username);
    return () => debouncedCheckUsername.cancel();
  }, [formData.username, debouncedCheckUsername]);

  useEffect(() => {
    debouncedCheckEmail(formData.email);
    return () => debouncedCheckEmail.cancel();
  }, [formData.email, debouncedCheckEmail]);

  const getValidationMessage = () => {
    const errors = [];
    if (usernameStatus === "taken" && emailStatus === "taken") {
      errors.push("Username and Email are taken");
    } else {
      if (usernameStatus === "taken") errors.push("Username is taken");
      if (emailStatus === "taken") errors.push("Email is taken");
    }

    if (errors.length > 0) {
      return {
        text: errors.join(" and "),
        color: "text-red-400",
        icon: <X size={18} />,
      };
    }
    if (usernameStatus === "available" && emailStatus === "available") {
      return {
        text: "Username and Email are not taken",
        color: "text-green-400",
        icon: <Check size={18} />,
      };
    }
    return null;
  };

  const validation = getValidationMessage();

  const handleRegister = () => {
    registerMutation.mutate(formData);
  };

  const handleCancel = async () => {
    if (formData.temp_image_id) {
      await cleanupMutation.mutateAsync(formData.temp_image_id);
    }
    toast.info("Registration cancelled");
    setFormData({ username: "", email: "", password: "" });
    setImagePreview(null);
    setCurrentStep(1);
  };

  const removeImage = () => {
    if (formData.temp_image_id) {
      cleanupMutation.mutate(formData.temp_image_id);
    }
    setImagePreview(null);
    updateFormData({ temp_image_id: undefined, preview_image_url: undefined });
  };

  const isLoading =
    uploadMutation.isPending ||
    registerMutation.isPending ||
    cleanupMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0E17]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full max-w-7xl mx-4"
      >
        <div className="bg-[#12181e]/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Right: Form */}
            <div className="p-8 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
              <div className="max-w-xl mx-auto w-full">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-10"
                >
                  <h2 className="text-5xl font-bold text-white mb-4">
                    Create Your Account
                  </h2>
                  <p className="text-xl text-gray-400">
                    Join the discussion today
                  </p>
                </motion.div>

                {/* Stepper */}
                <div className="mb-12">
                  <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    {[1, 2, 3, 4].map((step) => (
                      <li
                        key={step}
                        className={`flex md:w-full items-center ${
                          currentStep >= step ? "text-cyan-500" : ""
                        } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-600 after:border after:hidden sm:after:inline-block after:mx-6`}
                      >
                        <span className="flex items-center">
                          {currentStep > step ? (
                            <svg
                              className="w-5 h-5 me-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                          ) : (
                            <span className="me-2 text-lg">{step}</span>
                          )}
                          <span className="hidden sm:inline">
                            {step === 1 && "Account"}
                            {step === 2 && "Personal"}
                            {step === 3 && "Preview"}
                            {step === 4 && "Confirm"}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Step Content */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {/* STEP 1 */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold text-white">
                          Account Details
                        </h3>
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
                        <label className="block text-white mb-3">
                          Username
                        </label>
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
                        <label className="block text-white mb-3">
                          Email Address
                        </label>
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
                        <label className="block text-white mb-3">
                          Password
                        </label>
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
                            {showPassword ? (
                              <EyeOff size={24} />
                            ) : (
                              <Eye size={24} />
                            )}
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
                                  i <= score
                                    ? color.split(" ")[0]
                                    : "bg-white/10"
                                }`}
                              />
                            ))}
                          </div>
                          <p
                            className={`text-sm font-medium ${
                              score > 0 ? color.split(" ")[1] : "text-gray-400"
                            }`}
                          >
                            {score > 0 ? label : ""}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button
                          type="button"
                          onClick={() => navigate({ to: "/login" })}
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
                  )}

                  {/* STEP 2 */}
                  {currentStep === 2 && (
                    <>
                      <h3 className="text-2xl font-semibold text-white">
                        Personal Info (Optional)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-3">
                            First Name
                          </label>
                          <input
                            placeholder="First Name"
                            value={formData.first_name || ""}
                            onChange={(e) =>
                              updateFormData({ first_name: e.target.value })
                            }
                            className="px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-3">
                            Last name
                          </label>
                          <input
                            placeholder="Last Name"
                            value={formData.last_name || ""}
                            onChange={(e) =>
                              updateFormData({ last_name: e.target.value })
                            }
                            className="px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-3">
                            Phone Number
                          </label>
                          <input
                            placeholder="Phone"
                            value={formData.phone || ""}
                            onChange={(e) =>
                              updateFormData({ phone: e.target.value })
                            }
                            className="px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-[0.65rem]">
                              Gender
                            </label>
                            <button
                              type="button"
                              onClick={() => setIsGenderOpen(!isGenderOpen)}
                              className="w-full px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all backdrop-blur-xl hover:bg-white/15"
                            >
                              <span
                                className={
                                  formData.gender
                                    ? "text-white"
                                    : "text-gray-500"
                                }
                              >
                                {formData.gender || "Gender"}
                              </span>
                              <ChevronDown
                                size={20}
                                className={`transition-transform duration-300 text-gray-400 ${isGenderOpen ? "rotate-180" : ""}`}
                              />
                            </button>

                            {/* Custom Dropdown */}
                            {isGenderOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setIsGenderOpen(false)}
                                />
                                <motion.div
                                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  transition={{
                                    duration: 0.2,
                                    ease: "easeOut",
                                  }}
                                  className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                                >
                                  {(
                                    [
                                      "Male",
                                      "Female",
                                      "Prefer Not to Say",
                                    ] as const
                                  ).map((option) => (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() => {
                                        updateFormData({ gender: option });
                                        setIsGenderOpen(false);
                                      }}
                                      className="w-full px-6 py-4 text-left text-white hover:bg-linear-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all flex items-center justify-between group first:rounded-t-2xl last:rounded-b-2xl"
                                    >
                                      <span className="group-hover:translate-x-1 transition-transform">
                                        {option}
                                      </span>
                                      {formData.gender === option && (
                                        <Check
                                          size={20}
                                          className="text-cyan-400"
                                        />
                                      )}
                                    </button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Bio
                        </label>
                        <textarea
                          placeholder="Tell everyone about yourself..."
                          value={formData.bio || ""}
                          onChange={(e) =>
                            updateFormData({ bio: e.target.value })
                          }
                          rows={4}
                          className="w-full px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-xl resize-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-lg font-medium text-gray-300">
                          Profile Picture
                        </label>
                        <div className="flex items-center gap-6">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/jpeg, image/png"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={uploadMutation.isPending}
                            />
                            <div className="flex items-center gap-3 px-6 py-4 bg-white/10 border-2 border-dashed border-white/30 rounded-2xl hover:border-cyan-500 transition-all">
                              <Upload size={24} className="text-cyan-400" />
                              <span className="text-white">
                                {uploadMutation.isPending
                                  ? "Uploading..."
                                  : "Choose Image"}
                              </span>
                            </div>
                          </label>
                          {imagePreview && (
                            <div className="relative">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-24 h-24 rounded-full object-cover ring-4 ring-cyan-500/50"
                              />
                              <button
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 cursor-pointer hover:opacity-75 transition"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <button
                          onClick={handleBackStep}
                          className="py-4 px-8 bg-gray-700 text-white rounded-2xl hover:bg-gray-600 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleNextStep}
                          className="py-4 px-8 bg-linear-to-br from-gray-500 to-white hover:from-gray-400 hover:to-white text-white rounded-2xl cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </>
                  )}

                  {/* STEP 3 */}
                  {currentStep === 3 && (
                    <>
                      <h3 className="text-2xl font-semibold text-white">
                        Preview Your Profile
                      </h3>
                      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 space-y-6 border border-white/10">
                        <div className="flex items-center gap-6">
                          <img
                            src={
                              imagePreview
                                ? imagePreview
                                : "src/assets/Images/default_user_icon.png"
                            }
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover ring-4 ring-cyan-500/50"
                          />
                          <div>
                            <h4 className="text-2xl font-bold text-white">
                              {formData.username}
                            </h4>
                            <p className="text-gray-400">{formData.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-lg">
                          <div>
                            <span className="text-gray-400">Name:</span>{" "}
                            <span className="text-white">
                              {formData.first_name || formData.last_name
                                ? `${formData.first_name || ""} ${formData.last_name || ""}`
                                : "Not set"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Phone:</span>{" "}
                            <span className="text-white">
                              {formData.phone || "Not set"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Gender:</span>{" "}
                            <span className="text-white">
                              {formData.gender === "Prefer Not to Say"
                                ? "Not Disclosed"
                                : formData.gender || "Gender"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Bio:</span>{" "}
                            <span className="text-white">
                              {formData.bio || "No bio"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <button
                          onClick={handleBackStep}
                          className="py-4 px-8 bg-gray-700 text-white rounded-2xl hover:bg-gray-600 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleNextStep}
                          className="py-4 px-8 bg-linear-to-br from-gray-500 to-white hover:from-gray-400 hover:to-white text-white rounded-2xl cursor-pointer"
                        >
                          Continue
                        </button>
                      </div>
                    </>
                  )}

                  {/* STEP 4 */}
                  {currentStep === 4 && (
                    <div className="text-center space-y-8">
                      <h3 className="text-3xl font-bold text-white">
                        Ready to Join?
                      </h3>
                      <p className="text-xl text-gray-400">
                        One click and you're in the discussion
                      </p>
                      <div className="flex justify-center gap-6">
                        <button
                          onClick={handleRegister}
                          disabled={isLoading}
                          className="py-4 px-12 bg-linear-to-br from-gray-500 to-white hover:from-gray-400 hover:to-white text-white font-bold rounded-2xl transform hover:scale-110 transition-all disabled:opacity-50 text-lg shadow-2xl cursor-pointer"
                        >
                          {registerMutation.isPending
                            ? "Creating Account..."
                            : "Create Account"}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isLoading}
                          className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-3 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl text-lg"
                        >
                          Cancel
                        </button>
                      </div>
                      <button
                        onClick={handleBackStep}
                        className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                      >
                        ← Go back
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Left: Hero */}
            <div className="hidden lg:flex items-center justify-center p-12 bg-linear-to-br from-purple-900/30 to-blue-900/30 order-1 lg:order-2">
              <motion.div
                initial={{ scale: 0.9, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <img
                  src="../src/assets/Images/registerhero.png"
                  alt="Join the discussion"
                  className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#12181e] via-transparent to-transparent rounded-3xl" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
