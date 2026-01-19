import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

const UserIdLayout = () => <Outlet />;

export const Route = createFileRoute("/public-profile/user/$userId")({
  component: UserIdLayout,
});
