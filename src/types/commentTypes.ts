export interface CommentType {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  parent_comment_id: number | null;
  commenter_id: number;
  commenter_username: string;
  commenter_profile_image: string;
  commenter_is_admin: boolean;
  commenter_registration_date: string;
  commenter_gender: "Male" | "Female" | "Prefer Not to Say";
}

export interface CommentWithRepliesType extends CommentType {
  replies: CommentWithRepliesType[];
}