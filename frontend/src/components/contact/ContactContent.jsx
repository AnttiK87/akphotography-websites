import "./ContactContent.css";

import { useLanguage } from "../../hooks/useLanguage";
import useAnimationLauncher from "../../hooks/useAnimationLauncher";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

import birdWhite from "../../assets/bird.png";
import leaf from "../../assets/leaf.png";

import ContactForm from "./ContactForm";

const ContactContent = () => {
  const { language } = useLanguage();
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0.3);

  const headerContact =
    language === "fin"
      ? "Jäikö jokin askarruttamaan?"
      : "Did anything leave you curious?";

  const socialIcons = (
    <div className="socialIcons">
      <a
        href="https://www.facebook.com/profile.php?id=100081355767265"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faFacebook} size="2x" />
      </a>
      <a
        href="https://www.instagram.com/kortelainen.antti/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faInstagram} size="2x" />
      </a>
    </div>
  );

  const textContact1 =
    language === "fin"
      ? "Mikäli haluat tietää lisää ota yhteyttä:"
      : "If you want to know more contact me:";
  const textContact2 =
    language === "fin" ? "Harrastevalokuvaaja" : "Hobbyist photographer";
  const textContact3 =
    language === "fin"
      ? "Voit myös lähettää viestin minulle oheisella yhteydenottolomakkeella."
      : "You can also send me a message using the contact form provided.";

  const textContact = (
    <div className="contactTextElem">
      <h3 className="headerMore">{textContact1}</h3>
      <h3 className="headerName">Antti Kortelainen</h3>
      <p className="textContact">{textContact2}</p>
      <p className="textContact">anttikortelainenphotography(at)gmail.com</p>
      {socialIcons}
      <p className="textContact">{textContact3}</p>
    </div>
  );

  return (
    <div ref={elementRef} className="wholeScreenContact">
      <FootPrints
        toesLeft={toesLeft}
        toesRight={toesRight}
        printCount={15}
        isVisible={isVisible}
        className={"prints2"}
      />
      <h1 className={`headerContact ${startAnim ? "fade-in" : ""}`}>
        {headerContact}
      </h1>
      <div className="grid-container-contact">
        <div className={`elementContact1 ${startAnim ? "fade-in" : ""}`}>
          <img className="birdContact" src={birdWhite} alt={`whiteBird`} />
          {textContact}
          <img className="leafContact" src={leaf} alt={`leaf`} />
        </div>
        <div className="elementContact2">
          <ContactForm />
          <img className="birdContact2" src={birdWhite} alt={`whiteBird`} />
          <img className="leafContact2" src={leaf} alt={`leaf`} />
        </div>
      </div>
    </div>
  );
};

export default ContactContent;
