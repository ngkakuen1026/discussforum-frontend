export interface notificationType {
  id: number;
  user_id: number;
  message: string;
  type:
  | 'follow'
  | 'unfollow'
  | 'post'
  | 'comment'
  | 'comment_reply'
  | 'like'
  | 'dislike'
  | 'mention'
  | 'admin_profile_edit'
  | 'admin_avatar_update'
  | 'admin_avatar_delete'
  | 'admin_user_delete'
  | 'admin_post_delete'
  | 'admin_comment_delete'
  | 'admin_report_resolved'
  | 'admin_tag_approved'
  | 'admin_tag_deleted'
  | 'admin_category_new'
  | 'admin_category_edit'
  | 'admin_category_delete';
  related_id: number | null;
  read: boolean;
  created_at: string;
}