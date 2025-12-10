import { ImageIndexProvider } from "../../contexts/ImageIndexContext";

import AboutHeader from "./AboutHeader";
import AboutContent from "./AboutContent";

import { useAppSelector } from "../../hooks/useRedux.js";
import { makeSelectTextsByScreen } from "../../reducers/selectors/uiTexts";
import { getText } from "../../utils/getText";

import { useLanguage } from "../../hooks/useLanguage";

const About = () => {
  const aboutTexts = useAppSelector(makeSelectTextsByScreen("about"));
  const { language } = useLanguage();

  const heroText =
    language === "fin"
      ? getText(aboutTexts, "hero_text_about", "fin")
      : getText(aboutTexts, "hero_text_about", "en");

  const headerAbout =
    language === "fin"
      ? getText(aboutTexts, "headerAbout", "fin")
      : getText(aboutTexts, "headerAbout", "en");

  const textAbout1 =
    language === "fin" ? (
      <p className="textAbout">{getText(aboutTexts, "textAbout1", "fin")}</p>
    ) : (
      <p className="textAbout">{getText(aboutTexts, "textAbout1", "en")}</p>
    );

  const textAbout2 =
    language === "fin" ? (
      <p className="textAbout">{getText(aboutTexts, "textAbout2", "fin")}</p>
    ) : (
      <p className="textAbout">{getText(aboutTexts, "textAbout2", "en")}</p>
    );

  const textAbout3 =
    language === "fin" ? (
      <p className="textAbout">{getText(aboutTexts, "textAbout3", "fin")}</p>
    ) : (
      <p className="textAbout">{getText(aboutTexts, "textAbout3", "en")}</p>
    );

  const pictureAbout1 = "/uploads/images/aboutpage/picture1.jpg";
  const pictureAbout2 = "/uploads/images/aboutpage/equipment.jpg";
  const pictureAbout3 = "/uploads/images/aboutpage/picture2.jpg";

  return (
    <>
      <ImageIndexProvider path="images/about">
        <AboutHeader heroText={heroText} />
      </ImageIndexProvider>
      <AboutContent
        headerAbout={headerAbout}
        textAbout={textAbout1}
        src={pictureAbout1}
        alt={"pictureAbout1"}
        classNamePrints={"prints2"}
        classNameElement={"reverse"}
      />
      <hr className="separatorLine" />
      <AboutContent
        textAbout={textAbout2}
        src={pictureAbout2}
        alt={"pictureAbout2"}
      />
      <hr className="separatorLine" />
      <AboutContent
        textAbout={textAbout3}
        src={pictureAbout3}
        alt={"pictureAbout3"}
        classNamePrints={"prints2"}
        classNameElement={"reverse"}
      />
    </>
  );
};

export default About;
