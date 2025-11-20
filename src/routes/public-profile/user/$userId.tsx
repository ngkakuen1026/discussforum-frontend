import { createFileRoute } from "@tanstack/react-router";
import PublicProfile from "../../../components/public-profile/user/PublicProfile";

export const Route = createFileRoute("/public-profile/user/$userId")({
  component: PublicProfile,
});
