import { useAuth } from "../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const RequireAuth = ({
  children,
  redirectToLogin = "/login",
  redirectParam,
}: {
  children: React.ReactNode;
  redirectToLogin?: string;
  redirectParam?: string;
}) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({
        to: redirectParam
          ? `${redirectToLogin}?redirect=${encodeURIComponent(redirectParam)}`
          : redirectToLogin,
      });
    }
  }, [isLoggedIn, navigate, redirectToLogin, redirectParam]);

  if (!isLoggedIn) return null;

  return <>{children}</>;
};

export default RequireAuth;
