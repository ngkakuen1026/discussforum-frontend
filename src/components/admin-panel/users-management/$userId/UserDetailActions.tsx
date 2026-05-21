import { Loader2, Pencil, PencilOff, Save } from "lucide-react";

interface UserDetailActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const buttonClass =
  "rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const UserDetailActions = ({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
}: UserDetailActionsProps) => {
  return (
    <div className="flex items-center justify-between mb-8 pt-8 px-8">
      <h2 className="text-4xl font-black adminHeading">User Information</h2>
      <div className="flex gap-2">
        {!isEditing ? (
          <button
            onClick={onEdit}
            className={`${buttonClass} relative group transition-all`}
          >
            <Pencil
              size={18}
              className="text-gray-400 hover:text-gray-200 cursor-pointer"
            />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
              Edit
            </span>
          </button>
        ) : (
          <>
            <button
              onClick={onSave}
              disabled={isSaving}
              className={`${buttonClass} relative group transition-all`}
            >
              {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save
                  size={18}
                  className="text-gray-400 hover:text-gray-200 cursor-pointer"
                />
              )}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                {isSaving ? "Saving..." : "Save"}
              </span>
            </button>

            <button
              onClick={onCancel}
              className={`${buttonClass} relative group transition-all`}
            >
              <PencilOff
                size={18}
                className="text-gray-400 hover:text-gray-200 cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                Cancel
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetailActions;
