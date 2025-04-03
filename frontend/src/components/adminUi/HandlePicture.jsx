import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

import { useDispatch, useSelector } from "react-redux";
import {
  removePicture,
  initializePicturesAllData,
} from "../../reducers/pictureReducer.js";

import { Form } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faCheck,
  faXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import EditPicture from "./EditPicture.jsx";
import StarRating from "./StarsAdmin.jsx";

import useNotLoggedin from "../../hooks/useNotLoggedin.js";
import NotLoggedin from "./NotLoggedin.jsx";

import "./HandlePicture.css";

const HandlePictures = () => {
  const { user } = useNotLoggedin();
  const [selectedType, setSelectedType] = useState("");
  const [show, setShow] = useState(false);
  const [currentPicture, setCurrentPicture] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // console.log(JSON.stringify(allPictures));
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    dispatch(initializePicturesAllData(selectedType))
      .then(() => setIsLoading(false))
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [dispatch, selectedType]);

  const allPictures = useSelector((state) => state.pictures.allPictures);
  const [picturesToShow, setPicturesToShow] = useState([allPictures]);
  const [search, setSearch] = useState("");
  //console.log(`allPictures: ${JSON.stringify(picturesToShow)}`);

  useEffect(() => {
    setPicturesToShow(
      search
        ? allPictures.filter((picture) =>
            picture.keywords.some((keyword) =>
              keyword.keyword.toLowerCase().includes(search.toLowerCase())
            )
          )
        : allPictures
    );
  }, [search, allPictures]);

  useEffect(() => {
    if (show) {
      // Estä scrollaus
      document.body.style.overflow = "hidden";
    } else {
      // Palauta scrollaus
      document.body.style.overflow = "auto";
    }

    // Siivoa efekti, kun komponentti poistetaan
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  const [order, setOrder] = useState("type");

  const sortedPictures = [...picturesToShow].sort((a, b) => {
    if (order === "comments") {
      return (
        (b.comments?.reduce(
          (sum, comment) => sum + 1 + comment.replies.length,
          0
        ) || 0) -
        (a.comments?.reduce(
          (sum, comment) => sum + 1 + comment.replies.length,
          0
        ) || 0)
      );
    } else if (order === "ratings") {
      return (b?.ratings.length || 0) - (a?.ratings.length || 0);
    } else if (order === "keywords") {
      return (b?.keywords.length || 0) - (a?.keywords.length || 0);
    } else if (order === "views") {
      return (b?.viewCount || 0) - (a?.viewCount || 0);
    } else {
      return 0;
    }
  });

  const deletePicture = (pictureId) => {
    if (window.confirm(`Do you really want to delete this picture?`)) {
      dispatch(removePicture(pictureId));
    }
    return;
  };

  const handleEdit = (picture) => {
    setCurrentPicture(picture);
    setShow(true);
  };

  if (!user) {
    return <NotLoggedin />;
  }

  return (
    <div className={`editImageContainer ${show ? "disableScroll" : ""}`}>
      <div className="marginAddImage">
        <h3>Edit pictures</h3>
        <Form encType="multipart/form-data">
          <div className="typeAndSearchHP">
            <div className="form__group input">
              <label htmlFor="type" className="form__label">
                Select type
              </label>
              <select
                className="form__field SelectTypeHP"
                id="type"
                name="type"
                required
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All</option>
                <option value="nature">Nature</option>
                <option value="birds">Birds</option>
                <option value="landscapes">Landscapes</option>
                <option value="mammals">Mammals</option>
                <option value="monthly">Monthly Picture</option>
              </select>
            </div>
            <div className="searchKwCont">
              <input
                className="searchKw"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search"
              />
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
          </div>
        </Form>
        <Table className="tableHP" responsive="lg" striped>
          <thead>
            <tr>
              <th className="pictureHP">Picture</th>
              <th className="indexHP">#</th>
              <th
                className="clikkableOP typeHP"
                onClick={() => setOrder("type")}
              >
                Type
              </th>
              {selectedType === "monthly" ? (
                <th className="monthlyHP">PoM</th>
              ) : null}
              <th
                className="clikkableOP keywordsHP"
                onClick={() => setOrder("views")}
              >
                views
              </th>
              <th
                className="clikkableOP ratingsHP"
                onClick={() => setOrder("ratings")}
              >
                Ratings
              </th>
              <th
                className="clikkableOP commentsHP"
                onClick={() => setOrder("comments")}
              >
                Comments
              </th>
              <th
                className="clikkableOP keywordsHP"
                onClick={() => setOrder("keywords")}
              >
                Keywords
              </th>
              <th className="textHP">Fi text</th>
              <th className="textHP">En text</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          {isLoading && (
            <tbody>
              <tr>
                <td colSpan="10">Loading...</td>
              </tr>
            </tbody>
          )}
          {isError && (
            <tbody>
              <tr>
                <td colSpan="10">Error loading pictures</td>
              </tr>
            </tbody>
          )}
          {allPictures.length === 0 && (
            <tbody>
              <tr>
                <td colSpan="10">No added Photos in this category</td>
              </tr>
            </tbody>
          )}
          {picturesToShow.length === 0 && (
            <tbody>
              <tr>
                <td colSpan="10">No pictures with the seached input</td>
              </tr>
            </tbody>
          )}
          {!isLoading && !isError && picturesToShow.length > 0 && (
            <tbody>
              {sortedPictures.map((picture, index) => (
                <tr key={picture.id}>
                  <td className="vertical-center">
                    <img className="listItemImg" src={picture.url} />
                  </td>
                  <td className="vertical-center indexHP">{index + 1}</td>
                  <td className="vertical-center typeHP">{picture.type}</td>
                  {selectedType === "monthly" ? (
                    <td className="vertical-center monthlyHP">
                      {picture.month_year}
                    </td>
                  ) : null}
                  <td className="vertical-center keywordsHP">
                    {picture.viewCount || 0}
                  </td>
                  <td className="vertical-center ratingsHP">
                    <div className="HPStarsAndCount">
                      <StarRating ratings={picture?.ratings || []} />{" "}
                      <p className="ratingsLenghtHP">
                        ({picture.ratings?.length || 0})
                      </p>
                    </div>
                  </td>
                  <td className="vertical-center commentsHP">
                    {picture.comments?.reduce(
                      (sum, comment) => sum + 1 + comment.replies.length,
                      0
                    ) || 0}
                  </td>
                  <td className="vertical-center keywordsHP">
                    {picture.keywords?.length || 0}
                  </td>
                  <td className="vertical-center textHP">
                    {picture.text?.textFi ? (
                      <FontAwesomeIcon className="iconCheck" icon={faCheck} />
                    ) : (
                      <FontAwesomeIcon className="iconNoText" icon={faXmark} />
                    )}
                  </td>
                  <td className="vertical-center textHP">
                    {picture.text?.textEn ? (
                      <FontAwesomeIcon className="iconCheck" icon={faCheck} />
                    ) : (
                      <FontAwesomeIcon className="iconNoText" icon={faXmark} />
                    )}
                  </td>
                  <td className="vertical-center">
                    <div className="HandleEditIcons">
                      <FontAwesomeIcon
                        className="HandleEditIcon"
                        icon={faPen}
                        onClick={() => handleEdit(picture)}
                      />
                      <FontAwesomeIcon
                        className="HandleEditIcon"
                        icon={faTrash}
                        onClick={() => deletePicture(picture.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
        <p className="countTotalHP">
          Total count: <b>{sortedPictures.length}</b>
        </p>
      </div>
      <EditPicture show={show} setShow={setShow} picture={currentPicture} />
    </div>
  );
};

export default HandlePictures;
