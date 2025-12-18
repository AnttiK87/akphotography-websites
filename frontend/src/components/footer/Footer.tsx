import "./Footer.css";

import { useEffect, useState } from "react";

import useAnimationLauncher from "../../hooks/useAnimationLauncher";
import { useLanguage } from "../../hooks/useLanguage";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

type FooterProps = {
  setShowPrivacy: (value: boolean) => void;
};

const Footer = ({ setShowPrivacy }: FooterProps) => {
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0.2);
  const { language } = useLanguage();

  const [currentYear, setCurrentYear] = useState<number | undefined>(undefined);

  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
  }, [setCurrentYear]);

  if (isVisible) {
    const links = document.querySelectorAll(".social-link");
    let delay = 300;

    links.forEach((link) => {
      setTimeout(() => {
        link.classList.add("show");
      }, delay);
      delay += 500;
    });
  }

  return (
    <div ref={elementRef} className="footer">
      <FootPrints
        toesLeft={toesLeft}
        toesRight={toesRight}
        printCount={15}
        isVisible={isVisible}
      />
      <div className="footerDiv">
        <h1 className={`footerH1 ${startAnim ? "fade-in" : ""}`}>
          AK Photography
        </h1>
        <div className={`copyRight ${startAnim ? "fade-in" : ""}`}>
          © {currentYear} Antti Kortelainen <br />-{" "}
          {language === "fin"
            ? "Kuvien käyttö ilman lupaa on kielletty."
            : "Unauthorized use of images is prohibited."}
        </div>

        <div className="social">
          <div onClick={() => setShowPrivacy(true)} className="privacyLink">
            <p className="social-link">
              {language === "fin"
                ? "Muuta yksityisyys asetuksia"
                : "Change privacy settings"}
            </p>
          </div>
          <div className="linksSocial">
            <div>
              <p>
                {language === "fin"
                  ? "Seuraa minua myös sosiaalisessa mediassa!"
                  : "Follow me on social media!"}
              </p>
            </div>
            <div className="smallColumn">
              <a
                href="https://www.facebook.com/profile.php?id=100081355767265"
                title="Facebook/antti kortelainen"
                target="_blank"
                className="social-link"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/kortelainen.antti/"
                title="instagram/antti kortelainen"
                target="_blank"
                className="social-link"
              >
                Instagram
              </a>
              <a
                href="https://www.youtube.com/channel/UCfLqukGb4EkENku7V29IiGg"
                title="YouTube/antti kortelainen"
                target="_blank"
                className="social-link"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
