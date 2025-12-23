import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import TopNavbar from "../components/TopNavbar";
import { Toaster } from "sonner";

const RootLayout = () => {
  const { pathname } = useLocation();

  const hideNavbarPaths = ["/register", "/login"];

  return (
    <>
      {!hideNavbarPaths.includes(pathname) && <TopNavbar />}

      <hr />
      <div className="bg-[#0E1113] min-h-screen">
        <Outlet />
        <Toaster
          position="top-right"
          richColors
          closeButton
          offset="80px"
          toastOptions={{
            classNames: {
              toast: "shadow-2xl border border-gray-800",
              title: "font-semibold",
              description: "text-gray-400",
              actionButton: "bg-blue-600 hover:bg-blue-700",
              cancelButton: "bg-gray-800 hover:bg-gray-700",
            },
          }}
        />
      </div>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
