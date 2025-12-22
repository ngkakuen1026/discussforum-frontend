import type { UserRegistrationType } from "../../types/userTypes";

interface RegisterStep3PreviewProps {
  formData: UserRegistrationType;
  imagePreview: string | null;
  handleBackStep: () => void;
  handleNextStep: () => void;
}

const RegisterStep3Preview = ({
  formData,
  imagePreview,
  handleBackStep,
  handleNextStep,
}: RegisterStep3PreviewProps) => (
  <>
    <h3 className="text-2xl font-semibold text-white">Preview Your Profile</h3>
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 space-y-6 border border-white/10">
      <div className="flex items-center gap-6">
        <img
          src={imagePreview ? imagePreview : "src/assets/Images/default_user_icon.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover ring-4 ring-cyan-500/50"
        />
        <div>
          <h4 className="text-2xl font-bold text-white">{formData.username}</h4>
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
          <span className="text-white">{formData.phone || "Not set"}</span>
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
          <span className="text-white">{formData.bio || "No bio"}</span>
        </div>
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
        Continue
      </button>
    </div>
  </>
);

export default RegisterStep3Preview;
