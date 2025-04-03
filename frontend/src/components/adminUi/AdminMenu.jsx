//Navigation bar component
//dependencies
import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { Navbar, Nav } from "react-bootstrap";
import useNotLoggedin from "../../hooks/useNotLoggedin.js";

import "./AdminMenu.css";

const AdminMenu = () => {
  //get user state
  const { user } = useNotLoggedin();

  // get handleLogout
  const { handleLogout } = useLogout();

  //show login and register buttons on navbar if user is not logged in
  if (!user) {
    return (
      <Navbar className="navbarAM" collapseOnSelect expand="lg">
        <Nav className="nav-container mr-auto">
          <Nav.Link href="#" as="span">
            <Link className="TextAM">
              <h3 className="AdminLogin">
                AK Photography <br></br>admin login
              </h3>
            </Link>
          </Nav.Link>
        </Nav>
      </Navbar>
    );
  }

  //render navbar resposive navbar with bootstrap
  return (
    <Navbar className="navbarAM" collapseOnSelect expand="lg">
      <Navbar.Toggle
        className="toggleAM navbar-toggler-AM navbar-toggler-icon-AM"
        aria-controls="responsive-navbar-nav"
      />
      <Navbar.Collapse className="navAM" id="responsive-navbar-nav">
        <Nav className="nav-container mr-auto">
          <Nav.Link href="#" as="span">
            <Link className="TextAM">
              <h3 className="AdminLogin">
                AK Photography <br></br>admin UI
              </h3>
            </Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link className="TextAM LinkAM" to="/admin/editContent">
              edit content
            </Link>
          </Nav.Link>
          <Nav.Link className="LinkContainerAM" href="#" as="span">
            <Link className="TextAM LinkAM" to="/admin/uploadPictures">
              Add pictures
            </Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link className="TextAM LinkAM" to={`/admin/ownProfile`}>
              Own profile
            </Link>
          </Nav.Link>
          <div className="logoutAM">
            <div className="TextAM">{user.name} is logged in.</div>
            <Nav.Link href="#" as="span">
              <Link
                onClick={handleLogout}
                className="TextAM LinkAM"
                to={`/admin`}
              >
                Logout
              </Link>
            </Nav.Link>
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

//export
export default AdminMenu;
