import useNotLoggedin from "../../../hooks/useNotLoggedin.js";
import NotLoggedin from "../NotLoggedin.js";
import { useUpload } from "../../../hooks/useUpload.js";
import HandleHeroImages from "./HandleHeroImages.js";
import UploadOverlay from "../uploadOverlay.js";

const HandlingUiElements = () => {
  const { user } = useNotLoggedin();
  const { upload, progress, ms } = useUpload();

  if (!user) {
    return <NotLoggedin />;
  }

  return (
    <>
      <div className="containerOP">
        <h3>Edit ui elements</h3>
        <HandleHeroImages upload={upload} />
        <UploadOverlay progress={progress} ms={ms} />
      </div>
    </>
  );
};

export default HandlingUiElements;
