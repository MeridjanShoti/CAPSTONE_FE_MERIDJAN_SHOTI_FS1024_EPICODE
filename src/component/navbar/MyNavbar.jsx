import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import logo from "/assets/img/logoSdM.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserDetails, LOGOUT } from "../../redux/actions";
import adminLogo from "../../assets/img/admin.png";
import "./navbar.scss";

function MyNavbar() {
  const token = useSelector((state) => state.token.token);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserDetails(token));
    } else if (!token && window.location.pathname !== "/register") {
      dispatch({ type: LOGOUT });
      navigate("/login");
    }
  }, [token, user, dispatch, navigate]);
  return (
    <>
      <Navbar expand="lg" className="bg-primary">
        <Container>
          <Navbar.Brand as={Link} to="/" className="metal-mania-regular">
            <img src={logo} alt="logo" width="30" height="30" className="d-inline-block align-top me-2" />
            Simposio der Medallo
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            {user && (
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/" active={window.location.pathname === "/"}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/dashboard" active={window.location.pathname === "/dashboard"}>
                  Dashboard
                </Nav.Link>
              </Nav>
            )}
            <div className="d-flex gap-3">
              {user ? (
                <>
                  <img
                    src={(user?.roles || user?.appUser?.roles)?.includes("ROLE_ADMIN") ? adminLogo : user?.avatar}
                    alt="logo"
                    width="30"
                    height="30"
                    className="d-inline-block align-top me-2"
                  />
                  <NavDropdown
                    title={
                      (user?.roles || user?.appUser?.roles)?.includes("ROLE_USER") ||
                      (user?.roles || user?.appUser?.roles)?.includes("ROLE_INSEGNANTE")
                        ? `${user?.nome} ${user?.cognome}`
                        : user?.username || user?.appUser?.username
                    }
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/profile">
                      Profilo
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => {
                        localStorage.removeItem("token");
                        dispatch({ type: LOGOUT });
                        navigate("/login");
                      }}
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <div className="d-flex gap-3">
                    <Nav.Link as={Link} to="/login">
                      Login
                    </Nav.Link>
                    <Nav.Link as={Link} to="/register">
                      Registrati
                    </Nav.Link>
                  </div>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
export default MyNavbar;
