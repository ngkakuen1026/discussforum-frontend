import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import authAxios from "../../services/authAxios";
import {
  categoriesAPI,
  imagesAPI,
  parentCategoriesAPI,
  postDraftsAPI,
  postsAPI,
} from "../../services/http-api";
import { toast } from "sonner";
import type { categoryType } from "../../types/categoryTypes";
import { Tag, TagIcon, X } from "lucide-react";
import AddTagPopup from "./AddTagPopup";
import TiptapEditor from "../TiptapEditor/TiptapEditor";
import type { AddPostSearch } from "../../types/routeTypes";
import type {
  AddPostDraftType,
  AddPostResponse,
  AddPostType,
} from "../../types/postTypes";

const AddPost = () => {
  const { draftId } = useSearch({
    from: "/add-post",
    select: (search: AddPostSearch) => ({
      draftId: search.draftId,
    }),
  });

  const [showTagPopup, setShowTagPopup] = useState(false);
  const [input, setInput] = useState({
    title: "",
    content: "",
    categoryId: 0,
    tag: "",
  });
  const [pendingImages, setPendingImages] = useState<string[]>([]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery<categoryType[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await authAxios.get(`${categoriesAPI.url}/all-categories`);
      return res.data.categories;
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: parentCategories = [] } = useQuery<categoryType[]>({
    queryKey: ["parent-categories"],
    queryFn: async () => {
      const res = await authAxios.get(
        `${parentCategoriesAPI.url}/all-parent-categories`
      );
      return res.data.parentCategories || res.data.categories || [];
    },
    staleTime: 15 * 60 * 1000,
  });

  const { data: drafts = [] } = useQuery({
    queryKey: ["post-drafts"],
    queryFn: async () => {
      const res = await authAxios.get(`${postDraftsAPI.url}/post-drafts/me`);
      return res.data.drafts;
    },
  });

  const { data: draft, refetch: refetchDraft } = useQuery({
    queryKey: ["post-draft", draftId],
    queryFn: async () => {
      const res = await authAxios.get(
        `${postDraftsAPI.url}/post-draft/${draftId}`
      );
      return res.data.draft;
    },
    enabled: !!draftId && !isNaN(Number(draftId)),
    staleTime: 0,
  });

  const newPostMutation = useMutation<AddPostResponse, Error, AddPostType>({
    mutationFn: async (addPostData) => {
      const res = await authAxios.post(`${postsAPI.url}/post`, addPostData);
      return res.data;
    },
    onSuccess: (data) => {
      const newPost = data.post;
      toast.success("Post published successfully!");

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", newPost.id] });

      navigate({
        to: "/posts/$postId",
        params: { postId: String(newPost.id) },
        search: { page: 1 },
        replace: true,
      });
    },
    onError: (error: unknown) => {
      let message = "Failed to publish post.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } };
        };

        const status = axiosError.response?.status;
        const serverMessage = axiosError.response?.data?.message;

        switch (status) {
          case 404:
            message = "Title, content and category are required.";
            break;
          default:
            message = serverMessage || message;
        }
        toast.error(message);
      }
    },
  });

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (draftData: AddPostDraftType) => {
      if (draft) {
        return authAxios.patch(
          `${postDraftsAPI.url}/post-draft/${draftId}`,
          draftData
        );
      } else {
        return authAxios.post(`${postDraftsAPI.url}/post-draft`, draftData);
      }
    },
    onSuccess: () => {
      toast.success("Draft saved!");
      queryClient.invalidateQueries({ queryKey: ["post-drafts"] });
      if (draftId) {
        refetchDraft();
      }
    },
    onError: () => {
      toast.error("Failed to save draft");
    },
  });

  useEffect(() => {
    if (!draft) return;

    setInput({
      title: draft.title || "",
      content: draft.content || "",
      categoryId: draft.categoryId || 0,
      tag: draft.tag || "",
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(draft.content || "", "text/html");
    const images = doc.querySelectorAll("img") as NodeListOf<HTMLImageElement>;

    const base64Images = Array.from(images)
      .map((img) => img.src)
      .filter((src) => src.startsWith("data:"));

    setPendingImages((prev) => [...prev, ...base64Images]);
  }, [draft]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalContent = input.content;

    const uploadedUrls: string[] = [];

    for (const base64 of pendingImages) {
      if (base64.startsWith("http")) {
        uploadedUrls.push(base64);
        continue;
      }

      try {
        const blob = await (await fetch(base64)).blob();
        const file = new File([blob], "image.jpg", { type: blob.type });

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", "post");

        const res = await authAxios.post(`${imagesAPI.url}/image`, formData);
        uploadedUrls.push(res.data.url);
      } catch (error) {
        toast.error("Failed to upload image");
        console.error("Error uploading image:" + error);
        return;
      }
    }

    pendingImages.forEach((oldUrl, index) => {
      if (oldUrl.startsWith("data:")) {
        const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "g");
        finalContent = finalContent.replace(regex, uploadedUrls[index]);
      }
    });

    newPostMutation.mutate({
      ...input,
      content: finalContent,
    });
  };

  const isLoading = newPostMutation.isPending || saveDraftMutation.isPending;

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Create New Post</h1>
        <Link
          to="/post-drafts"
          className="text-lg font-semibold text-white rounded-full hover:bg-gray-500 px-2 py-4"
        >
          {drafts.length}/10 {drafts.length > 1 ? "Drafts" : "Draft"}
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <select
              name="categoryId"
              value={input.categoryId}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-[#0E1113]"
              required
              disabled={isLoading}
            >
              <option value="">Select a category</option>

              {parentCategories.map((parent) => (
                <optgroup
                  key={parent.id}
                  label={`${parent.name}`}
                  className="font-semibold"
                >
                  {categories
                    .filter((cat) => cat.parent_id === parent.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </optgroup>
              ))}

              {/* Orphan categories (no parent) */}
              {categories.filter((cat) => !cat.parent_id).length > 0 && (
                <optgroup label="Other Categories">
                  {categories
                    .filter((cat) => !cat.parent_id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Title */}
          <div className="flex-2">
            <input
              name="title"
              type="text"
              placeholder="Enter a catchy title..."
              value={input.title}
              onChange={handleChange}
              className="w-full px-5 py-3.5 text-lg rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Optional Tag */}
        {!input.tag && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/50 text-cyan-400 border border-cyan-800 text-sm cursor-pointer transition-all hover:scale-105"
            onClick={() => setShowTagPopup(true)}
          >
            <Tag size={14} className="opacity-70" />
            <span className="text-sm">Add tags to your post</span>
          </div>
        )}

        {input.tag && (
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/50 text-cyan-400 border border-cyan-800 text-sm">
              <TagIcon size={14} />
              {input.tag}
            </span>
            <button
              onClick={() => setInput((prev) => ({ ...prev, tag: "" }))}
              className="text-gray-500 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <TiptapEditor
          key={draft ? `draft-${draft.id}` : "new-post"}
          content={draft ? draft.content : input.content}
          onChange={(html) => setInput((prev) => ({ ...prev, content: html }))}
          placeholder="What's on your mind? Write something amazing..."
          onAddPendingImage={(base64) =>
            setPendingImages((prev) => [...prev, base64])
          }
        />

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              saveDraftMutation.mutate({
                ...input,
              });
              navigate({ to: "/post-drafts" });
            }}
            disabled={isLoading}
            className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-3 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {draft ? `Update Draft` : `Save Draft`}
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer bg-linear-to-br from-gray-500 to-white hover:from-gray-400 hover:to-white text-white font-bold py-3 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
          >
            {newPostMutation.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Posting...
              </>
            ) : (
              "Publish Post"
            )}
          </button>
        </div>
      </form>

      {/* Popup */}
      {showTagPopup && (
        <AddTagPopup
          onSelectTag={(tagName) => {
            setInput((prev) => ({ ...prev, tag: tagName }));
            setShowTagPopup(false);
          }}
          onClose={() => setShowTagPopup(false)}
        />
      )}
    </div>
  );
};

export default AddPost;
