import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectHomeTexts = createSelector(
  (state: RootState) => state.uiTexts.uiTexts,
  (texts) => texts.filter((t) => t.screen === "home")
);
