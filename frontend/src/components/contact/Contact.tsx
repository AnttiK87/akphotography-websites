import { ImageIndexProvider } from "../../contexts/ImageIndexContext";

import ContactHeader from "./ContactHeader";
import ContactContent from "./ContactContent";

const Contact = () => {
  return (
    <>
      <ImageIndexProvider path="images/contact">
        <ContactHeader />
      </ImageIndexProvider>

      <ContactContent />
    </>
  );
};

export default Contact;
