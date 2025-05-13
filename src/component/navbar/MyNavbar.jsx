import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import logo from "../../assets/img/logo.png";
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
    } else if (!token) {
      dispatch({ type: LOGOUT });
      navigate("/login");
    }
  }, [token, user, dispatch, navigate]);
  return (
    <>
      <Navbar expand="lg" className="bg-primary">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="logo" width="30" height="30" className="d-inline-block align-top me-2" />
            Simposio der Medallo
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" active={window.location.pathname === "/"}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard" active={window.location.pathname === "/dashboard"}>
                Dashboard
              </Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
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
                  (user?.roles || user?.appUser?.roles)?.includes("ROLE_ADMIN")
                    ? user?.username || user?.appUser?.username
                    : `${user?.nome} ${user?.cognome}`
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
        </Container>
      </Navbar>
    </>
  );
}
export default MyNavbar;
