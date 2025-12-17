import GallerySelectHeader from "./GallerySelectHeader";
import GallerySelectContent from "./GallerySelectContent";

import { useLanguage } from "../../hooks/useLanguage.js";

import { useAppSelector } from "../../hooks/useRedux.js";
import { makeSelectTextsByScreen } from "../../reducers/selectors/uiTexts.js";
import { getText } from "../../utils/getText.js";

const GallerySelect = () => {
  const texts = useAppSelector(makeSelectTextsByScreen("pictures"));

  const { language } = useLanguage();

  const heroHeader =
    language === "fin"
      ? getText(texts, "hero_text_pictures", "fin")
      : getText(texts, "hero_text_pictures", "en");

  return (
    <>
      <GallerySelectHeader heroText={heroHeader} />
      <GallerySelectContent texts={texts} />
    </>
  );
};

export default GallerySelect;
