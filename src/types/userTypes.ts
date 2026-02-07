export interface UserType {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    gender: "Male" | "Female" | "Prefer Not to Say";
    bio: string;
    profile_image: string;
    profile_banner: string;
    registration_date: string;
    is_admin: boolean;
    last_login_at: string;

    visibility_mode: "public" | "private";
    show_full_name?: boolean;
    show_email?: boolean;
    show_phone?: boolean;
    show_gender?: boolean;
    show_bio?: boolean;
    show_registration_date?: boolean;
    show_last_login_at?: boolean;
};

export type GenderType = "Male" | "Female" | "Prefer Not to Say";

export interface UserRegistrationType {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    gender?: GenderType;
    bio?: string;
    temp_image_id?: string;
    preview_image_url?: string;
}

export interface UserVisibilityModeType {
    visibility_mode: string;
    show_full_name: boolean;
    show_email: boolean;
    show_phone: boolean;
    show_gender: boolean;
    show_bio: boolean;
    show_registration_date: boolean;
    show_last_login_at: boolean;
}

export type VisibilityModeType = "public" | "private";