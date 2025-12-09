import type { UiText } from "../types/uiTextTypes";

export const getText = (texts: UiText[], key: string, lang: string) => {
  return texts.find((t) => t.key_name === key && t.language === lang)?.content;
};
