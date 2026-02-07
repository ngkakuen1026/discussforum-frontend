import type { GenderType } from "./userTypes";

export type UserLikeType = {
  // Author 
  author_id?: number | string;
  author_username?: string;
  author_is_admin?: boolean;
  author_gender?: GenderType;
  author_profile_image?: string | null;
  author_registration_date?: string;
  author_visibility_mode?: "public" | "private";
  author_show_registration_date?: boolean;

  // Commenter
  commenter_id?: number | string;
  commenter_username?: string;
  commenter_is_admin?: boolean;
  commenter_gender?: GenderType;
  commenter_profile_image?: string | null;
  commenter_registration_date?: string;
  commenter_visibility_mode?: "public" | "private";
  commenter_show_registration_date?: boolean;

  id?: number;  
  username?: string;
  is_admin?: boolean;
};