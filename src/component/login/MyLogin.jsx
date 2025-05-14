import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin } from "../../redux/actions";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function MyLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
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
  }, [user, navigate]);
  return (
    <>
      <h1 className="text-center">Login</h1>
      <Form onSubmit={handleSubmit}>
        <Container>
          <Form.Label htmlFor="username">Username:</Form.Label>
          <Form.Control type="text" id="username" name="username" required />
          <Form.Label htmlFor="password">Password:</Form.Label>
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
    </>
  );
}
export default MyLogin;
