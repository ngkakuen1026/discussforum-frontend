import { createFileRoute } from "@tanstack/react-router";
import PostDrafts from "../components/post-drafts/PostDrafts";

export const Route = createFileRoute("/post-drafts")({
  component: PostDrafts,
});
