import { Outlet } from "@tanstack/react-router";
import SettingsTabs from "../../components/settings/SettingsTabs";
import { createFileRoute } from "@tanstack/react-router";

function SettingsLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-4xl font-bold mb-10">Settings</h1>
        <SettingsTabs />
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/settings")({
  component: SettingsLayout,
});
