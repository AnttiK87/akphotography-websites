//component for rendering form for logging in
//dependencies
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { updateUserInfo } from "../../reducers/userReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import "./EditPicture.css";
import "./OwnProfile.css";

const EditUserInfo = ({ show, setShow, user }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const clear = () => {
    setName("");
    setUsername("");
    setEmail("");
  };

  const handleOverlayClose = (event) => {
    if (event.target.id === "closeModal") {
      clear();
      setShow(false);
    }
  };

  const handleClose = () => {
    clear();
    setShow(false);
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    const nameValue = event.target.elements?.name?.value;
    const usernameValue = event.target.elements?.username?.value;
    const emailValue = event.target.elements?.email?.value;

    const formData = {
      name: nameValue,
      username: usernameValue,
      email: emailValue,
    };

    dispatch(updateUserInfo(formData));
    handleClose();
  };

  if (!show) {
    return null;
  }

  // rendering the form
  return (
    <div id="closeModal" className="editOverlay" onClick={handleOverlayClose}>
      <div id="modal" className="editKW">
        <div className="editPicture">
          <div className="mainHeaderEP">
            <h3>Edit information:</h3>
            <div onClick={() => handleClose()}>
              <FontAwesomeIcon className="CloseRatingInfo" icon={faXmark} />
            </div>
          </div>

          <Form
            onSubmit={handleChangePassword}
            encType="multipart/form-data"
            className="formContainer"
          >
            <div className="form-group  input">
              <div className="form__group input">
                <label htmlFor="name" className="form__label">
                  Name
                </label>
                <input
                  type="text"
                  className="form__field commentUsername"
                  id="name"
                  name="name"
                  value={name} // Käytetään tilamuuttujaa
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder={"Add name"}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username" className="form__label">
                  Username
                </label>
                <input
                  type="text"
                  className="form__field commentUsername"
                  id="username"
                  name="username"
                  value={username} // Käytetään tilamuuttujaa
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  placeholder={"Add username"}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form__label">
                  Email
                </label>
                <input
                  type="text"
                  className="form__field commentUsername"
                  id="email"
                  name="email"
                  value={email} // Käytetään tilamuuttujaa
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder={"Add email"}
                  required
                />
              </div>

              <div className="commentButtons">
                <button className="button-primary" type="submit">
                  Save
                </button>
                <button
                  className="button-primary  delButton"
                  type="button"
                  onClick={clear}
                >
                  Clear
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

EditUserInfo.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default EditUserInfo;
