import { createFileRoute } from "@tanstack/react-router";
import BrowseHistory from "../components/browse-history/BrowseHistory";
import RequireAuth from "../utils/RequireAuth";

const ProtectedBrowseHistory = () => (
  <RequireAuth redirectParam="/browse-history">
    <BrowseHistory />
  </RequireAuth>
);

export const Route = createFileRoute("/browse-history")({
  component: ProtectedBrowseHistory,
});
