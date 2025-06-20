import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin } from "../../redux/actions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import logo from "/assets/img/logoSdM.png";

function MyLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const error = useSelector((state) => state.user.error);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    dispatch(fetchLogin(data.username, data.password));
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  useEffect(() => {
    if (error) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        dispatch({ type: "CLEAR_ERROR" });
      }, 5000);
    }
  }, [error]);
  return (
    <div>
      <h1 className="text-center metal-mania-regular my-4">Login</h1>
      <Form onSubmit={handleSubmit}>
        <Container>
          <Form.Label htmlFor="username" className="fw-bold">
            Username:
          </Form.Label>
          <Form.Control type="text" id="username" name="username" required />
          <Form.Label htmlFor="password" className="fw-bold mt-3">
            Password:
          </Form.Label>
          <Form.Control type="password" id="password" name="password" required />
          <Row className="mt-3">
            <Col className="d-flex justify-content-center">
              {" "}
              <Button type="submit" className="w-50">
                Login
              </Button>
            </Col>
            <Col className="d-flex justify-content-center">
              <Button className="ms-2 w-50" variant="secondary" onClick={() => navigate("/register")}>
                Registrati
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>
      <div className="d-flex justify-content-center">
        <div className="position-relative">
          <img
            src={logo}
            alt="logo"
            className="position-absolute "
            style={{ zIndex: -1, translate: "-50% -50%", maxWidth: "400px", height: "auto" }}
          />
        </div>
      </div>
      <Container>
        <Alert show={showAlert} variant="danger" className="mt-3 text-center">
          {error}
        </Alert>
      </Container>
    </div>
  );
}
export default MyLogin;
