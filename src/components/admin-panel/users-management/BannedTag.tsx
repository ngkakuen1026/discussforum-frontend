import { useUserBanStatus } from "../../../hooks/useUserBanStatus";
import type { UserType } from "../../../types/userTypes";

interface BannedTagProps {
  user: UserType;
}

export const BannedTag = ({ user }: BannedTagProps) => {
  const { data: banInfo } = useUserBanStatus(user.id);

  const isBanned = banInfo?.isBanned === true;
  const banType = banInfo?.ban?.ban_type;

  let label = "Suspended";

  switch (banType) {
    case "post":
      label = "Post Ban";
      break;
    case "comment":
      label = "Comment Ban";
      break;
    case "interaction":
      label = "Interaction Ban";
      break;
    case "all":
      label = "Account Suspended";
      break;
  }

  if (!isBanned) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-green-600/90 text-white rounded-lg">
        <span className="inline-block w-2 h-2 bg-green-300 rounded-full" />
        Normal
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold bg-red-600/90 text-white rounded-lg">
      <span className="inline-block w-2 h-2 bg-red-300 rounded-full animate-pulse" />
      {label}
    </span>
  );
};
