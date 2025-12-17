import ContentUnit from "./ContentUnit";

import { getText } from "../../utils/getText.js";

import type { UiText } from "../../types/uiTextTypes";
import type { Category } from "../../types/types";

type GallerySelectContentProps = {
  texts: UiText[];
};

type TextByCategory = {
  imgClass: Category;
  path: string;
  src: string;
  headerFi: string | undefined;
  headerEn: string | undefined;
  textContentFi: string | undefined;
  textContentEn: string | undefined;
};

const GallerySelectContent = ({ texts }: GallerySelectContentProps) => {
  const TextByCategory: TextByCategory[] = [
    {
      imgClass: "mammals",
      path: "/pictures/mammals",
      src: "/uploads/images/pictures/mammals.jpg",
      headerFi: getText(texts, "pictures_header_mammals", "fin"),
      headerEn: getText(texts, "pictures_header_mammals", "en"),
      textContentFi: getText(texts, "pictures_textContent_mammals", "fin"),
      textContentEn: getText(texts, "pictures_textContent_mammals", "en"),
    },
    {
      imgClass: "nature",
      path: "/pictures/nature",
      src: "/uploads/images/pictures/nature.jpg",
      headerFi: getText(texts, "pictures_header_nature", "fin"),
      headerEn: getText(texts, "pictures_header_nature", "en"),
      textContentFi: getText(texts, "pictures_textContent_nature", "fin"),
      textContentEn: getText(texts, "pictures_textContent_nature", "en"),
    },
    {
      imgClass: "landscapes",
      path: "/pictures/landscapes",
      src: "/uploads/images/pictures/landscapes.jpg",
      headerFi: getText(texts, "pictures_header_landscapes", "fin"),
      headerEn: getText(texts, "pictures_header_landscapes", "en"),
      textContentFi: getText(texts, "pictures_textContent_landscapes", "fin"),
      textContentEn: getText(texts, "pictures_textContent_landscapes", "en"),
    },
    {
      imgClass: "birds",
      path: "/pictures/birds",
      src: "/uploads/images/pictures/birds.jpg",
      headerFi: getText(texts, "pictures_header_birds", "fin"),
      headerEn: getText(texts, "pictures_header_birds", "en"),
      textContentFi: getText(texts, "pictures_textContent_birds", "fin"),
      textContentEn: getText(texts, "pictures_textContent_birds", "en"),
    },
    {
      imgClass: "monthly",
      path: "/pictures/monthly",
      src: "/uploads/images/pictures/monthly.jpg",
      headerFi: getText(texts, "pictures_header_monthly", "fin"),
      headerEn: getText(texts, "pictures_header_monthly", "en"),
      textContentFi: getText(texts, "pictures_textContent_monthly", "fin"),
      textContentEn: getText(texts, "pictures_textContent_monthly", "en"),
    },
  ];

  return TextByCategory.map((category, index) => (
    <ContentUnit
      key={index}
      category={category}
      index={index}
      length={TextByCategory.length}
    />
  ));
};

export default GallerySelectContent;
