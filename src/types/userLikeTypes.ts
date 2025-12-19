import type { GenderType } from "./userTypes";

export type UserLikeType = {
    author_id?: number | string;
    commenter_id?: number | string;

    author_username?: string;
    commenter_username?: string;

    author_is_admin?: boolean;
    commenter_is_admin?: boolean;

    author_gender?: GenderType;
    commenter_gender?: GenderType;

    author_profile_image?: string | null;
    commenter_profile_image?: string | null;

    author_registration_date?: string;
    commenter_registration_date?: string;
};