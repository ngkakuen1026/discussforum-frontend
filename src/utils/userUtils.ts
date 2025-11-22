// src/utils/userUtils.ts
export type AuthorLike = {
  // Admin
  is_admin?: boolean | null;
  author_is_admin?: boolean | null;
  commenter_is_admin?: boolean | null;

  // Gender
  gender?: string | null;
  author_gender?: string | null;
  commenter_gender?: string | null;

  // Profile image
  profile_image?: string | null;
  author_profile_image?: string | null;
  commenter_profile_image?: string | null;
};

export const getUsernameColor = (author: AuthorLike): string => {
  const isAdmin =
    author.is_admin ??
    author.author_is_admin ??
    author.commenter_is_admin;

  if (isAdmin) return "text-yellow-400";

  const gender =
    author.gender ??
    author.author_gender ??
    author.commenter_gender ??
    "Prefer Not to Say";

  switch (gender) {
    case "Male":
      return "text-blue-400";
    case "Female":
      return "text-pink-400";
    default:
      return "text-gray-300";
  }
};

export const getUserAvatar = (author: AuthorLike): string => {
  const image =
    author.profile_image ??
    author.author_profile_image ??
    author.commenter_profile_image;

  if (image) return image;

  const gender =
    author.gender ??
    author.author_gender ??
    author.commenter_gender ??
    "Prefer Not to Say";

  switch (gender) {
    case "Male":
      return "../src/assets/Images/default_male_icon.png";
    case "Female":
      return "../src/assets/Images/default_female_icon.png";
    default:
      return "../src/assets/Images/default_user_icon.png";
  }
};