import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Category } from "../types/types";
import type { Comment } from "../types/commentTypes.js";
import type { Reply } from "../types/replyTypes.js";

interface LightBoxContextType {
  isLightBoxOpen: boolean;
  setIsLightBoxOpen: (open: boolean) => void;
  currentIndex: number | undefined;
  setCurrentIndex: (index: number | undefined) => void;
  openLightBox: (index: number) => void;
  closeLightBox: () => void;
  category: Category;
  setCategory: (category: Category) => void;
  invalidIndex: boolean;
  setInvalidIndex: (value: boolean) => void;
  currentComment: Comment | Reply | undefined;
  setCurrentComment: (value: Comment | Reply | undefined) => void;
}

interface LightBoxProviderProps {
  children: ReactNode;
}

const LightBoxContext = createContext<LightBoxContextType | undefined>(
  undefined
);

export const LightBoxProvider = ({ children }: LightBoxProviderProps) => {
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(
    undefined
  );
  const [invalidIndex, setInvalidIndex] = useState(false);
  const [category, setCategory] = useState<Category>(undefined);
  const [currentComment, setCurrentComment] = useState<
    Comment | Reply | undefined
  >(undefined);

  const openLightBox = (index: number) => {
    if (index !== undefined) {
      setIsLightBoxOpen(true);
      setCurrentIndex(index);
    }
  };

  const closeLightBox = () => {
    setIsLightBoxOpen(false);
    setCurrentIndex(undefined);
  };

  useEffect(() => {
    if (isLightBoxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLightBoxOpen]);

  return (
    <LightBoxContext.Provider
      value={{
        isLightBoxOpen,
        setIsLightBoxOpen,
        currentIndex,
        setCurrentIndex,
        invalidIndex,
        setInvalidIndex,
        openLightBox,
        closeLightBox,
        category,
        setCategory,
        currentComment,
        setCurrentComment,
      }}
    >
      {children}
    </LightBoxContext.Provider>
  );
};

export default LightBoxContext;
