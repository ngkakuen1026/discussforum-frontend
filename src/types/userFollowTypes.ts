export interface UserFollowType {
    following_user_id: number;
    following_user_username: string;
    following_user_profile_image: string;
    following_user_is_admin: boolean;
    following_user_registration_date: string;
    following_user_gender: "Male" | "Female" | "Prefer Not to Say";
}