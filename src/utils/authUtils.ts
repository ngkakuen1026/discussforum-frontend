import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const useAuthAction = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const withAuth = (loggedInAction: () => void) => {
        return () => {
            if (isLoggedIn) {
                loggedInAction();
            } else {
                navigate({
                    to: "/login",
                    search: { redirect: window.location.pathname + window.location.search },
                });
                toast.info(`Please login first.`)
            }
        };
    };

    return { withAuth, isLoggedIn };
};