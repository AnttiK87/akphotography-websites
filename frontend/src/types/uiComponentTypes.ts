export type ResponseHomeScreenPictures = {
  count: number;
  messageFi: string;
  files: string[];
};

export type ChangePicResponse = {
  messageEn: string;
  messageFi: string;
  picture: string;
};

export type UploadFn = (formData: FormData) => Promise<ChangePicResponse>;
