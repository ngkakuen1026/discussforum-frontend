import type { GenderType } from "./userTypes";

export interface UserBlockedType {
    blocked_user_id: number;
    blocked_user_username: string;
    blocked_user_first_name: string | null;
    blocked_user_last_name: string | null;
    blocked_user_profile_image: string;
    blocked_user_bio: string | null;
    blocked_user_email: string;
    blocked_user_phone: string;
    blocked_user_gender: GenderType;
    blocked_user_is_admin: boolean;
    blocked_user_last_login_at: string;
    blocked_user_registration_date: string;
    blocked_at: string;
    blocked_reason: string;
}

export interface UserBlockerType {
    blocker_user_id: number;
    blocker_user_username: string;
    blocker_user_first_name: string | null;
    blocker_user_last_name: string | null;
    blocker_user_profile_image: string;
    blocker_user_bio: string | null;
    blocker_user_email: string;
    blocker_user_phone: string;
    blocker_user_gender: GenderType;
    blocker_user_is_admin: boolean;
    blocker_user_last_login_at: string;
    blocker_user_registration_date: string;
    blocked_at: string;
    blocked_reason: string;
}