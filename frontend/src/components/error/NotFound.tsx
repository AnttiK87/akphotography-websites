import { useLanguage } from "../../hooks/useLanguage";
import "./NotFound.css";

const NotFound = () => {
  const { language } = useLanguage();

  const headerError =
    language === "fin"
      ? "404 - HUPS, jokin meni pieleen!"
      : "404 - Oh no, something went wrong!";
  const textError =
    language === "fin"
      ? "Valitettavasti etsimääsi sivua ei ole olemassa. Tarkista osoite tai palaa takaisin etusivulle."
      : "Unfortunately, the page you are looking for does not exist. Please check the address or return to the homepage.";

  return (
    <div className="wholeScreenError">
      <div className="errorImgContainer">
        <img className="errorImg" src="/images/error/ohmy.jpg" alt="error" />
      </div>
      <div className="errorText">
        <h1>{headerError}</h1>
        <p>{textError}</p>
      </div>
    </div>
  );
};

export default NotFound;
