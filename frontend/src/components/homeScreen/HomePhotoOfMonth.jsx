import "./HomePhotOfMonth.css";

import { useLanguage } from "../../hooks/useLanguage";
import useAnimationLauncher from "../../hooks/useAnimationLauncher";

import Carouselle from "./Carouselle";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

const HomePhotoOfMonth = () => {
  const { language } = useLanguage();
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0.2);

  const headerPhotoOfMonth =
    language === "fin" ? (
      <h1 className="headerPoM">Kuukauden kuva</h1>
    ) : (
      <h1 className="headerPoM">Photo of the month</h1>
    );

  const textPhotoOfMonth =
    language === "fin" ? (
      <p lang="fi" className="textPom">
        Joka kuukausi valitsen yhden erityisen kuvan, joka on jäänyt mieleeni
        tavalla tai toisella. Se voi olla hetki, jonka onnistuin tallentamaan
        juuri oikeaan aikaan, teknisesti haastava otos tai yksinkertaisesti
        kuva, joka herättää tunteita ja muistoja.
        <br />
        <br />
        Haluan myös tarjota kurkistuksen kuvan taustoihin – missä ja miten se on
        otettu, mikä teki tilanteesta ainutlaatuisen ja mitä ajatuksia kuva
        minussa herättää. Kerron tarvittaessa myös teknisistä yksityiskohdista,
        kuten käytetystä kalustosta ja asetuksista, sekä mahdollisista
        jälkikäsittelyvaiheista.
        <br />
        <br />
        Tavoitteeni on jakaa paitsi kauniita ja mielenkiintoisia kuvia, myös
        tarinoita niiden takaa. Toivon, että tämä osio inspiroi sinua katsomaan
        ympäröivää maailmaa uusin silmin – ehkä jopa tarttumaan itse kameraan ja
        ikuistamaan omia hetkiäsi!
      </p>
    ) : (
      <p lang="en" className="textPom">
        Every month, I choose a special photo that has stayed in my mind for one
        reason or another. It could be a moment I managed to capture at just the
        right time, a technically challenging shot, or simply an image that
        evokes emotions and memories.
        <br />
        <br />
        I also want to offer a glimpse into the story behind the photo – where
        and how it was taken, what made the moment unique, and what thoughts it
        brings to mind. When relevant, I’ll also share technical details, such
        as the equipment and settings used, as well as any post-processing
        steps.
        <br />
        <br />
        My goal is to share not only beautiful and interesting images but also
        the stories behind them. I hope this section inspires you to see the
        world around you in a new way – and perhaps even pick up a camera
        yourself to capture your own special moments!
      </p>
    );

  return (
    <div ref={elementRef} className="wholeScreenPoM">
      <FootPrints
        toesLeft={toesLeft}
        toesRight={toesRight}
        printCount={19}
        isVisible={isVisible}
        className={"prints2"}
      />
      <div className="grid-containerPoM">
        <div className={`elementPoM1 ${startAnim ? "fade-in" : ""}`}>
          {headerPhotoOfMonth}
        </div>
        <div className={`elementPoM2 ${startAnim ? "fade-in" : ""}`}>
          {textPhotoOfMonth}
        </div>
        <div className={`elementPoM3 ${startAnim ? "fade-in" : ""}`}>
          <Carouselle />
        </div>
      </div>
    </div>
  );
};

export default HomePhotoOfMonth;
