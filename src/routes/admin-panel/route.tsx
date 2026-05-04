import { createFileRoute, Outlet } from "@tanstack/react-router";
import AdminPanelTabs from "../../components/admin-panel/AdminPanelTabs";

function AdminPanelLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      <div className="w-96 border-r border-gray-800 px-4 py-10 shrink-0 overflow-y-auto">
        <AdminPanelTabs />
      </div>

      <div className="flex-1 px-8 py-10 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/admin-panel")({
  component: AdminPanelLayout,
});
