import "./HomePhotoOfMonth.css";

import { Link } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";
import useAnimationLauncher from "../../hooks/useAnimationLauncher";
import useGalleryNewIndicator from "../../hooks/useGalleryNewIndicator";
import { getPrivacySettings } from "../../utils/readPrivasySettings.js";

import { getText } from "../../utils/getText";

import Carouselle from "./Carouselle";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";
import newBadgeEn from "../../assets/newBadge-en.png";
import newBadgeFin from "../../assets/newBadge-fin.png";

import type { UiText } from "../../types/uiTextTypes";

type HomePhotoOfMonthProps = {
  texts: UiText[];
};

const HomePhotoOfMonth = ({ texts }: HomePhotoOfMonthProps) => {
  const { language } = useLanguage();
  const { allowStoreViewedImages } = getPrivacySettings();
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0.2);

  const { newImages, getNewImagesByCategory } = useGalleryNewIndicator();
  const newImagesInCategory =
    getNewImagesByCategory(newImages, "monthly").length > 0;

  const headerPhotoOfMonth =
    language === "fin" ? (
      <h1 className="headerPoM">{getText(texts, "title_pom", "fin")}</h1>
    ) : (
      <h1 className="headerPoM">{getText(texts, "title_pom", "en")}</h1>
    );

  const textPhotoOfMonth =
    language === "fin" ? (
      <p className="textPom">{getText(texts, "text_pom", "fin")}</p>
    ) : (
      <p className="textPom">{getText(texts, "text_pom", "en")}</p>
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
        {newImagesInCategory && allowStoreViewedImages && (
          <img
            className="newBadge"
            src={language === "fin" ? newBadgeFin : newBadgeEn}
            alt="newBadge"
          />
        )}
        <div className={`elementPoM1 ${startAnim ? "fade-in" : ""}`}>
          <Link className="LinkPoM" to="/pictures/monthly">
            {headerPhotoOfMonth}
          </Link>
        </div>
        <div className={`elementPoM2 ${startAnim ? "fade-in" : ""}`}>
          {textPhotoOfMonth}
        </div>
        <div className={`elementPoM3 ${startAnim ? "fade-in" : ""}`}>
          <Carouselle category={"monthly"} />
        </div>
      </div>
    </div>
  );
};

export default HomePhotoOfMonth;
