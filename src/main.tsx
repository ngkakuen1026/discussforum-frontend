import { StrictMode } from "react";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "./context/AuthContext";
import { BlockedUsersProvider } from "./context/BLockedUserContext";
import { FollowingUsersProvider } from "./context/FollowingUserContext";

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
        <AuthProvider>
          <BlockedUsersProvider>
            <FollowingUsersProvider>
              <RouterProvider router={router} />
            </FollowingUsersProvider>
          </BlockedUsersProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
