import "./HomeWelcome.css";

import { useLanguage } from "../../hooks/useLanguage";
import useAnimationLauncher from "../../hooks/useAnimationLauncher";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

import { getText } from "../../utils/getText";

import type { UiText } from "../../types/uiTextTypes";

type HomeWelcomeProps = {
  texts: UiText[];
};

const HomeWelcome = ({ texts }: HomeWelcomeProps) => {
  console.warn(texts);
  const { language } = useLanguage();
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0.2);

  const headerWelcome =
    language === "fin" ? (
      <>{getText(texts, "welcome_title", "fin")}</>
    ) : (
      <>{getText(texts, "welcome_title", "en")}</>
    );

  const headerWelcome2 =
    language === "fin" ? (
      <>{getText(texts, "welcome_name", "fin")}</>
    ) : (
      <>{getText(texts, "welcome_name", "en")}</>
    );

  const textWelcome =
    language === "fin" ? (
      <p className="textWelcome">{getText(texts, "welcome_text", "fin")}</p>
    ) : (
      <p className="textWelcome">{getText(texts, "welcome_text", "en")}</p>
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
            src="/uploads/images/homepage/bigger_picture.jpg"
            alt="bigger picture"
          />
        </div>
        <div className={`element2 ${startAnim ? "fade-in" : ""}`}>
          <img
            className="me"
            src="/uploads/images/homepage/smaller_picture.jpg"
            alt="smaller picture"
          />
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
