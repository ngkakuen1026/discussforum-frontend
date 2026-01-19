export interface UserFollowType {
    following_user_id: number;
    following_user_username: string;
    following_user_profile_image: string;
    following_user_is_admin: boolean;
    following_user_registration_date: string;
    following_user_gender: "Male" | "Female" | "Prefer Not to Say";
}

export interface UserFollowerType {
    follower_user_id: number;
    follower_user_username: string;
    follower_user_profile_image: string;
    follower_user_is_admin: boolean;
    follower_user_registration_date: string;
    follower_user_gender: "Male" | "Female" | "Prefer Not to Say";
}