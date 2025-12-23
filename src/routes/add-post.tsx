import { createFileRoute } from "@tanstack/react-router";
import AddPost from "../components/add-post/AddPost";
import RequireAuth from "../utils/RequireAuth";

const ProtectedAddPost = () => (
  <RequireAuth redirectParam="/add-post">
    <AddPost />
  </RequireAuth>
);

export const Route = createFileRoute("/add-post")({
  component: ProtectedAddPost,
});
