import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface PostOpenPreferenceContextType {
  openInNewTab: boolean;
  setOpenInNewTab: (value: boolean) => void;
  toggleOpenInNewTab: () => void;
}

const PostOpenPreferenceContext = createContext<
  PostOpenPreferenceContextType | undefined
>(undefined);

export function PostOpenPreferenceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [openInNewTab, setOpenInNewTab] = useState<boolean>(() => {
    const saved = localStorage.getItem("openPostsInNewTab");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("openPostsInNewTab", openInNewTab.toString());
  }, [openInNewTab]);

  const toggleOpenInNewTab = () => {
    setOpenInNewTab((prev) => !prev);
  };

  return (
    <PostOpenPreferenceContext.Provider
      value={{ openInNewTab, setOpenInNewTab, toggleOpenInNewTab }}
    >
      {children}
    </PostOpenPreferenceContext.Provider>
  );
}

export const usePostOpenPreference = () => {
  const context = useContext(PostOpenPreferenceContext);
  if (!context) {
    throw new Error(
      "usePostOpenPreference must be used within PostOpenPreferenceProvider",
    );
  }
  return context;
};
