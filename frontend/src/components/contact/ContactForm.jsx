import "./ContactForm.css";

import { useLanguage } from "../../hooks/useLanguage";

const ContactForm = () => {
  const { language } = useLanguage();

  const name = language === "fin" ? "Nimi" : "Name";
  const namePlaceholder = language === "fin" ? "Anna nimesi" : "Your name";

  const email = language === "fin" ? "Sähköposi" : "Email";
  const emailPlaceholder =
    language === "fin" ? "Anna sähköpostiosoiteesi" : "Your email adress";

  const message = language === "fin" ? "Viesti" : "Message";
  const messagePlaceholder =
    language === "fin"
      ? "Kirjoita viestisi tähän..."
      : "Write your message here...";

  const contactMe =
    language === "fin"
      ? "Haluan, että minuun ollaan yhteydessä"
      : "I want to be contacted.";

  const send = language === "fin" ? "Lähetä" : "Send";

  return (
    <div className="container">
      <form className="contactForm" onSubmit={() => console.log("submit")}>
        <label className="textLabel">{name}</label>
        <input
          type="text"
          id="fname"
          name="name"
          placeholder={namePlaceholder}
        />

        <label className="textLabel">{email}</label>
        <input
          type="text"
          id="Email"
          name="Email"
          placeholder={emailPlaceholder}
        />

        <label className="textLabel">{message}</label>
        <textarea
          id="message"
          name="message"
          placeholder={messagePlaceholder}
        ></textarea>

        <label className="textLabel">{contactMe}</label>
        <input
          type="checkbox"
          id="contactMe"
          name="contactMe"
          value="I want to be contacted"
        />

        <input type="submit" value={send} />
      </form>
    </div>
  );
};

export default ContactForm;
