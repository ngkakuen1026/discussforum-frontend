import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import TopNavbar from "../components/TopNavbar";

const RootLayout = () => (
  <>
    <TopNavbar />
    <hr />
    <div className="px-8 py-4">
      <Outlet />
    </div>
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
