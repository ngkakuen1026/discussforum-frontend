import { createFileRoute } from "@tanstack/react-router";
import Register from "../components/register/Register";

export const Route = createFileRoute("/register")({
  component: Register
});


