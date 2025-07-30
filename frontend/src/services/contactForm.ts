import axios from "axios";
import type {
  ContactForm,
  ContactFormResponse,
} from "../types/contactFormTypes";

const baseUrl = "/api/contact/";

const sendMail = async (
  newObject: ContactForm
): Promise<ContactFormResponse> => {
  const response = await axios.post<ContactFormResponse>(
    `${baseUrl}`,
    newObject
  );
  return response.data;
};

export default { sendMail };
