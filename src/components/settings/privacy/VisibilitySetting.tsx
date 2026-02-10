import { Switch } from "@headlessui/react";
import { Check, ChevronRight, CircleQuestionMark } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { usersAPI } from "../../../services/http-api";
import { toast } from "sonner";
import VisibilityModePopup from "./VisibilityModePopup";
import type {
  UserVisibilityModeType,
  VisibilityModeType,
} from "../../../types/userTypes";
import DefaultVisibilityPopup from "./DefaultVisibilityPopup";

const VisibilitySetting = () => {
  const queryClient = useQueryClient();
  const [showVisibilityModePopup, setShowVisibilityModePopup] = useState(false);
  const [showDefaultVisibilityPopup, setShowDefaultVisibilityPopup] =
    useState(false);

  const { data: visibility, isLoading } = useQuery<UserVisibilityModeType>({
    queryKey: ["auth-user-visibility"],
    queryFn: async () => {
      const res = await authAxios.get(`${usersAPI.url}/profile/visibility`);
      return res.data;
    },
  });

  const updateVisibilityMutation = useMutation({
    mutationFn: (data: Partial<UserVisibilityModeType>) =>
      authAxios.patch(`${usersAPI.url}/profile/visibility`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user-visibility"] });
    },
    onError: () => {
      toast.error("Failed to update visibility");
    },
  });

  // Toggle helper
  const toggleSetting = (key: keyof UserVisibilityModeType) => {
    if (!visibility) return;
    const newValue = !visibility[key];
    updateVisibilityMutation.mutate({ [key]: newValue });
  };

  if (isLoading || !visibility) {
    return (
      <div className="text-gray-400 animate-pulse py-8">
        Loading visibility settings...
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h1 className="text-white text-2xl pb-4 font-semibold">Visibility</h1>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/visibility-mode"
        onClick={() => setShowVisibilityModePopup(true)}
      >
        <div className="flex gap-1 items-start">
          <p>Who can see your personal data</p>
          <button className="relative group cursor-pointer">
            <CircleQuestionMark
              size={14}
              className="hover:text-white transition"
            />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
              Visibility mode only controls who can see your profile. To show or
              hide specific information, toggle the options below.
            </span>
          </button>
        </div>

        <div className="flex items-center justify-around ">
          <p className="mr-2">
            {visibility.visibility_mode === "public" && "Everyone"}
            {visibility.visibility_mode === "private" && "Private"}
          </p>

          <button className="group-hover/visibility-mode:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Show Full Name */}
      <div
        className="flex items-center justify-between text-lg cursor-pointer py-5 transition "
        onClick={() => toggleSetting("show_full_name")}
      >
        <div className="flex flex-col items-start">
          <p>Full Name</p>
          <p className="text-sm text-gray-400 transition duration-200">
            Show your full name in profile
          </p>
        </div>

        <div className="flex items-center">
          <Switch
            checked={visibility.show_full_name}
            onChange={() => toggleSetting("show_full_name")}
            className={`${
              visibility.show_full_name ? "bg-cyan-600" : "bg-gray-600"
            } cursor-pointer relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <span
              className={`${
                visibility.show_full_name
                  ? "translate-x-9 scale-110"
                  : "translate-x-1 scale-100"
              } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
            >
              {visibility.show_full_name && (
                <Check
                  size={16}
                  className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                />
              )}
            </span>
          </Switch>
        </div>
      </div>

      {/* Show Email */}
      <div
        className="flex items-center justify-between text-lg cursor-pointer py-5 transition "
        onClick={() => toggleSetting("show_email")}
      >
        <div className="flex flex-col items-start">
          <p>Email</p>
          <p className="text-sm text-gray-400 transition duration-200">
            Show your email in profile
          </p>
        </div>

        <div className="flex items-center">
          <Switch
            checked={visibility.show_email}
            onChange={() => toggleSetting("show_email")}
            className={`${
              visibility.show_email ? "bg-cyan-600" : "bg-gray-600"
            } cursor-pointer relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <span
              className={`${
                visibility.show_email
                  ? "translate-x-9 scale-110"
                  : "translate-x-1 scale-100"
              } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
            >
              {visibility.show_email && (
                <Check
                  size={16}
                  className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                />
              )}
            </span>
          </Switch>
        </div>
      </div>

      {/* Show Phone */}
      <div
        className="flex items-center justify-between text-lg cursor-pointer py-5 transition "
        onClick={() => toggleSetting("show_phone")}
      >
        <div className="flex flex-col items-start">
          <p>Phone</p>
          <p className="text-sm text-gray-400 transition duration-200">
            Show your phone number in profile
          </p>
        </div>

        <div className="flex items-center">
          <Switch
            checked={visibility.show_phone}
            onChange={() => toggleSetting("show_phone")}
            className={`${
              visibility.show_phone ? "bg-cyan-600" : "bg-gray-600"
            } cursor-pointer relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <span
              className={`${
                visibility.show_phone
                  ? "translate-x-9 scale-110"
                  : "translate-x-1 scale-100"
              } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
            >
              {visibility.show_phone && (
                <Check
                  size={16}
                  className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                />
              )}
            </span>
          </Switch>
        </div>
      </div>

      {/* Show Gender */}
      <div
        className="flex items-center justify-between text-lg cursor-pointer py-5 transition "
        onClick={() => toggleSetting("show_gender")}
      >
        <div className="flex flex-col items-start">
          <p>Gender</p>
          <p className="text-sm text-gray-400 transition duration-200">
            Show your gender in profile
          </p>
        </div>

        <div className="flex items-center">
          <Switch
            checked={visibility.show_gender}
            onChange={() => toggleSetting("show_gender")}
            className={`${
              visibility.show_gender ? "bg-cyan-600" : "bg-gray-600"
            } cursor-pointer relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <span
              className={`${
                visibility.show_gender
                  ? "translate-x-9 scale-110"
                  : "translate-x-1 scale-100"
              } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
            >
              {visibility.show_gender && (
                <Check
                  size={16}
                  className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                />
              )}
            </span>
          </Switch>
        </div>
      </div>

      {/* Show Bio */}
      <div
        className="flex items-center justify-between text-lg cursor-pointer py-5 transition "
        onClick={() => toggleSetting("show_bio")}
      >
        <div className="flex flex-col items-start">
          <p>Bio</p>
          <p className="text-sm text-gray-400 transition duration-200">
            Show your bio in profile
          </p>
        </div>

        <div className="flex items-center">
          <Switch
            checked={visibility.show_bio}
            onChange={() => toggleSetting("show_bio")}
            className={`${
              visibility.show_bio ? "bg-cyan-600" : "bg-gray-600"
            } cursor-pointer relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <span
              className={`${
                visibility.show_bio
                  ? "translate-x-9 scale-110"
                  : "translate-x-1 scale-100"
              } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
            >
              {visibility.show_bio && (
                <Check
                  size={16}
                  className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                />
              )}
            </span>
          </Switch>
        </div>
      </div>

      {/* Show Registration Date */}
      <div
        className="flex items-center justify-between text-lg cursor-pointer py-5 transition "
        onClick={() => toggleSetting("show_registration_date")}
      >
        <div className="flex flex-col items-start">
          <p>Registration Date</p>
          <p className="text-sm text-gray-400 transition duration-200">
            Show when you joined the platform
          </p>
        </div>

        <div className="flex items-center">
          <Switch
            checked={visibility.show_registration_date}
            onChange={() => toggleSetting("show_registration_date")}
            className={`${
              visibility.show_registration_date ? "bg-cyan-600" : "bg-gray-600"
            } cursor-pointer relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <span
              className={`${
                visibility.show_registration_date
                  ? "translate-x-9 scale-110"
                  : "translate-x-1 scale-100"
              } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
            >
              {visibility.show_registration_date && (
                <Check
                  size={16}
                  className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                />
              )}
            </span>
          </Switch>
        </div>
      </div>

      {/* Show Last Login */}
      <div
        className="flex items-center justify-between text-lg cursor-pointer py-5 transition "
        onClick={() => toggleSetting("show_last_login_at")}
      >
        <div className="flex flex-col items-start">
          <p>Last Login Date</p>
          <p className="text-sm text-gray-400 transition duration-200">
            Show your last login time in profile
          </p>
        </div>

        <div className="flex items-center">
          <Switch
            checked={visibility.show_last_login_at}
            onChange={() => toggleSetting("show_last_login_at")}
            className={`${
              visibility.show_last_login_at ? "bg-cyan-600" : "bg-gray-600"
            } cursor-pointer relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <span
              className={`${
                visibility.show_last_login_at
                  ? "translate-x-9 scale-110"
                  : "translate-x-1 scale-100"
              } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
            >
              {visibility.show_last_login_at && (
                <Check
                  size={16}
                  className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                />
              )}
            </span>
          </Switch>
        </div>
      </div>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/delete-account"
        onClick={() => setShowDefaultVisibilityPopup(true)}
      >
        <p className="text-red-400">Reset to Default Visbility Settings</p>
        <div className="flex items-center justify-around">
          <button className="group-hover/delete-account:bg-red-800 text-red-400 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {showVisibilityModePopup && (
        <VisibilityModePopup
          currentMode={visibility.visibility_mode as VisibilityModeType}
          onClose={() => setShowVisibilityModePopup(false)}
        />
      )}

      {showDefaultVisibilityPopup && (
        <DefaultVisibilityPopup
          onClose={() => setShowDefaultVisibilityPopup(false)}
        />
      )}
    </div>
  );
};

export default VisibilitySetting;
