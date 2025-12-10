import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const makeSelectTextsByScreen = (screen: string) =>
  createSelector(
    (state: RootState) => state.uiTexts.uiTexts,
    (texts) => texts.filter((t) => t.screen === screen)
  );

export const selectLanguages = createSelector(
  (state: RootState) => state.uiTexts.uiTexts,
  (texts) => [...new Set(texts.map((t) => t.language))]
);

// selectors.ts
export const makeSelectTexts = (screen: string, lang?: string, role?: string) =>
  createSelector(
    (state: RootState) => state.uiTexts.uiTexts,
    (texts) => {
      if (!lang) return [];
      if (!role)
        return texts.filter((t) => t.screen === screen && t.language === lang);
      else
        return texts.filter(
          (t) => t.screen === screen && t.language === lang && t.role === role
        );
    }
  );
