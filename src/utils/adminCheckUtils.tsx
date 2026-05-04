import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const RequireAdmin = ({
  children,
  redirectToMainPage = "/",
}: {
  children: React.ReactNode;
  redirectToMainPage?: string;
}) => {
  const { isLoggedIn, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (authLoading) return; 

    if (!isLoggedIn || !user?.is_admin) {
      if (!hasRedirected) {
        setHasRedirected(true);
        navigate({ to: redirectToMainPage, replace: true });
        toast.error("You do not have permission to access this page.");
      }
    }
  }, [
    isLoggedIn,
    user,
    authLoading,
    navigate,
    redirectToMainPage,
    hasRedirected,
  ]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Checking permissions...</div>
      </div>
    );
  }

  if (!isLoggedIn || !user?.is_admin) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAdmin;
