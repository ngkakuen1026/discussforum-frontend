import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import authAxios from "../../services/authAxios";
import { authAPI } from "../../services/http-api";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
  };
}

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation<LoginResponse, Error, LoginData>({
    mutationFn: async (loginData) => {
      const response = await authAxios.post(`${authAPI.url}/login`, loginData);
      return response.data;
    },
    onSuccess: async (data) => {
      console.log("Login successful:", data);
      await checkAuth();
      navigate({ to: "/", search: { categoryId: 0 }, replace: true });
    },
    onError: (error: unknown) => {
      let message = "Login failed. Please try again";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } };
        };

        const status = axiosError.response?.status;
        const serverMessage = axiosError.response?.data?.message;

        switch (status) {
          case 404:
            message = "No account found with this email";
            break;
          case 401:
            message = "Incorrect password";
            break;
          case 429:
            message = "Too many attempts. Please try again later";
            break;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(input);
  };

  return (
    <div className="min-h-screen  flex items-center justify-center relative overflow-hidden bg-[#0A0E17]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-7xl mx-4"
      >
        <div className="bg-[#12181e]/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="hidden lg:flex items-center justify-center p-12 bg-linear-to-br from-purple-900/30 to-blue-900/30">
              <motion.div
                initial={{ scale: 0.9, rotate: -5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <img
                  src="../src/assets/Images/loginhero.png"
                  alt="Discussion"
                  className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#12181e] via-transparent to-transparent rounded-3xl" />
              </motion.div>
            </div>

            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full space-y-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-5xl font-bold text-white mb-4">
                    Welcome Back
                  </h2>
                  <p className="text-xl text-gray-400">
                    Log in to continue your discussions.
                  </p>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="youremail@example.com"
                      value={input.email}
                      onChange={handleChange}
                      className="w-full px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg backdrop-blur-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={input.password}
                        onChange={handleChange}
                        className="w-full px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg backdrop-blur-xl pr-14"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                      >
                        {showPassword ? (
                          <EyeOff size={24} />
                        ) : (
                          <Eye size={24} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 rounded border-white/30 bg-white/10 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-gray-300">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-cyan-400 hover:text-cyan-300 transition font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-3">
                    <button
                      type="submit"
                      disabled={loginMutation.isPending}
                      className="cursor-pointer w-full bg-linear-to-br from-gray-500 to-white hover:from-gray-400 hover:to-white text-white font-bold py-3 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                    >
                      {loginMutation.isPending ? "Logging in..." : "Login"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate({ to: "/register" })}
                      className="cursor-pointer w-full border-2 border-white/30 hover:border-white/50 text-white font-bold py-3 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl text-lg"
                    >
                      Create Account
                    </button>
                  </div>
                </motion.form>

                <p className="text-center text-gray-500 text-sm mt-10 ">
                  By logging in, you agree to our{" "}
                  <Link to="/terms" className="text-cyan-400 hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-cyan-400 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
                <hr className="border-t border-gray-400" />
                <p className="text-center text-gray-500 text-sm mt-10 ">
                  Or{" "}
                  <Link
                    to="/"
                    search={{ categoryId: 0 }}
                    replace={true}
                    className="text-white hover:underline"
                  >
                    continue
                  </Link>{" "}
                  as visitor
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
