import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import "./Gallery.css";

import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import usePicturesByCategory from "../../hooks/usePicturesByCategory";

const Gallery = ({ category }) => {
  const navigate = useNavigate();

  const location = useLocation();

  // console.log(`path: ${location.pathname.replace(/\/\d+$/, "")}`);

  const basePath = location.pathname.replace(/\/\d+$/, "");

  const { isLoading, isError, picturesByCategory } =
    usePicturesByCategory(category);

  /*console.log(
    `pictures lenght: ${JSON.stringify(
      picturesByCategory.length
    )} AND ${JSON.stringify(picturesByCategory)}`
  );*/

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading pictures</div>;
  }

  const renderPhoto = ({ photo, index }) => (
    <div key={index}>
      <div className={category === "monthly" ? "galleryImgText" : ""}>
        <h1>{photo.title}</h1>
      </div>
    </div>
  );

  return (
    <div className="albumContainer">
      <RowsPhotoAlbum
        photos={picturesByCategory}
        targetRowHeight={100}
        rowConstraints={{ maxPhotos: 3 }}
        onClick={({ index }) => {
          sessionStorage.setItem("scrollPosition", window.scrollY);
          navigate(`${basePath}/${index}`, {
            state: { from: location.pathname },
          });
        }}
        render={{
          extras: (_, { photo, index }) => renderPhoto({ photo, index }),
        }}
      />
    </div>
  );
};

Gallery.propTypes = {
  category: PropTypes.string.isRequired,
};

export default Gallery;
