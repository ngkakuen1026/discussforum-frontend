export interface AddPostSearch {
    draftId?: number;
}

export interface PostRouteSearch {
    query?: string;
    page?: number | undefined;
    categoryId?: number | undefined;
}
