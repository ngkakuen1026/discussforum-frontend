export interface PostType {
    id: number;
    user_id: number;
    title: string;
    content: string;
    created_at: string;
    category_id: number;
    pending_tag_name: string | null;
    views: number;
    author_id: number;
    author_username: string;
    author_profile_image: string;
    author_is_admin: boolean;
    author_registration_date: string;
    author_gender: "Male" | "Female" | "Prefer Not to Say";
}

export interface PostDraftType {
    id: number;
    title: string;
    content: string;
    categoryId: number | string;
    tag: string;
    updatedAt: string;
}

export interface AddPostType {
    title: string;
    content: string;
    categoryId: number | string;
    tag: string;
}

export interface AddPostResponse {
    post: {
        id: number | string;
        user_id: number | string;
        title: string;
        content: string;
        created_at: string;
        categoryId: number | string;
        pending_tag_name?: string | null;
    };
}

export interface AddPostDraftType {
    title: string | null;
    content: string | null;
    categoryId: number | string | null;
    tag: string | null;
}