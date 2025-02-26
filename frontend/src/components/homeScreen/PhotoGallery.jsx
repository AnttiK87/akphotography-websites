import "./PhotoGallery.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";
import useAnimationLauncher from "../../hooks/useAnimationLauncher";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

const PhotoGallery = () => {
  const { language } = useLanguage();
  const { isVisible, elementRef } = useAnimationLauncher(0.01);

  const navigate = useNavigate();

  const [reached, setReached] = useState([false, false, false]);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      const rectTop =
        elementRef.current.getBoundingClientRect().top + window.scrollY;
      const scrollPercent =
        ((window.scrollY - rectTop) / elementRef.current.scrollHeight) * 100;

      if (scrollPercent >= 50) setReached([true, true, true]);
      else if (scrollPercent >= 35) setReached([true, true, false]);
      else if (scrollPercent >= 20) setReached([true, false, false]);
      else setReached([false, false, false]);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [elementRef]);

  const galleryItems = [
    {
      path: "/pictures/mammals",
      imgClass: "mammals",
      textFi: "Nisäkkäät",
      textEn: "Mammals",
      src: "../images/galleryCover/mammals.jpg",
      textContentFi:
        "Nisäkkäiden ja varsinkin isojen eläinten kuvaaminen on varmasti haastavinta. Eikä vähiten siksi, että niitä pääsee näkemään vain niin kovin harvoin. Ehkäpä  myös siksi jo pelkkä eläimen näkeminen on aina erityinen kokemus.",
      textContentEn:
        "Photographing mammals, especially large animals, is certainly the most challenging. Not least because they are so rarely seen. Perhaps that's also why just spotting one is always a special experience.",
    },
    {
      path: "/pictures/landscapes",
      imgClass: "landscapes",
      textFi: "Maisemat",
      textEn: "Landscapes",
      src: "../images/galleryCover/landscapes.jpg",
      textContentFi:
        "Maisemakuvaamisen suola on mielestäni se, että vaikka käyn kuinka monesti samalla paikalla kuvaamassa, niin kerta toisensa jälkeen maisema ja kuva muuttuvat ja niistä löytää yllättäen uusia piirteitä.",
      textContentEn:
        "The beauty of landscape photography, in my opinion, is that no matter how many times I visit the same location, the scenery and the photos always change, revealing new and unexpected details each time.",
    },
    {
      path: "/pictures/birds",
      imgClass: "birds",
      textFi: "Linnut",
      textEn: "Birds",
      src: "../images/galleryCover/birds.jpg",
      textContentFi:
        "Linnut kiehtovat minua selittämättömällä tavalla. Lisäksi ne ovat erityisesti lähellä sydäntäni, koska palava innostus valokuvaamiseen ja etenkin luontokuvaamiseen sai roihun sytyttäneen kipinän kohtaamisesta viirupöllön kanssa.",
      textContentEn:
        "Birds fascinate me in an inexplicable way. They are also especially close to my heart because my deep passion for photography, and particularly nature photography, was ignited by an encounter with a Ural owl.",
    },
    {
      path: "/pictures/nature",
      imgClass: "nature",
      textFi: "Luonto",
      textEn: "Nature",
      src: "../images/galleryCover/nature.jpg",
      textContentFi:
        "Luonto on ikiaikainen inspiraation lähde. Itseäni en pidä erityisen lahjakkaana taiteellisesti. Kuitenkin luontoa tarkkailemalla minäkin toisinaan saatan löytää luonnon luomaa taidetta. Sen ihastelu minulta onnistuu kyllä.",
      textContentEn:
        "Nature is an eternal source of inspiration. I don't consider myself particularly gifted artistically. However, by observing nature, I too can sometimes discover the art it creates. Admiring it is something I can certainly do.",
    },
  ];

  const galleryHeader = language === "fin" ? "Kuvagalleria" : "Photo Gallery";
  const galleryText =
    language === "fin"
      ? "Alla olevien kuvien kautta pääset kuvagalleriaani. Kuvat on jaoteltu neljään kategoriaan: linnut, nisäkkäät, maisemat ja luonto."
      : "Through the images below you can access my photo gallery. The images are divided into four categories: birds, mammals, landscapes and nature.";

  return (
    <div ref={elementRef} className="scrollContainer">
      <main className="scrollEffect">
        <FootPrints
          toesLeft={toesLeft}
          toesRight={toesRight}
          printCount={19}
          isVisible={isVisible}
        />
        <div className="containerGalleryText">
          <p className="headerGallery">{galleryHeader}</p>
          <p className="textGallery">{galleryText}</p>
        </div>
        <div className="galleryContainer">
          {galleryItems.map(
            (
              {
                path,
                imgClass,
                textFi,
                textEn,
                src,
                textContentFi,
                textContentEn,
              },
              index
            ) => {
              const isReached = reached[3 - index];
              const isFirst = reached[2 - index];

              return (
                <div
                  key={index}
                  onClick={() => navigate(path)}
                  className={`card ${imgClass} ${
                    isReached ? (index % 2 === 0 ? "hideL" : "hideR") : ""
                  } ${isFirst ? "first" : ""} ${
                    index - 3 === 0 ? "first" : ""
                  }`}
                >
                  <div className="imgAndText">
                    <img className="imgGallery" src={src} alt={imgClass} />
                    <p className="textContent">
                      {language === "fin" ? textContentFi : textContentEn}
                    </p>
                  </div>
                  <p className="textImg">
                    {language === "fin" ? textFi : textEn}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </main>
    </div>
  );
};

export default PhotoGallery;
