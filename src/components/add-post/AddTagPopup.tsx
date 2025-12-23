import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import authAxios from "../../services/authAxios";
import { tagsAPI } from "../../services/http-api";
import { X, Tag as TagIcon, Plus } from "lucide-react";
import ClickOutside from "../../hooks/useClickOutside";

interface AddTagPopupProps {
  onSelectTag: (tagName: string) => void;
  onClose: () => void;
}

const AddTagPopup = ({ onSelectTag, onClose }: AddTagPopupProps) => {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: tags = [] } = useQuery({
    queryKey: ["approved-tags"],
    queryFn: async () => {
      const res = await authAxios.get(`${tagsAPI.url}/all-tags`);
      return res.data.tags as { id: number; name: string }[];
    },
    staleTime: 10 * 60 * 1000,
  });

  const filteredTags = tags
    .filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 8);

  const handleSelect = (tagName: string) => {
    setSelectedTag(tagName);
    onSelectTag(tagName);
    onClose();
  };

  const handleCreateNew = () => {
    if (search.trim()) {
      handleSelect(search.trim());
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <TagIcon size={16} />
              <h2 className="text-lg font-bold ">Add Tag</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition"
            >
              <X size={16} className="cursor-pointer" />
            </button>
          </div>

          {/* Search */}
          <div className="p-6">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tags or create new..."
              className="w-full px-5 py-4 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  e.preventDefault();
                  handleCreateNew();
                }
              }}
            />
          </div>

          {/* Tag List */}
          <div className="max-h-96 overflow-y-auto px-6 pb-6 space-y-2">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleSelect(tag.name)}
                  className="w-full text-left px-5 py-3 rounded-lg bg-gray-800 hover:bg-cyan-900/50 transition flex items-center justify-between group"
                >
                  <span className="text-white font-medium">{tag.name}</span>
                  <span className="text-cyan-400 text-sm opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    Click to select
                  </span>
                </button>
              ))
            ) : search.trim() ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No tags found</p>
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition cursor-pointer"
                >
                  <Plus size={16} />
                  Create new tag: "{search.trim()}"
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Start typing to search tags...
              </p>
            )}
          </div>

          {selectedTag && (
            <div className=" px-6 py-4 bg-gray-800 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Selected:{" "}
                <span className="text-cyan-400 font-medium">{selectedTag}</span>
              </p>
            </div>
          )}
        </div>
      </ClickOutside>
    </div>
  );
};

export default AddTagPopup;
