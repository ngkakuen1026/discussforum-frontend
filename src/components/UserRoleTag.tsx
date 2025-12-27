import type { AuthorLike } from "../utils/userUtils";

interface UserRoleTagProps {
  user: AuthorLike;
}

export const UserRoleTag = ({ user }: UserRoleTagProps) => {
  const isAdmin =
    user.is_admin ?? user.author_is_admin ?? user.commenter_is_admin ?? false;

  const gender =
    user.gender ??
    user.author_gender ??
    user.commenter_gender ??
    user.parent_commenter_gender ??
    "Prefer Not to Say";

  if (isAdmin) {
    return (
      <span className="px-2 py-0.5 text-xs bg-yellow-600/80 rounded-lg font-semibold text-white">
        Admin
      </span>
    );
  }

  let bgColor = "bg-gray-600/80";

  if (gender === "Male") {
    bgColor = "bg-blue-600/80";
  } else if (gender === "Female") {
    bgColor = "bg-pink-600/80";
  }

  return (
    <span
      className={`px-2 py-0.5 text-xs text-white ${bgColor} rounded-lg font-semibold`}
    >
      Member
    </span>
  );
};
