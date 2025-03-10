import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import "./Gallery.css";

import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import useMonthlyPictures from "../../hooks/useMonthlyPictures";

const Gallery = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isLoading, isError, pictures } = useMonthlyPictures(language);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading pictures</div>;
  }

  const renderPhoto = ({ photo, index }) => (
    <div key={index}>
      <div className="galleryImgText">
        <h1>{photo.title}</h1>
      </div>
    </div>
  );

  return (
    <div className="albumContainer">
      <RowsPhotoAlbum
        photos={pictures}
        targetRowHeight={150}
        rowConstraints={{ maxPhotos: 3 }}
        onClick={({ index }) => {
          navigate(`/pictures/photo-of-the-month/${index}`);
        }}
        render={{
          extras: (_, { photo, index }) => renderPhoto({ photo, index }),
        }}
      />
    </div>
  );
};

export default Gallery;
