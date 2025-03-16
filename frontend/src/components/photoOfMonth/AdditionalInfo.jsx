import PropTypes from "prop-types";

import { useLanguage } from "../../hooks/useLanguage";

import "./ExifExtractor.css";

const AdditionalInfo = ({ picture }) => {
  console.log(`picture add info ${JSON.stringify(picture)}`);
  const { language } = useLanguage();

  return (
    <div className="exifText">
      <div className="exifHeader">
        <h3>{language === "fin" ? "Lisätiedot:" : "Additional Info:"}</h3>
      </div>
      <div>
        <div className="additionalText">
          <b>{language === "fin" ? "Lisätty: " : "Added: "}</b>
          &nbsp;&nbsp;
          {new Date(picture.uploadedAt).toLocaleString(
            language === "fin" ? "fi-FI" : "en-EN"
          )}
        </div>
        <div className="additionalText">
          <b>{language === "fin" ? "Avainsanat:" : "Key words:"}</b>
        </div>
      </div>
    </div>
  );
};

AdditionalInfo.propTypes = {
  picture: PropTypes.object.isRequired,
};

export default AdditionalInfo;
