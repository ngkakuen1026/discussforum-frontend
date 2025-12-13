const API_BASE_PATH = "/api/v1";

export const baseURL = {
    url: `http://localhost:3000${API_BASE_PATH}`
};

export const adminAPI = {
    url: `${baseURL.url}/admin`
};

export const authAPI = {
    url: `${baseURL.url}/auth`
};

export const usersAPI = {
    url: `${baseURL.url}/users`
};

export const postsAPI = {
    url: `${baseURL.url}/posts`
};

export const commentsAPI = {
    url: `${baseURL.url}/comments`
};

export const parentCategoriesAPI = {
    url: `${baseURL.url}/parent-categories`
};

export const categoriesAPI = {
    url: `${baseURL.url}/categories`
};

export const userFollowingAPI = {
    url: `${baseURL.url}/user-following`
};

export const notificationsAPI = {
    url: `${baseURL.url}/notifications`
};

export const reportsAPI = {
    url: `${baseURL.url}/reports`
};

export const userBlockedAPI = {
    url: `${baseURL.url}/user-blocked`
};

export const browsingHistoryAPI = {
    url: `${baseURL.url}/browsing-history`
};

export const bookmarksAPI = {
    url: `${baseURL.url}/bookmarks`
};

export const tagsAPI = {
    url: `${baseURL.url}/tags`
};

export const imagesAPI = {
    url: `${baseURL.url}/images`
}

export const postDraftsAPI = {
    url: `${baseURL.url}/post-drafts`
}