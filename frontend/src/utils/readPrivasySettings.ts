type PrivacySettings = {
  allowStoreViewedImages: boolean;
  allowStoreReviews: boolean;
  allowStoreId: boolean;
};

const PRIVACY_KEY = "privacySettings";

export const getPrivacySettings = (): PrivacySettings => {
  const saved = localStorage.getItem(PRIVACY_KEY);
  if (!saved) {
    return {
      allowStoreViewedImages: false,
      allowStoreReviews: false,
      allowStoreId: false,
    };
  }

  try {
    return JSON.parse(saved) as PrivacySettings;
  } catch {
    return {
      allowStoreViewedImages: false,
      allowStoreReviews: false,
      allowStoreId: false,
    };
  }
};
