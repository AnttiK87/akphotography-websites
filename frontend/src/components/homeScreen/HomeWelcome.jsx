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
        ja mieluisia. Jokainen kuva on syntynyt luonnon helmassa – joskus pitkän
        odotuksen ja hiljaisen tarkkailun tuloksena, toisinaan taas nopean
        reaktion ja onnellisen sattuman seurauksena. Luontokuvaus on minulle
        tapa rauhoittua, oppia ja ehkäpä olla osa jotakin suurempaa. Minulle
        tärkeimmät kuvat eivät aina synny dramaattisista maisemista tai
        harvinaisista lajeista, vaan pienistä ja arkisista hetkistä, jotka
        kertovat jotain olennaista myös oman lähiluontomme kauneudesta. Toivon,
        että kuvani herättävät myös sinussa samanlaista iloa, ihastusta ja
        kunnioitusta luontoa kohtaan kuin minussa. Mukava, että piipahdit –
        sukella rauhassa mukaan luonnon kauneuteen!
      </p>
    ) : (
      <p lang="en" className="textWelcome">
        A passionate nature photography enthusiast from Leppävirta, Finland.
        This website is a small window into the world of my passion. Here you’ll
        find moments I’ve captured through the lens of my camera – a selection
        of images that I feel are successful, meaningful, and dear to me. Each
        photo has been born in the heart of nature – sometimes after long waits
        and quiet observation, other times thanks to quick reactions and happy
        coincidences. For me, nature photography is a way to slow down, to
        learn, and perhaps to be part of something greater. The images that
        matter most to me don’t always come from dramatic landscapes or rare
        species, but from small, everyday moments that reflect the beauty of the
        nature close to home. I hope my photos awaken in you the same kind of
        joy, wonder, and respect for nature that they bring to me. Thanks for
        stopping by – take your time and dive into the beauty of the natural
        world!
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
