import type { GenderType } from "./userTypes";

export interface CommentType {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  parent_comment_id: number | null;

  commenter_id: number;
  commenter_username: string;
  commenter_profile_image: string | null;
  commenter_is_admin: boolean;
  commenter_registration_date: string;
  commenter_gender: GenderType;

  floor_number: string;
  parent_floor_number: string | null;
  parent_comment_content: string | null;
  parent_comment_created_at: string;
  parent_commenter_username: string | null;
  parent_commenter_is_admin: boolean;
  parent_commenter_gender: GenderType;
}

export type CommentWithRepliesType = CommentType;