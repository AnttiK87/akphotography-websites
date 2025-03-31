import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { initializeKeywords, removeKw } from "../../reducers/keywordReducer.js";
import useNotLoggedin from "../../hooks/useNotLoggedIn.js";
import NotLoggedin from "./NotLoggedIn.jsx";
import "./OwnProfile.css";

const OwnProfile = () => {
  const { user } = useNotLoggedin();
  console.log("user in ownproofile: ", user);
  const dispatch = useDispatch();
  const keywordsFromStore = useSelector((state) => state.keywords.keywords);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("alpha");
  const [keywords, setKeywords] = useState([]);

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
    <div className="marginAddImage">
      <h3>{user.name} own profile</h3>
      <div>
        <h4>Current admin user&apos;s information:</h4>
        <Table>
          <tr>
            <td className="vertical-start">Name:</td>
            <td>{user.name}</td>
          </tr>
          <tr>
            <td>Username:</td>
            <td>{user.username}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>Last login:</td>
            <td>{user.lastLogin}</td>
          </tr>
        </Table>
      </div>
      <div>
        <h4>Handle keywords</h4>

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
                <th>Delete</th>
              </tr>
            </thead>
            {renderTableBody()}
          </Table>
        )}
      </div>
    </div>
  );
};

export default OwnProfile;
