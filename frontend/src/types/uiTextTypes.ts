export type UiText = {
  id: number;
  key_name: string;
  screen: string;
  language: string;
  content: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export type UiTextResponse = {
  messageEn: string;
  messageFi: string;
  uiText: UiText;
};

export type UpdateUiText = {
  id: number;
  content: string;
};
