export interface BrowseHistoryType {
    bookmark_id: number;
    post_id: number;
    post_title: string;
    post_view: number;
    author_username: string;
    author_profile_image: string;
    author_is_admin: boolean;
    author_registration_date: string;
    author_gender: "Male" | "Female" | "Prefer Not to Say";
    upvotes: number;
    downvotes: number;
    category_name: string;
    category_id: number;
    post_created_at: string;
    browsing_visited_at: string;
}