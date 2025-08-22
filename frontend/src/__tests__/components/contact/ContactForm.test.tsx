import { screen } from "@testing-library/react";
import { render } from "../../test-utils/customRender";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ContactForm from "../../../components/contact/ContactForm";
import { LanguageProvider } from "../../../contexts/LanguageContext";
import type { ContactForm as ContactFormType } from "../../../types/contactFormTypes";

const mockDispatch = vi.fn();
const mockSendMail = vi.fn();

vi.mock("../../../hooks/useRedux.js", () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock("../../../services/contactForm", () => ({
  __esModule: true,
  default: { sendMail: (...args: ContactFormType[]) => mockSendMail(...args) },
}));

vi.mock("../../../reducers/messageReducer", () => ({
  __esModule: true,
  default: vi.fn(() => "mockedReducer"),
  showMessage: vi.fn((message, displayTime) => ({
    type: "SHOW_MESSAGE",
    payload: message,
    timeout: displayTime,
  })),
}));

type LanguageCode = "fin" | "eng";

interface LanguageLabels {
  name: string;
  email: string;
  message: string;
  contactMe: string;
  submit: string;
  successText: string;
  errorText: string;
}

interface LanguageType {
  code: LanguageCode;
  labels: LanguageLabels;
}

const languages: LanguageType[] = [
  {
    code: "fin",
    labels: {
      name: "Nimi",
      email: "Sähköposti",
      message: "Viesti",
      contactMe: "Haluan, että minuun ollaan yhteydessä",
      submit: "Lähetä",
      successText: "Viestin lähetys onnistui!",
      errorText: "Viestin lähetys epäonnistui.",
    },
  },
  {
    code: "eng",
    labels: {
      name: "Name",
      email: "Email",
      message: "Message",
      contactMe: "I want to be contacted.",
      submit: "Send",
      successText: "Message sent successfully!",
      errorText:
        "Failed to send message. Please try again later. Error: Network error",
    },
  },
];

describe.each(languages)("ContactForm language=%s", ({ code, labels }) => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form labels correctly", () => {
    render(
      <LanguageProvider initialLanguage={code}>
        <ContactForm />
      </LanguageProvider>
    );

    expect(screen.getByLabelText(labels.name)).toBeInTheDocument();
    expect(screen.getByLabelText(labels.email)).toBeInTheDocument();
    expect(screen.getByLabelText(labels.message)).toBeInTheDocument();
    expect(screen.getByLabelText(labels.contactMe)).toBeInTheDocument();
  });

  it("submits successfully and dispatches success message", async () => {
    mockSendMail.mockResolvedValueOnce({});

    render(
      <LanguageProvider initialLanguage={code}>
        <ContactForm />
      </LanguageProvider>
    );

    await userEvent.type(screen.getByLabelText(labels.name), "Test User");
    await userEvent.type(
      screen.getByLabelText(labels.email),
      "test@example.com"
    );
    await userEvent.type(screen.getByLabelText(labels.message), "Hello!");
    await userEvent.click(screen.getByLabelText(labels.contactMe));
    await userEvent.click(screen.getByRole("button", { name: labels.submit }));

    expect(mockSendMail).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      message: "Hello!",
      contactMe: true,
      language: code,
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          text: labels.successText,
          type: "success",
        }),
      })
    );
  });

  it("dispatches error message if API call fails", async () => {
    mockSendMail.mockRejectedValueOnce(new Error("Network error"));

    render(
      <LanguageProvider initialLanguage={code}>
        <ContactForm />
      </LanguageProvider>
    );

    await userEvent.type(screen.getByLabelText(labels.name), "Error User");
    await userEvent.type(
      screen.getByLabelText(labels.email),
      "error@example.com"
    );
    await userEvent.type(screen.getByLabelText(labels.message), "Fail test");

    await userEvent.click(screen.getByRole("button", { name: labels.submit }));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          text: expect.stringContaining(labels.errorText),
          type: "error",
        }),
      })
    );
  });
});
