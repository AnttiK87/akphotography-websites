import { useState, useRef, useEffect, useMemo } from "react";
import { RowsPhotoAlbum, type Photo } from "react-photo-album";
import { useLocation } from "react-router-dom";
import "react-photo-album/rows.css";

import "./Gallery.css";

import usePicturesByCategory from "../../hooks/usePicturesByCategory";
import useLightBox from "../../hooks/useLightBox";
import useWindowWidth from "../../hooks/useWindowWidth";

import useGalleryNewIndicator from "../../hooks/useGalleryNewIndicator";

import newBadgeSmall from "../../assets/newBadge-small.png";

import type { Category } from "../../types/types";

type GalleryProps = {
  category: Category;
};

type GalleryPhoto = Photo & {
  id: number;
};

const Gallery = ({ category }: GalleryProps) => {
  const location = useLocation();
  const width = useWindowWidth();

  const [page, setPage] = useState(1);
  const [allLoaded, setAllLoaded] = useState(false);
  const [photoAlbums, setPhotoAlbums] = useState<GalleryPhoto[][]>([]);
  const observerRef = useRef(null);

  const { newImages, getNewImagesByCategory } = useGalleryNewIndicator();
  const newImagesInCategory = getNewImagesByCategory(newImages, category);

  const unviewedIdSet = useMemo(
    () => new Set(newImagesInCategory.map((img) => img.id)),
    [newImagesInCategory]
  );

  const { isLoading, isError, picturesByCategory } =
    usePicturesByCategory(category);
  const { openLightBox, setCurrentIndex } = useLightBox();

  useEffect(() => {
    setPage(1);
    setPhotoAlbums([]);
    setAllLoaded(false);
  }, [category]);

  useEffect(() => {
    const start = (page - 1) * 6;
    var end = start + 6;
    if (picturesByCategory.length - end === 1) {
      end = start + 7;
    } else if (picturesByCategory.length - end === 2) {
      end = start + 8;
    }
    const newPhotos = picturesByCategory.slice(start, end);

    if (newPhotos.length > 0 && page === 1) {
      setPhotoAlbums([newPhotos]);
    } else if (newPhotos.length > 0) {
      setPhotoAlbums((prevAlbums) => [...prevAlbums, newPhotos]);
    }

    if (picturesByCategory.length === end) {
      setAllLoaded(true);
    }
  }, [page, picturesByCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !allLoaded) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoading, allLoaded]);

  const handleOpenLightbox = (index: number) => {
    const basePath = location.pathname.replace(/\/\d+$/, "");
    openLightBox(index);
    setCurrentIndex(index);
    window.history.pushState({ lightBox: true }, "", `${basePath}/${index}`);
  };

  if (isLoading && page === 1) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading pictures</div>;
  }

  const renderPhoto = (photo: GalleryPhoto, index: number) => {
    const isUnviewed = unviewedIdSet.has(photo.id);

    return (
      <div key={index} className="photoWrapper">
        <div className={category === "monthly" ? "galleryImgText" : "hideText"}>
          <h1 className="GalleryPhotoHeader">{photo.title}</h1>
        </div>
        {isUnviewed && (
          <img className="newBadgeSmall" src={newBadgeSmall} alt="newBadge" />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="albumContainer">
        {photoAlbums.map((album, albumIndex) => (
          <RowsPhotoAlbum
            key={albumIndex}
            photos={album}
            rowConstraints={{
              maxPhotos: width < 600 ? 1 : width < 900 ? 2 : 3,
            }}
            onClick={({ index }) => {
              const globalIndex = albumIndex * 6 + index;
              handleOpenLightbox(globalIndex);
            }}
            render={{
              extras: (_, { photo, index }) => renderPhoto(photo, index),
            }}
          />
        ))}
        <div
          ref={observerRef}
          style={{ height: "20px", background: "transparent" }}
        />
      </div>
    </>
  );
};

export default Gallery;
