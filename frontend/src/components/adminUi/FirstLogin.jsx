import { useDispatch } from "react-redux";
import { useState } from "react";
import useLogin from "../../hooks/useLogin.js";
import useLogout from "../../hooks/useLogout.js";
import { Form } from "react-bootstrap";
import { updateUser } from "../../reducers/userReducer";
import { showMessage } from "../../reducers/messageReducer";
import userService from "../../services/users";

import "./FirstLogin.css";

const FirstLogin = () => {
  const { firstLogin, hangleFirstLogin } = useLogin();
  const { handleCancelLogin } = useLogout();

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const reset = () => {
    setName("");
    setUsername("");
    setEmail("");
    setNewPassword1("");
    setNewPassword2("");
  };

  const close = () => {
    reset();
    hangleFirstLogin(false);
    handleCancelLogin();
  };

  const handleUserInfoChange = async (event) => {
    event.preventDefault();

    const nameValue = event.target.elements?.name?.value;
    const usernameValue = event.target.elements?.username?.value;
    const emailValue = event.target.elements?.email?.value;
    const newPasswordValue1 = event.target.elements?.newPassword1?.value;
    const newPasswordValue2 = event.target.elements?.newPassword2?.value;

    const formData = {
      name: nameValue,
      username: usernameValue,
      email: emailValue,
      password: newPasswordValue1,
      passwordConfirmation: newPasswordValue2,
    };

    try {
      const newUser = await userService.updateFirstLogin(formData);
      dispatch(updateUser(newUser));

      dispatch(
        showMessage(
          {
            text: `Welcome ${newUser.name}!`,
            type: "success",
          },
          5
        )
      );

      reset();
      hangleFirstLogin(false);
    } catch (error) {
      let errorMessage = "Unknown error occurred.";
      console.error("Error updating user info:", error);

      if (error.response.data.messages) {
        errorMessage = error.response.data.messages[0].message;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      dispatch(
        showMessage(
          {
            text: `Failed to change user info ${errorMessage}`,
            type: "error",
          },
          5
        )
      );
    }
  };

  if (!firstLogin) {
    return null;
  }

  return (
    <div className="FirstLoginContainer">
      <div className="FirstLoginForm">
        <h2>Welcome to AK Photography</h2>
        <h5>Now set your information to proseed</h5>

        <Form
          onSubmit={handleUserInfoChange}
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
                autoComplete="username"
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
                autoComplete="email"
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

            <div className="form-group">
              <label htmlFor="newPassword1" className="form__label">
                New password
              </label>
              <input
                autoComplete="new-password"
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
                autoComplete="new-password"
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
                onClick={() => close()}
              >
                Close
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default FirstLogin;
