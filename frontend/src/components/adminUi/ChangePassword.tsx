import React from "react";
import { useAppDispatch } from "../../hooks/useRedux.js";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { changePassword } from "../../reducers/userReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { handleOverlayClose } from "../../utils/closeOverlay.js";

import "./EditPicture.css";
import "./OwnProfile.css";

type ChangePasswordProps = {
  show: boolean;
  setShow: (value: boolean) => void;
};

const ChangePassword = ({ show, setShow }: ChangePasswordProps) => {
  const dispatch = useAppDispatch();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const clear = () => {
    setOldPassword("");
    setNewPassword1("");
    setNewPassword2("");
  };

  const handleClose = () => {
    clear();
    setShow(false);
  };

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const oldPasswordValue = (
      form.elements.namedItem("oldPassword") as HTMLInputElement
    )?.value;
    const newPasswordValue1 = (
      form.elements.namedItem("newPassword1") as HTMLInputElement
    )?.value;
    const newPasswordValue2 = (
      form.elements.namedItem("newPassword2") as HTMLInputElement
    )?.value;

    const formData = {
      oldPassword: oldPasswordValue,
      newPassword1: newPasswordValue1,
      newPassword2: newPasswordValue2,
    };

    dispatch(changePassword(formData));
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
            <h3>Change password:</h3>
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
              <div className="form-group">
                <label htmlFor="oldPassword" className="form__label">
                  Old password
                </label>
                <input
                  type="password"
                  className="form__field commentUsername"
                  id="oldPassword"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                  }}
                  placeholder={"Add old password"}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword1" className="form__label">
                  New password
                </label>
                <input
                  type="password"
                  className="form__field commentUsername"
                  id="newPassword1"
                  name="newPassword1"
                  value={newPassword1}
                  onChange={(e) => {
                    setNewPassword1(e.target.value);
                  }}
                  placeholder={"Add new pasword"}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword2" className="form__label">
                  Confirm new password
                </label>
                <input
                  type="password"
                  className="form__field commentUsername"
                  id="newPassword2"
                  name="newPassword2"
                  value={newPassword2}
                  onChange={(e) => {
                    setNewPassword2(e.target.value);
                  }}
                  placeholder={"Confirm new pasword"}
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

export default ChangePassword;
