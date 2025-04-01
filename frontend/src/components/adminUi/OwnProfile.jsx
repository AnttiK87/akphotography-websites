import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { initializeKeywords, removeKw } from "../../reducers/keywordReducer.js";
import useNotLoggedin from "../../hooks/useNotLoggedin.js";
import NotLoggedin from "./NotLoggedIn.jsx";
import EditKeyword from "./EditKeyword.jsx";
import ChangePassword from "./ChangePassword.jsx";
import EditUserInfo from "./EditUserInfo.jsx";

import "./OwnProfile.css";

const OwnProfile = () => {
  const { user } = useNotLoggedin();
  //console.log("user in own profile: ", user);
  const dispatch = useDispatch();
  const keywordsFromStore = useSelector((state) => state.keywords.keywords);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("alpha");
  const [keywords, setKeywords] = useState([]);

  const [showEditKW, setShowEditKW] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState(undefined);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeUserInfo, setShowChangeUserInfo] = useState(false);

  const userId = "admin";

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    dispatch(initializeKeywords())
      .then(() => setIsLoading(false))
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [dispatch]);

  useEffect(() => {
    setKeywords(
      search
        ? keywordsFromStore.filter((keyword) =>
            keyword.keyword.toLowerCase().includes(search.toLowerCase())
          )
        : keywordsFromStore
    );
  }, [search, keywordsFromStore]);

  const deleteKw = (keywordId) => {
    if (window.confirm("Do you really want to delete this keyword?")) {
      dispatch(removeKw({ keywordId, userId }));
    }
  };

  const handleEditKW = (keyword) => {
    setCurrentKeyword(keyword);
    setShowEditKW(true);
  };

  const sortedKeywords = [...keywords].sort((a, b) => {
    if (order === "alpha") {
      return a.keyword.localeCompare(b.keyword);
    }
    return (
      b.pictures.length - a.pictures.length ||
      a.keyword.localeCompare(b.keyword)
    );
  });

  if (!user) {
    return <NotLoggedin />;
  }

  const renderTableBody = () => {
    if (sortedKeywords.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan="5">No added keywords</td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {sortedKeywords.reduce((acc, keyword, index, sortedKeywords) => {
          if (order === "alpha") {
            const firstLetter = keyword.keyword.charAt(0).toUpperCase();
            const prevFirstLetter =
              index > 0
                ? sortedKeywords[index - 1].keyword.charAt(0).toUpperCase()
                : null;

            if (firstLetter !== prevFirstLetter) {
              acc.push(
                <tr key={`header-${firstLetter}`}>
                  <td colSpan="5" className="group-header">
                    <strong>{firstLetter}</strong>
                  </td>
                </tr>
              );
            }
          }

          acc.push(
            <tr key={keyword.id}>
              <td className="vertical-center"></td>
              <td className="vertical-center">{index + 1}</td>
              <td className="vertical-center keywordsOP">{keyword.keyword}</td>
              <td className="vertical-center UsedTimesOP">
                {keyword?.pictures.length || 0} times
              </td>
              <td className="vertical-center">
                <FontAwesomeIcon
                  className="HandleEditIcon"
                  icon={faPen}
                  onClick={() => handleEditKW(keyword)}
                />
                <FontAwesomeIcon
                  className="HandleEditIcon"
                  icon={faTrash}
                  onClick={() => deleteKw(keyword.id)}
                />
              </td>
            </tr>
          );

          return acc;
        }, [])}
      </tbody>
    );
  };

  return (
    <>
      <div className="containerOP">
        <h3>{user.name} own profile</h3>
        <div className="InfoAndKeywords">
          <div className="infoCont">
            <h4>Current admin user&apos;s information:</h4>
            <Table>
              <tr>
                <td className="vertical-start">
                  <b>Name:</b>
                </td>
                <td>{user.name}</td>
              </tr>
              <tr>
                <td>
                  <b>Username:</b>
                </td>
                <td>{user.username}</td>
              </tr>
              <tr>
                <td>
                  <b>Email:</b>
                </td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td>
                  <b>Last login:</b>
                </td>
                <td>{new Date(user.lastLogin).toLocaleString()}</td>
              </tr>
            </Table>
            <div className="EditButtonsOP">
              <button
                className="button-primary"
                onClick={() => setShowChangePassword(true)}
              >
                Change password
              </button>
              <button
                className="button-primary"
                onClick={() => setShowChangeUserInfo(true)}
              >
                Edit user info
              </button>
            </div>
          </div>
          <div className="KeywordsTableCont">
            <h4 className="HeaderHK">Handle keywords</h4>

            <div className="searchKwCont">
              <input
                className="searchKw"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search keywords"
              />
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>

            {isLoading && <div>Loading...</div>}
            {isError && <div>Error loading keywords</div>}

            {!isLoading && !isError && (
              <div className="keywordsContainerOP">
                <Table className="tableOP" responsive="md" striped>
                  <thead>
                    <tr>
                      <th></th>
                      <th>#</th>
                      <th
                        className="clikkableOP keywordsOP"
                        onClick={() => setOrder("alpha")}
                      >
                        Keyword
                      </th>
                      <th
                        className="clikkableOP UsedTimesOP"
                        onClick={() => setOrder("count")}
                      >
                        Used
                      </th>
                      <th>Edit/Delete</th>
                    </tr>
                  </thead>
                  {renderTableBody()}
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
      <EditKeyword
        show={showEditKW}
        setShow={setShowEditKW}
        keyword={currentKeyword}
      />
      <ChangePassword
        show={showChangePassword}
        setShow={setShowChangePassword}
      />
      <EditUserInfo
        show={showChangeUserInfo}
        setShow={setShowChangeUserInfo}
        user={user}
      />
    </>
  );
};

export default OwnProfile;
