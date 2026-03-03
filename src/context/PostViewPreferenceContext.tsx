import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type PostViewMode = "compact" | "card";

interface PostViewPreferenceContextType {
  postViewMode: PostViewMode;
  setPostViewMode: (mode: PostViewMode) => void;
}

const PostViewPreferenceContext = createContext<
  PostViewPreferenceContextType | undefined
>(undefined);

export function PostViewPreferenceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [postViewMode, setPostViewMode] = useState<PostViewMode>(() => {
    const saved = localStorage.getItem("postViewMode");
    return (saved as PostViewMode) || "compact";
  });

  useEffect(() => {
    localStorage.setItem("postViewMode", postViewMode);
  }, [postViewMode]);

  return (
    <PostViewPreferenceContext.Provider
      value={{ postViewMode, setPostViewMode }}
    >
      {children}
    </PostViewPreferenceContext.Provider>
  );
}

export const usePostViewPreference = () => {
  const context = useContext(PostViewPreferenceContext);
  if (!context) {
    throw new Error(
      "usePostViewPreference must be used within PostViewPreferenceProvider",
    );
  }
  return context;
};
