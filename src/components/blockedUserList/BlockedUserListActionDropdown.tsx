import { CircleOff, Pencil } from "lucide-react";
import ClickOutside from "../../hooks/useClickOutside";

interface BlockedUserListActionDropdownProps {
  isPending?: boolean;
  onUnblock: () => void;
  onClose: () => void;
  onBlockReasonPopupOpen: () => void;
}

const BlockedUserListActionDropdown = ({
  isPending,
  onUnblock,
  onClose,
  onBlockReasonPopupOpen,
}: BlockedUserListActionDropdownProps) => {
  return (
    <div className="absolute right-5 top-10 z-10 min-w-[180px] bg-[#181A20] border border-gray-800 rounded-xl shadow-lg py-2 flex flex-col gap-1">
      <ClickOutside onClickOutside={onClose}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBlockReasonPopupOpen();
          }}
          className="flex items-center gap-2 px-4 py-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20 rounded-lg transition text-sm font-medium cursor-pointer"
        >
          <Pencil size={18} />
          Update block reason
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnblock();
          }}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:text-gray-00 hover:bg-red-900/20 rounded-lg transition text-sm font-medium cursor-pointer"
        >
          <CircleOff size={18} />
          Unblock User
        </button>
      </ClickOutside>
    </div>
  );
};

export default BlockedUserListActionDropdown;
