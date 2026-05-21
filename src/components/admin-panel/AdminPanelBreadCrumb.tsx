import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import React from "react";

interface AdminPanelBreadCrumbProps {
  children: React.ReactNode;
}

const AdminPanelBreadCrumb: React.FC<AdminPanelBreadCrumbProps> = ({
  children,
}) => {
  const router = useRouter();

  const navigateBack = () => {
    router.history.back();
  };

  return (
    <nav className="flex items-center space-x-1 mb-4" aria-label="Breadcrumb">
      <ChevronLeft
        size={18}
        className="text-gray-400 hover:text-gray-200 cursor-pointer"
        onClick={navigateBack}
      />
      <span className="text-xl text-gray-400">Admin Panel &gt; {children}</span>
    </nav>
  );
};

export default AdminPanelBreadCrumb;
