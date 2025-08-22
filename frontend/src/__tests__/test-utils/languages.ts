export type LanguageCode = "fin" | "eng";

export interface LanguageLabels {
  header: string;
  header2: string;
  header3: string;
  username: string;
  comment: string;
  reply: string;
  submit: string;
  submit2: string;
  submit3: string;
  clear: string;
}

export interface LanguageType {
  code: LanguageCode;
  labels: LanguageLabels;
}

export const languages: LanguageType[] = [
  {
    code: "fin",
    labels: {
      header: "Lisää kommentti",
      header2: "Muokkaa kommenttia",
      header3: "Vastaa käyttäjän test user kommenttiin",
      username: "Nimimerkki",
      comment: "Kommentti",
      reply: "Vastaus",
      submit: "Kommentoi",
      submit2: "Muokkaa",
      submit3: "Vastaa",
      clear: "Tyhjennä",
    },
  },
  {
    code: "eng",
    labels: {
      header: "Add Comment",
      header2: "Edit Comment",
      header3: "Reply to the user's test user comment",
      username: "Username",
      comment: "Comment",
      reply: "Reply",
      submit: "Add Comment",
      submit2: "Edit",
      submit3: "Reply",
      clear: "Clear All",
    },
  },
];
