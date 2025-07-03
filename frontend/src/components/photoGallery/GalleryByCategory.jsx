import { useLanguage } from "../../hooks/useLanguage";
import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useAnimationLauncher from "../../hooks/useAnimationLauncher";
import useLightBox from "../../hooks/useLightBox";

import Carouselle from "../homeScreen/Carouselle";
import Gallery from "./Gallery";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

import "./GalleryByCategory.css";

const GalleryByCategory = () => {
  const { index, category } = useParams();
  const navigate = useNavigate();

  const {
    openLightBox,
    closeLightBox,
    currentIndex,
    lightBoxOpen,
    setCategory,
  } = useLightBox();

  useEffect(() => {
    setCategory(category);
  }, [category, setCategory]);

  const isLightBoxOpening = useRef(false);

  useEffect(() => {
    if (
      index &&
      currentIndex === undefined &&
      !lightBoxOpen &&
      !isLightBoxOpening.current
    ) {
      isLightBoxOpening.current = true;
      openLightBox(index);
    }

    if (!index && currentIndex === undefined) {
      isLightBoxOpening.current = false;
      closeLightBox();
    }
  }, [index, lightBoxOpen, openLightBox, currentIndex, closeLightBox]);

  const { language } = useLanguage();
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0);

  const TextByCategory = {
    monthly: {
      headerFi: "Kuukauden kuva",
      headerEn: "Photo of the Month",
      textContentFi: `Joka kuukausi valitsen yhden erityisen kuvan, joka on jäänyt mieleeni tavalla tai toisella. Se voi olla hetki, jonka onnistuin tallentamaan juuri oikeaan aikaan, teknisesti haastava otos tai yksinkertaisesti kuva, joka herättää tunteita ja muistoja.\n\nHaluan myös tarjota kurkistuksen kuvan taustoihin – missä ja miten se on otettu, mikä teki tilanteesta ainutlaatuisen ja mitä ajatuksia kuva minussa herättää. Kerron tarvittaessa myös teknisistä yksityiskohdista, kuten käytetystä kalustosta ja asetuksista, sekä mahdollisista jälkikäsittelyvaiheista.\n\nTavoitteeni on jakaa paitsi kauniita ja mielenkiintoisia kuvia, myös tarinoita niiden takaa. Toivon, että tämä osio inspiroi sinua katsomaan ympäröivää maailmaa uusin silmin – ehkä jopa tarttumaan itse kameraan ja ikuistamaan omia hetkiäsi!`,
      textContentEn: `Every month, I choose a special photo that has stayed in my mind for one reason or another. It could be a moment I managed to capture at just the right time, a technically challenging shot, or simply an image that evokes emotions and memories.\n\nI also want to offer a glimpse into the story behind the photo – where and how it was taken, what made the moment unique, and what thoughts it brings to mind. When relevant, I’ll also share technical details, such as the equipment and settings used, as well as any post-processing steps.\n\nMy goal is to share not only beautiful and interesting images but also the stories behind them. I hope this section inspires you to see the world around you in a new way – and perhaps even pick up a camera yourself to capture your own special moments!`,
    },
    mammals: {
      headerFi: "Nisäkkäät",
      headerEn: "Mammals",
      textContentFi: `Nisäkkäiden ja varsinkin isojen eläinten kuvaaminen on varmasti haastavinta. Eikä vähiten siksi, että niitä pääsee näkemään vain niin kovin harvoin. Ehkäpä myös siksi jo pelkkä eläimen näkeminen on aina erityinen kokemus. Isojen petoeläinten kuvaamiseen itselläni ei ole oikeastaan muita mahdollisuuksia kuin maksulliset piilokojut. Toki itse oman työn tuloksena kohdattu ja kuvattu eläin tuntuu ehkäpä enemmän ansaitulta. Silti on kyllä pakko myöntää, että mesikämmenen ihastelu suon laidalla pienestä kopista kesäyönä on myös kokemuksena vertaansa vailla.`,
      textContentEn: `Photographing mammals, especially large animals, is undoubtedly one of the most challenging tasks—not least because they are so rarely seen. Perhaps that’s also why simply spotting one always feels like a special experience. When it comes to photographing large predators, my only real option is using paid hides. Of course, encountering and capturing an animal through my own effort feels more rewarding. Still, I have to admit that watching a bear on the edge of a marsh from a small hide on a summer night is an experience like no other.`,
    },
    nature: {
      headerFi: "Luonto",
      headerEn: "Nature",
      textContentFi: `Luonto on ikiaikainen inspiraation lähde. Itseäni en pidä erityisen lahjakkaana taiteellisesti. Kuitenkin luontoa tarkkailemalla minäkin toisinaan saatan löytää luonnon luomaa taidetta. Sen ihastelu minulta onnistuu kyllä. Luonto on loputon pienien ja isompienkin ihmeiden aarreaitta erilaisine muotoineen, väreineen ja hetkineen. Hienointa tässä on, että ihastellakseen tätä taidetta täytyy vain muistaa pysähtyä, katsoa vähän tarkemmin kuin yleensä ja nauttia. Kun oivalsin tämän olen löytänyt myös itseni...monesti makaamasta mahallani maassa ja ihmettelemässä luontoa.`,
      textContentEn: `"Nature is an eternal source of inspiration. I don’t consider myself particularly gifted artistically. However, by observing nature, I too sometimes come across art created by nature itself. Admiring it is something I can certainly do. Nature is an endless treasure trove of small and grand wonders, filled with different shapes, colors, and fleeting moments. The best part is that to appreciate this art, all you need to do is pause, look a little closer than usual, and enjoy. Once I realized this, I often found myself… lying on my stomach on the ground, marveling at nature.`,
    },
    landscapes: {
      headerFi: "Maisemat",
      headerEn: "Landscapes",
      textContentFi: `Maisemakuvaamisen suola on mielestäni se, että vaikka käyn kuinka monesti samalla paikalla kuvaamassa, niin kerta toisensa jälkeen maisema ja kuva muuttuvat ja niistä löytää yllättäen uusia piirteitä. Minulle on muodostunutkin sellaisia omia suosikkipaikkoja ottaa kuvia eri kellon- ja vuodenaikoina sekä erilaisissa sääolosuhteissa. Myös tähtitaivaan kuvaaminen ja katseleminen totaalisessa pimeydessä vetää nöyräksi ja muistuttaa laittamaan asiat oikeaan mittakaavaan.`,
      textContentEn: `The beauty of landscape photography, in my opinion, is that no matter how many times I visit the same location, the scenery and the resulting image always change, unexpectedly revealing new details. Over time, I have found my own favorite spots to photograph at different times of the day and year, as well as in various weather conditions. Capturing and observing the starry sky in complete darkness is also a humbling experience, reminding me to put things into perspective.`,
    },
    birds: {
      headerFi: "Linnut",
      headerEn: "Birds",
      textContentFi: `Linnut kiehtovat minua tavalla, jota on vaikea selittää. Ne ovat erityisen lähellä sydäntäni, sillä intohimoni valokuvaukseen – ja erityisesti luontokuvaukseen – sai kipinänsä kohtaamisestani viirupöllön kanssa. Ensimmäinen viirupöllöstä ottamani kuva ei ollut millään mittarilla onnistunut. Sittemmin olen kuitenkin saanut ikuistettua monia lintukohtaamisia, jotka ovat tuoneet todellisia onnistumisen kokemuksia. Aina näin ei kuitenkaan käy. Lintujen kuvaaminen voi toisinaan olla jopa turhauttavaa, mutta juuri haastavuus on yksi niistä asioista, jotka pitävät mielenkiinnon yllä.`,
      textContentEn: `Birds fascinate me in a way that is hard to explain. They are especially close to my heart because my passion for photography – and nature photography in particular – was sparked by an encounter with a Ural owl. The first photo I took of it was far from successful. However, over time, I have managed to capture many bird encounters that have given me a true sense of accomplishment. But that’s not always the case. Photographing birds can sometimes be frustrating, yet the very challenge of it is likely one of the reasons that keeps my interest alive.`,
    },
  };

  const categorysTextData = TextByCategory[category];

  useEffect(() => {
    if (!categorysTextData) {
      navigate("/404", { replace: true });
    }
  }, [categorysTextData, navigate]);

  if (!categorysTextData) {
    return null;
  }

  const headerPhotoOfMonth = (
    <h1 className="mainHeaderGallery">
      {language === "fin"
        ? categorysTextData.headerFi
        : categorysTextData.headerEn}
    </h1>
  );

  const textPhotoOfMonth = (
    <p className="textPom">
      {language === "fin"
        ? categorysTextData.textContentFi
        : categorysTextData.textContentEn}
    </p>
  );

  return (
    <div ref={elementRef}>
      <div className="wholeScreenPoM">
        <FootPrints
          toesLeft={toesLeft}
          toesRight={toesRight}
          printCount={19}
          isVisible={isVisible}
          className={"printsGallery2"}
        />

        <div className="grid-containerPoM">
          <div className={`elementPoM1 ${startAnim ? "fade-in" : ""}`}>
            {headerPhotoOfMonth}
          </div>
          <div className={`elementPoM2 ${startAnim ? "fade-in" : ""}`}>
            {textPhotoOfMonth}
          </div>
          <div className={`elementPoM3 ${startAnim ? "fade-in" : ""}`}>
            <Carouselle category={category} />
          </div>
        </div>
        <div className="galleryDiv">
          <Gallery category={category} />
        </div>
      </div>
    </div>
  );
};

export default GalleryByCategory;
