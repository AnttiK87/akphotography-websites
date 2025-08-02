export type Language = "fin" | "eng";

export type Category =
  | "monthly"
  | "birds"
  | "nature"
  | "mammals"
  | "landscapes"
  | undefined;

export type ValidCategory =
  | "monthly"
  | "birds"
  | "nature"
  | "mammals"
  | "landscapes";

export type Type = "monthly" | "birds" | "nature" | "mammals" | "landscapes";

export type DeleteResponse = {
  message: string;
};

export type DeleteResponseDualLang = {
  messageEn: string;
  messageFi: string;
};
