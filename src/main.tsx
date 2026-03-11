import { StrictMode } from "react";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "./context/AuthContext";
import { BlockedUsersProvider } from "./context/BlockedUserContext";
import { FollowingUsersProvider } from "./context/FollowingUserContext";
import { FocusUserProvider } from "./context/FocusUserContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import "./utils/i18n/i18n";
import { ThemeProvider } from "./context/ThemeContext";
import { PostOpenPreferenceProvider } from "./context/PostOpenPreferenceContext";
import { PostViewPreferenceProvider } from "./context/PostViewPreferenceContext";
import { UserNotiPreferenceProvider } from "./context/UserNotiPreferenceContext";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <PostOpenPreferenceProvider>
            <PostViewPreferenceProvider>
              <UserNotiPreferenceProvider>
                <AuthProvider>
                  <BlockedUsersProvider>
                    <FollowingUsersProvider>
                      <FocusUserProvider>
                        <BookmarkProvider>
                          <RouterProvider router={router} />
                        </BookmarkProvider>
                      </FocusUserProvider>
                    </FollowingUsersProvider>
                  </BlockedUsersProvider>
                </AuthProvider>
              </UserNotiPreferenceProvider>
            </PostViewPreferenceProvider>
          </PostOpenPreferenceProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
