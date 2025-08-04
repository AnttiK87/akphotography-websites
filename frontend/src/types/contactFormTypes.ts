import type { Language } from "./types";

export type ContactForm = {
  contactMe: boolean;
  email: string;
  language: Language;
  message: string;
  name: string;
};

export type ContactFormResponse = {
  messageFi: string;
  messageEn: string;
};
