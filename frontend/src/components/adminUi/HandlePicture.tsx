import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux.js";
import { useNavigate } from "react-router-dom";
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

import EditPicture from "./EditPicture.js";
import StarRating from "./StarsAdmin.js";
import OrderChange from "./OrderChange.js";

import useNotLoggedin from "../../hooks/useNotLoggedin.js";
import NotLoggedin from "./NotLoggedin.js";

import { formatMonthYear } from "../../utils/dateUtils.js";

import "./HandlePicture.css";

import type { Category } from "../../types/types.js";
import type { PictureDetails } from "../../types/pictureTypes.js";
import { categoryCheck } from "../../utils/isValidType.js";
import { capitalize } from "../../utils/capitalize.js";

const HandlePictures = () => {
  const { user } = useNotLoggedin();
  const [selectedType, setSelectedType] = useState<Category>(undefined);
  const [show, setShow] = useState(false);
  const [currentPicture, setCurrentPicture] = useState<
    PictureDetails | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [typeUpdated, setTypeUpdated] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeUpdated) {
      setTypeUpdated(false);
    }
    setIsLoading(true);
    setIsError(false);

    dispatch(initializePicturesAllData())
      .then(() => setIsLoading(false))
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [dispatch, typeUpdated]);

  const allPictures = useAppSelector((state) => state.pictures.allPictures);
  const [picturesToShow, setPicturesToShow] = useState(allPictures);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let filtered = allPictures;

    if (selectedType !== undefined) {
      filtered = filtered.filter((picture) => picture.type === selectedType);
    }

    if (search.trim() !== "") {
      filtered = filtered.filter((picture) =>
        picture.keywords.some((keyword) =>
          keyword.keyword.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    setPicturesToShow(filtered);
  }, [selectedType, search, allPictures, picturesToShow]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
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

  const showOrder = selectedType !== undefined && selectedType !== "monthly";
  const maxOrder =
    selectedType != undefined && sortedPictures.length != 0
      ? Math.max(
          ...sortedPictures
            .filter((pic) => pic.type === selectedType && pic.order !== null)
            .map((pic) => pic.order as number)
        )
      : null;

  const typeCounts = sortedPictures.reduce((acc, pic) => {
    acc[pic.type] = (acc[pic.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deletePicture = (pictureId: number) => {
    if (window.confirm(`Do you really want to delete this picture?`)) {
      dispatch(removePicture(pictureId, navigate));
    }
    return;
  };

  const handleEdit = (picture: PictureDetails) => {
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
                onChange={(e) =>
                  setSelectedType(
                    categoryCheck(
                      e.target.value === "" ? undefined : e.target.value
                    )
                  )
                }
              >
                <option value="">All</option>
                <option value="birds">Birds</option>
                <option value="landscapes">Landscapes</option>
                <option value="mammals">Mammals</option>
                <option value="nature">Nature</option>
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
              {showOrder && <th className="pictureHP">Order</th>}
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
                <td colSpan={12}>Loading...</td>
              </tr>
            </tbody>
          )}
          {isError && (
            <tbody>
              <tr>
                <td colSpan={12}>Error loading pictures</td>
              </tr>
            </tbody>
          )}
          {allPictures.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={12}>No added Photos in this category</td>
              </tr>
            </tbody>
          )}
          {picturesToShow.length === 0 && allPictures.length > 0 && (
            <tbody>
              <tr>
                <td colSpan={12}>No pictures with the seached input</td>
              </tr>
            </tbody>
          )}
          {!isLoading && !isError && picturesToShow.length > 0 && (
            <tbody>
              {sortedPictures.map((picture, index) => {
                const showHeader =
                  order === "type" &&
                  selectedType === undefined &&
                  (index === 0 ||
                    sortedPictures[index - 1].type !== picture.type);

                return [
                  showHeader && (
                    <tr key={`header-${picture.type}`}>
                      <td colSpan={12} className="header-style">
                        <div className="category-header">
                          <strong>{capitalize(picture.type)}</strong>{" "}
                          <p>
                            Pictures in category: ({typeCounts[picture.type]})
                          </p>
                        </div>
                      </td>
                    </tr>
                  ),
                  <tr key={picture.id}>
                    {showOrder && (
                      <td className="vertical-center indexHP">
                        <OrderChange picture={picture} maxOrder={maxOrder} />
                      </td>
                    )}
                    <td className="vertical-center">
                      <img className="listItemImg" src={picture.urlThumbnail} />
                    </td>
                    <td className="vertical-center indexHP">{picture.id}</td>
                    <td className="vertical-center typeHP">{picture.type}</td>
                    {selectedType === "monthly" ? (
                      <td className="vertical-center monthlyHP">
                        {formatMonthYear(picture.monthYear, "eng")}
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
                        <FontAwesomeIcon
                          className="iconNoText"
                          icon={faXmark}
                        />
                      )}
                    </td>
                    <td className="vertical-center textHP">
                      {picture.text?.textEn ? (
                        <FontAwesomeIcon className="iconCheck" icon={faCheck} />
                      ) : (
                        <FontAwesomeIcon
                          className="iconNoText"
                          icon={faXmark}
                        />
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
                  </tr>,
                ];
              })}
            </tbody>
          )}
        </Table>
        <p className="countTotalHP">
          Total count: <b>{sortedPictures.length}</b>
        </p>
      </div>
      {currentPicture && (
        <EditPicture
          show={show}
          setShow={setShow}
          picture={currentPicture}
          setTypeUpdated={setTypeUpdated}
        />
      )}
    </div>
  );
};

export default HandlePictures;
