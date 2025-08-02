//dependencies
import React from "react";
import { useAppDispatch } from "../../hooks/useRedux.js";
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { updateUserInfo } from "../../reducers/userReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { handleOverlayClose } from "../../utils/closeOverlay.js";

import "./EditPicture.css";
import "./OwnProfile.css";

import type { User } from "../../types/userTypes";
import type { LoginResponse } from "../../types/loginTypes.js";

type EditUserInfoProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  user: User | LoginResponse;
};

const EditUserInfo = ({ show, setShow, user }: EditUserInfoProps) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  useEffect(() => {
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email);
  }, [show, user]);

  const clear = () => {
    setName("");
    setUsername("");
    setEmail("");
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const nameValue = (form.elements.namedItem("name") as HTMLInputElement)
      ?.value;
    const usernameValue = (
      form.elements.namedItem("username") as HTMLInputElement
    )?.value;
    const emailValue = (form.elements.namedItem("email") as HTMLInputElement)
      ?.value;

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

  return (
    <div
      id="closeModal"
      className="editOverlay"
      onMouseDown={(event) => handleOverlayClose(event, handleClose)}
    >
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
                  value={name}
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
                  value={username}
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
                  value={email}
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

export default EditUserInfo;
