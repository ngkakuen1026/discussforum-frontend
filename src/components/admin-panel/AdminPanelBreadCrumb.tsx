import React from "react";

interface AdminPanelBreadCrumbProps {
  children: React.ReactNode;
}

const AdminPanelBreadCrumb: React.FC<AdminPanelBreadCrumbProps> = ({
  children,
}) => {
  return (
    <nav className="flex items-center space-x-1 mb-4" aria-label="Breadcrumb">
      <span className="text-xl text-gray-400">Admin Panel &gt; {children}</span>
    </nav>
  );
};

export default AdminPanelBreadCrumb;
