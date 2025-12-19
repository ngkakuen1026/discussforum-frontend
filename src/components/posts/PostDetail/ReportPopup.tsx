import { useState } from "react";
import { X, Flag, ChevronDown, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import authAxios from "../../../services/authAxios";
import { reportsAPI } from "../../../services/http-api";
import ClickOutside from "../../../hooks/useClickOutside";


interface ReportPopupProps {
  contentId: string | number;
  contentType: "post" | "comment";
  onClose: () => void;
  onSuccess?: () => void;
}

const reportReasons = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment or Bullying" },
  { value: "hate speech", label: "Hate Speech" },
  { value: "inappropriate content", label: "Inappropriate Content" },
  { value: "impersonation", label: "Impersonation" },
  { value: "misinformation", label: "Misinformation" },
  { value: "threatening behavior", label: "Threatening Behavior" },
  { value: "copyright violation", label: "Copyright Violation" },
  { value: "self-harm or suicide", label: "Self-Harm or Suicide" },
  { value: "scam or fraud", label: "Scam or Fraud" },
  { value: "other", label: "Other" },
] as const;

type ReasonValue = (typeof reportReasons)[number]["value"];

export default function ReportPopup({
  contentId,
  contentType,
  onClose,
  onSuccess,
}: ReportPopupProps) {
  const [reason, setReason] = useState<ReasonValue | "">("");
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");

  const selectedLabel =
    reportReasons.find((r) => r.value === reason)?.label ||
    "Choose a reason...";

  const mutation = useMutation({
    mutationFn: () =>
      authAxios.post(`${reportsAPI.url}/report-content/${contentId}`, {
        contentType,
        reason,
        customReason: reason === "other" ? customReason.trim() || null : null,
        additionalComments: additionalComments.trim() || null,
      }),
    onSuccess: () => {
      toast.success("Report submitted successfully. Thank you!");
      onClose();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to submit report.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return toast.error("Please select a reason.");
    if (reason === "other" && !customReason.trim()) {
      return toast.error("Please describe the issue.");
    }
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Flag size={24} className="text-red-500" />
              <h2 className="text-xl font-bold text-white">Report Content</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={24} className="cursor-pointer" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* DROPDOWN */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason for reporting <span className="text-red-500">*</span>
              </label>

              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setIsReasonOpen(!isReasonOpen)}
                className="w-full px-5 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl text-left text-white flex items-center justify-between hover:border-red-500/50 transition-all group"
              >
                <span className={reason ? "text-white" : "text-gray-500"}>
                  {selectedLabel}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform group-hover:text-red-400 ${
                    isReasonOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Animated Dropdown */}
              {isReasonOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsReasonOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    {reportReasons.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setReason(option.value);
                          setIsReasonOpen(false);
                        }}
                        className="w-full px-6 py-4 text-left text-white hover:bg-linear-to-r hover:from-red-500/20 hover:to-pink-500/20 transition-all flex items-center justify-between group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {option.label}
                        </span>
                        {reason === option.value && (
                          <Check size={20} className="text-red-400" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>

            {/* Custom Reason */}
            {reason === "other" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Please describe the issue{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Explain in detail..."
                  className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  required
                />
              </div>
            )}

            {/* Additional Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Additional comments (optional)
              </label>
              <textarea
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Anything else you'd like to add..."
                className="w-full h-28 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || !reason}
                className="cursor-pointer bg-linear-to-br from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {mutation.isPending ? "Submitting..." : <>Submit Report</>}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
}
