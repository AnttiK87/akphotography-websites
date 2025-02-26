import "./HomeWelcome.css";

import { useLanguage } from "../../hooks/useLanguage";
import useAnimationLauncher from "../../hooks/useAnimationLauncher";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

const HomeWelcome = () => {
  const { language } = useLanguage();
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0.2);

  const headerWelcome = language === "fin" ? <>Tervehdys!</> : <>Welcome!</>;

  const headerWelcome2 =
    language === "fin" ? (
      <>Olen Antti Kortelainen,</>
    ) : (
      <>I&#39;m Antti Kortelainen,</>
    );

  const textWelcome =
    language === "fin" ? (
      <p lang="fi" className="textWelcome">
        Innokas luontokuvauksen harrastaja Leppävirralta. Tämä sivusto on pieni
        ikkuna intohimoni maailmaan. Pääset mukaan tarkastelemaan hetkiä, jotka
        olen saanut vangittua kamerani linssin läpi. Olen koonnut tänne
        valikoiman kuvia, jotka ovat mielestäni onnistuneita, merkityksellisiä
        ja mieluisia. Toivon, että ne herättävät myös sinussa samanlaista iloa,
        ihastusta ja kunnioitusta luontoa kohtaan kuin minussa. Mukava, että
        piipahdit – sukella rauhassa mukaan luonnon kauneuteen!
      </p>
    ) : (
      <p lang="en" className="textWelcome">
        A passionate nature photography enthusiast from Leppävirta, Finland.
        This site offers a small window into my world of inspiration. You&#39;ll
        get a chance to witness moments I&#39;ve captured through the lens of my
        camera. I&#39;ve carefully curated a selection of images that I find
        meaningful, successful, and dear to me. I hope they spark in you the
        same joy, admiration, and respect for nature as they do in me. I&#39;m
        glad you stopped by – take your time and immerse yourself in the beauty
        of nature!
      </p>
    );

  return (
    <div ref={elementRef} className="wholeScreen2">
      <FootPrints
        toesLeft={toesLeft}
        toesRight={toesRight}
        printCount={19}
        isVisible={isVisible}
        className={"prints2"}
      />
      <div className="grid-container">
        <div className={`element1 ${startAnim ? "fade-in" : ""}`}>
          <img
            className="bird-fly"
            src="../../images/homepage/great-tit-fly.jpg"
            alt="bird-fly"
          />
        </div>
        <div className={`element2 ${startAnim ? "fade-in" : ""}`}>
          <img className="me" src="../images/homepage/me.jpg" alt="me" />
        </div>
        <div className={`element3 ${startAnim ? "fade-in" : ""}`}>
          <h1 className="headerWelcome">{headerWelcome}</h1>
          <h3 className={`headerWelcome2 ${startAnim ? "fade-in" : ""}`}>
            {headerWelcome2}
          </h3>
        </div>
        <div className={`element4 ${startAnim ? "fade-in" : ""}`}>
          {textWelcome}
        </div>
      </div>
    </div>
  );
};

export default HomeWelcome;
