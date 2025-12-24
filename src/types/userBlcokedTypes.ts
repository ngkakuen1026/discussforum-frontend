import type { GenderType } from "./userTypes";

export interface UserBlockedType {
    blocked_user_id: number;
    blocked_user_username: string;
    blocked_user_profile_image: string;
    blocked_user_is_admin: boolean;
    blocked_user_registration_date: string;
    blocked_user_gender: GenderType;
    user_blocked_at: string;
    blocked_reason: string;
}