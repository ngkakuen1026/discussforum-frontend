export interface PostType {
    id: number;
    user_id: number;
    title: string;
    content: string;
    created_at: string;
    category_id: number;
    pending_tag_name: string | null;
    author_id: number;
    author_username: string;
    author_profile_image: string;
    author_is_admin: boolean;
    author_registration_date: string;
    author_gender: "Male" | "Female" | "Prefer Not to Say";
}