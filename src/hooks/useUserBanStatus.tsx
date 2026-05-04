import { useQuery } from "@tanstack/react-query";
import authAxios from "../services/authAxios";
import { adminAPI } from "../services/http-api";

export function useUserBanStatus(userId: number) {
  return useQuery({
    queryKey: ["ban-status", userId],
    queryFn: async () => {
      const res = await authAxios.get(
        `${adminAPI.url}/users/user/${userId}/ban-status`,
      );
      return res.data;
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
}
