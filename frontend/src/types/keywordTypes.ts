export type KeywordPicture = {
  id: number;
};

export type Keyword = {
  id: number;
  keyword: string;
  pictures: KeywordPicture[];
};

export type KeywordUpdate = {
  keywordId: number;
  formData: { keyword: string };
};

export type KeywordDelete = {
  keywordId: number;
};

export type KeywordUpdateResponse = {
  messageFi: string;
  messageEn: string;
  keyword: Keyword;
};
