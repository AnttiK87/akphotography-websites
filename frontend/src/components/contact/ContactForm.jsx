import "./ContactForm.css";

import { useLanguage } from "../../hooks/useLanguage";
import contactFormService from "../../services/contactForm";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { showMessage } from "../../reducers/messageReducer";

const ContactForm = () => {
  const { language } = useLanguage();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [contactMe, setContactMe] = useState(false);

  const successText =
    language === "fin"
      ? "Viestin lähetys onnistui!"
      : "Message sent successfully!";

  const errorText =
    language === "fin"
      ? "Viestin lähetys epäonnistui. Olehyvä ja yritä myöhemmin uudelleen."
      : "Failed to send message. Please try again later.";

  const nameText = language === "fin" ? "Nimi" : "Name";
  const namePlaceholder = language === "fin" ? "Anna nimesi" : "Your name";

  const emailText = language === "fin" ? "Sähköposti" : "Email";
  const emailPlaceholder =
    language === "fin" ? "Anna sähköpostiosoiteesi" : "Your email address";

  const messageText = language === "fin" ? "Viesti" : "Message";
  const messagePlaceholder =
    language === "fin"
      ? "Kirjoita viestisi tähän..."
      : "Write your message here...";

  const contactMeText =
    language === "fin"
      ? "Haluan, että minuun ollaan yhteydessä"
      : "I want to be contacted.";

  const send = language === "fin" ? "Lähetä" : "Send";

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setContactMe(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: name,
      email: email,
      message: message,
      contactMe: contactMe,
      language: language,
    };

    try {
      await contactFormService.sendMail(formData);
      dispatch(
        showMessage(
          {
            text: successText,
            type: "success",
          },
          1
        )
      );
      reset();
    } catch (error) {
      dispatch(
        showMessage(
          {
            text: `${errorText} ${error}`,
            type: "error",
          },
          3
        )
      );
    }
  };

  return (
    <div className="container">
      <form className="contactForm" onSubmit={handleSubmit}>
        <label className="textLabel">{nameText}</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={namePlaceholder}
          required
        />

        <label className="textLabel">{emailText}</label>
        <input
          className="email-cf"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={emailPlaceholder}
          required
        />

        <label className="textLabel">{messageText}</label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={messagePlaceholder}
          required
        ></textarea>

        <label className="textLabel">{contactMeText}</label>
        <input
          type="checkbox"
          id="contactMe"
          name="contactMe"
          checked={contactMe}
          onChange={(e) => setContactMe(e.target.checked)}
        />

        <input type="submit" value={send} />
      </form>
    </div>
  );
};

export default ContactForm;
