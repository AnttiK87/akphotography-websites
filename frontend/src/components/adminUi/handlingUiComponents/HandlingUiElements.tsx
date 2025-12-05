import useNotLoggedin from "../../../hooks/useNotLoggedin.js";
import NotLoggedin from "../NotLoggedin.js";
import HandleHeroImages from "./HandleHeroImages.js";

const HandlingUiElements = () => {
  const { user } = useNotLoggedin();

  if (!user) {
    return <NotLoggedin />;
  }

  return (
    <>
      <div className="containerOP">
        <h3>Edit ui elements</h3>
        <HandleHeroImages />
      </div>
    </>
  );
};

export default HandlingUiElements;
