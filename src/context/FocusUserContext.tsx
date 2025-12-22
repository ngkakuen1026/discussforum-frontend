import { createContext, useContext, useState, type ReactNode } from "react";

interface FocusUserContextType {
  focusUserId: number | null;
  setFocusUserId: (id: number | null) => void;
}

const FocusUserContext = createContext<FocusUserContextType | undefined>(
  undefined
);

export const FocusUserProvider = ({ children }: { children: ReactNode }) => {
  const [focusUserId, setFocusUserId] = useState<number | null>(null);

  return (
    <FocusUserContext.Provider value={{ focusUserId, setFocusUserId }}>
      {children}
    </FocusUserContext.Provider>
  );
};

export const useFocusUser = () => {
  const context = useContext(FocusUserContext);
  if (!context) {
    throw new Error("useFocusUser must be used within FocusUserProvider");
  }
  return context;
};
