import { History, X } from "lucide-react";
import ClickOutside from "../../../hooks/useClickOutside";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { browsingHistoryAPI } from "../../../services/http-api";
import { toast } from "sonner";
import type { BrowseHistoryType } from "../../../types/browseHistoryTypes";
import { Link } from "@tanstack/react-router";

interface DeleteAllBrowsingHistoryPopupProps {
  onClose: () => void;
}

const DeleteAllBrowsingHistoryPopup = ({
  onClose,
}: DeleteAllBrowsingHistoryPopupProps) => {
  const queryClient = useQueryClient();

  const { data: browsingHistories = [], isLoading } = useQuery<
    BrowseHistoryType[]
  >({
    queryKey: ["my-browsingHistories"],
    queryFn: async () => {
      const res = await authAxios.get(
        `${browsingHistoryAPI.url}/browsing-history/me`,
      );
      return res.data.browsingHistories;
    },
    staleTime: 5 * 60 * 1000,
  });

  const recordCount = browsingHistories.length;

  const deleteAllBrowsingHistoryMutation = useMutation({
    mutationFn: () =>
      authAxios.delete(`${browsingHistoryAPI.url}/browsing-history/all`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["my-browsingHistories"] });
      toast.success(`Deleted ${response.data.deletedCount} browsing history.`);
      onClose();
    },
    onError: () => {
      toast.error("Failed to delete browsing history");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deleteAllBrowsingHistoryMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <History size={18} />
              <h2 className="text-lg font-bold">Delete All Browsing History</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X size={18} className="cursor-pointer" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <p className="text-sm text-gray-400 leading-relaxed">
              This will permanently delete all your browsing history. This
              action cannot be undone.
            </p>

            {isLoading ? (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center text-gray-500">
                Loading history...
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 flex justify-between items-center">
                <span className="text-gray-300">
                  {recordCount === 0 ? (
                    <Link
                      to="/"
                      search={{ categoryId: 0 }}
                      replace={true}
                      className="hover:underline"
                      target="_blank"
                    >
                      No record found, Go explore the forum now!
                    </Link>
                  ) : (
                    `${recordCount} browsing history record${recordCount !== 1 ? "s" : ""}`
                  )}
                </span>
              </div>
            )}

            <p className="text-sm text-gray-400 leading-relaxed">
              This action cannot be undone. Are you sure?
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                disabled={deleteAllBrowsingHistoryMutation.isPending}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  deleteAllBrowsingHistoryMutation.isPending ||
                  browsingHistories.length === 0
                }
                className="cursor-pointer bg-linear-to-br from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deleteAllBrowsingHistoryMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleteing...
                  </>
                ) : (
                  "Delete All"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default DeleteAllBrowsingHistoryPopup;
