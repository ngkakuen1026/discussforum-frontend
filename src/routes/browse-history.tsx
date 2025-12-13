import { createFileRoute } from "@tanstack/react-router";
import BrowseHistory from "../components/browse-history/BrowseHistory";

export const Route = createFileRoute("/browse-history")({
  component: BrowseHistory
});
