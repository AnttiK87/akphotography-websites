import PropTypes from "prop-types";

import { useLanguage } from "../../hooks/useLanguage";

import "./ExifExtractor.css";

const AdditionalInfo = ({ picture }) => {
  const { language } = useLanguage();

  return (
    <div className="exifText">
      <div className="exifHeader">
        <h3>{language === "fin" ? "Lisätiedot:" : "Additional Info:"}</h3>
      </div>
      <div>
        <div className="additionalText">
          {language === "fin" ? "Lisätty:" : "Added:"}
          &nbsp;&nbsp;
          <b>
            {new Date(picture.uploadedAt).toLocaleString(
              language === "fin" ? "fi-FI" : "en-EN"
            )}
          </b>
        </div>
        <div className="additionalText">
          {language === "fin" ? "Avainsanat:" : "Key words:"}
          <div className="keywordsLB">
            {picture?.keywords?.length > 0 ? (
              picture.keywords.map((keyword, index) => (
                <div className="keywordTextLB" key={index}>
                  <b> #{keyword.keyword}</b>
                </div>
              ))
            ) : (
              <div className="keywordTextLB">
                <b> {language === "fin" ? "Ei avainsanoja" : "No keywords"} </b>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

AdditionalInfo.propTypes = {
  picture: PropTypes.object.isRequired,
};

export default AdditionalInfo;
