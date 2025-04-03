import PropTypes from "prop-types";

import { useLanguage } from "../../hooks/useLanguage";

import "./ExifExtractor.css";

const AdditionalInfo = ({ picture }) => {
  //console.log(`picture add info ${JSON.stringify(picture.keywords)}`);
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
          {new Date(picture.uploadedAt).toLocaleString(
            language === "fin" ? "fi-FI" : "en-EN"
          )}
        </div>
        <div className="additionalText">
          {language === "fin" ? "Avainsanat:" : "Key words:"}
          <div className="keywordsLB">
            {picture?.keywords?.length > 0 ? (
              picture.keywords.map((keyword, index) => (
                <div className="keywordTextLB" key={index}>
                  {keyword.keyword}
                </div>
              ))
            ) : (
              <div className="keywordTextLB">
                {language === "fin" ? "Ei avainsanoja" : "No keywords"}{" "}
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
