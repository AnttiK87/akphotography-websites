import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Tuodaan PropTypes

// Luo LanguageContext
const LanguageContext = createContext();

// LanguageProvider-komponentti
export const LanguageProvider = ({ children }) => {
  // Haetaan kieli localStoragesta tai asetetaan oletuskieleksi "fin"
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "fin"
  );

  // Kielivalinta tallennetaan localStorageen, jos se muuttuu
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// PropTypes tarkistus
LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired, // Tarkistetaan, että children on validi React-elementti
};

export default LanguageContext;
