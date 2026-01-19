import PublicProfile from "../../../../components/public-profile/user/PublicProfile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/public-profile/user/$userId/")({
  component: PublicProfile,
});
