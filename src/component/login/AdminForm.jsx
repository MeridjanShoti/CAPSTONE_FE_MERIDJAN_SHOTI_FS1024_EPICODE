import { useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function AdminForm() {
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    if (user) {
      if (!userType.includes("ROLE_ADMIN")) {
        navigate("/");
      }
    }
  }, [user, userType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${apiUrl}/register-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.text();
      })
      .then((res) => {
        setAlertMessage(res);
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/");
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage(error.message);
        setAlertType("danger");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      });
  };
  return (
    <Container>
      <h1 className="text-center my-4 metal-mania-regular">Registra un altro admin</h1>
      <p className="text-center">dovrai poi comunicare di persona le credenziali</p>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Inserisci username" onChange={(e) => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Inserisci password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {showAlert && (
        <Alert variant={alertType} className="my-3" dismissable>
          {alertMessage}
        </Alert>
      )}
    </Container>
  );
}

export default AdminForm;
