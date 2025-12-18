import { getPrivacySettings } from "./readPrivasySettings.js";

export const getUserId = () => {
  const { allowStoreId } = getPrivacySettings();

  let userId = allowStoreId ? localStorage.getItem("userId") : undefined;
  if (!userId) {
    userId = crypto.randomUUID();
    if (allowStoreId) {
      localStorage.setItem("userId", userId);
    }
  }
  return userId;
};
