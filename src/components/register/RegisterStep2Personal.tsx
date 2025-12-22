import React from "react";
import { ChevronDown, Check, Upload, X } from "lucide-react";
import type { UserRegistrationType } from "../../types/userTypes";

interface RegisterStep2PersonalProps {
  formData: UserRegistrationType;
  updateFormData: (updates: Partial<UserRegistrationType>) => void;
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  isGenderOpen: boolean;
  setIsGenderOpen: (open: boolean) => void;
  handleNextStep: () => void;
  handleBackStep: () => void;
  uploadPending: boolean;
}

const RegisterStep2Personal = ({
  formData,
  updateFormData,
  imagePreview,
  handleImageUpload,
  removeImage,
  isGenderOpen,
  setIsGenderOpen,
  handleNextStep,
  handleBackStep,
  uploadPending,
}: RegisterStep2PersonalProps) => (
  <>
    <h3 className="text-2xl font-semibold text-white">Personal Info (Optional)</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">First Name</label>
        <input
          placeholder="First Name"
          value={formData.first_name || ""}
          onChange={(e) => updateFormData({ first_name: e.target.value })}
          className="px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-xl"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Last name</label>
        <input
          placeholder="Last Name"
          value={formData.last_name || ""}
          onChange={(e) => updateFormData({ last_name: e.target.value })}
          className="px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-xl"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Phone Number</label>
        <input
          placeholder="Phone"
          value={formData.phone || ""}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          className="px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-xl"
        />
      </div>
      <div className="space-y-2">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-[0.65rem]">Gender</label>
          <button
            type="button"
            onClick={() => setIsGenderOpen(!isGenderOpen)}
            className="w-full px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all backdrop-blur-xl hover:bg-white/15"
          >
            <span className={formData.gender ? "text-white" : "text-gray-500"}>
              {formData.gender || "Gender"}
            </span>
            <ChevronDown
              size={20}
              className={`transition-transform duration-300 text-gray-400 ${isGenderOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isGenderOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsGenderOpen(false)} />
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50">
                {(["Male", "Female", "Prefer Not to Say"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      updateFormData({ gender: option });
                      setIsGenderOpen(false);
                    }}
                    className="w-full px-6 py-4 text-left text-white hover:bg-linear-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all flex items-center justify-between group first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{option}</span>
                    {formData.gender === option && <Check size={20} className="text-cyan-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">Bio</label>
      <textarea
        placeholder="Tell everyone about yourself..."
        value={formData.bio || ""}
        onChange={(e) => updateFormData({ bio: e.target.value })}
        rows={4}
        className="w-full px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-xl resize-none"
      />
    </div>
    <div className="space-y-4">
      <label className="block text-lg font-medium text-gray-300">Profile Picture</label>
      <div className="flex items-center gap-6">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploadPending}
          />
          <div className="flex items-center gap-3 px-6 py-4 bg-white/10 border-2 border-dashed border-white/30 rounded-2xl hover:border-cyan-500 transition-all">
            <Upload size={24} className="text-cyan-400" />
            <span className="text-white">{uploadPending ? "Uploading..." : "Choose Image"}</span>
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
    <div className="flex justify-between mt-6">
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
);

export default RegisterStep2Personal;
