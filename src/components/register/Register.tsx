import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "lodash";
import { toast } from "sonner";
// import type z from "zod";
import React from "react";
import { registerSchema } from "../../schema/authSchema";
import type { UserRegistrationType } from "../../types/userTypes";
import authAxios from "../../services/authAxios";
import { authAPI } from "../../services/http-api";
import { usePasswordStrength } from "../../hooks/usePasswordStrength";
import RegisterStepper from "./RegisterStepper";
import RegisterStep1Account from "./RegisterStep1Account";
import RegisterStep2Personal from "./RegisterStep2Personal";
import RegisterStep3Preview from "./RegisterStep3Preview";
import RegisterStep4Confirm from "./RegisterStep4Confirm";
import RegisterHero from "./RegisterHero";
import { Check, X } from "lucide-react";

const Register = () => {
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

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserRegistrationType, string>>
  >({});

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
      const fieldErrors: Partial<Record<keyof UserRegistrationType, string>> =
        {};
      result.error.issues.forEach((err: any) => {
        const path = err.path[0] as keyof UserRegistrationType;
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

  const clearError = (field: keyof UserRegistrationType) => {
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
                <RegisterStepper currentStep={currentStep} />

                {/* Step Content */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {currentStep === 1 && (
                    <RegisterStep1Account
                      formData={formData}
                      errors={errors}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      updateFormData={updateFormData}
                      clearError={clearError}
                      validation={validation}
                      handleNextStep={handleNextStep}
                      canProceed={canProceed}
                      navigateToLogin={() => navigate({ to: "/login" })}
                      passwordStrength={{ score, label, color }}
                    />
                  )}
                  {currentStep === 2 && (
                    <RegisterStep2Personal
                      formData={formData}
                      updateFormData={updateFormData}
                      imagePreview={imagePreview}
                      handleImageUpload={handleImageUpload}
                      removeImage={removeImage}
                      isGenderOpen={isGenderOpen}
                      setIsGenderOpen={setIsGenderOpen}
                      handleNextStep={handleNextStep}
                      handleBackStep={handleBackStep}
                      uploadPending={uploadMutation.isPending}
                    />
                  )}
                  {currentStep === 3 && (
                    <RegisterStep3Preview
                      formData={formData}
                      imagePreview={imagePreview}
                      handleBackStep={handleBackStep}
                      handleNextStep={handleNextStep}
                    />
                  )}
                  {currentStep === 4 && (
                    <RegisterStep4Confirm
                      isLoading={isLoading}
                      handleRegister={handleRegister}
                      handleCancel={handleCancel}
                      handleBackStep={handleBackStep}
                      isPending={registerMutation.isPending}
                    />
                  )}
                </motion.div>
              </div>
            </div>

            {/* Left: Hero */}
            <RegisterHero />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
