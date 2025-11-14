export interface notificationType {
  id: number;
  user_id: number;
  message: string;
  type: 'tag_deleted' | 'mention' | 'post'; 
  related_id: number | null; 
  read: boolean;
  created_at: string; 
}
