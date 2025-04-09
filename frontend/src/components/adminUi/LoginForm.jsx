//dependencies
import { useSelector, useDispatch } from "react-redux";
import { setUsername, setPassword } from "../../reducers/userReducer.js";
import useLogin from "../../hooks/useLogin.js";
import { Form } from "react-bootstrap";

import "./LoginForm.css";

const LoginForm = () => {
  const dispatch = useDispatch();

  const username = useSelector((state) => state.user.username);
  const password = useSelector((state) => state.user.password);

  const reset = () => {
    dispatch(setPassword(""));
    dispatch(setUsername(""));
  };
  const { handleLogin } = useLogin();

  return (
    <div className="LoginFormContainer">
      <div className="LoginForm">
        <h2>Login to AK Photography&apos;s admin user interface</h2>

        <Form onSubmit={handleLogin}>
          <Form.Group className="form-group">
            <Form.Label htmlFor="username">Username: </Form.Label>
            <Form.Control
              id="username"
              data-testid="username"
              className="form__field loginUsername"
              type="text"
              value={username}
              onChange={(event) => dispatch(setUsername(event.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label htmlFor="password">Password: </Form.Label>
            <Form.Control
              id="password"
              data-testid="password"
              className="form__field loginPassword"
              type="password"
              value={password}
              onChange={(event) => dispatch(setPassword(event.target.value))}
              required
            />
          </Form.Group>
          <div className="commentButtons">
            <button className="button-primary" type="submit">
              Login
            </button>
            <button
              className="button-primary  delButton"
              type="button"
              onClick={() => reset()}
            >
              Clear All
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
