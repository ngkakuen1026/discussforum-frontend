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
    registration_date: string;
    is_admin: boolean;
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