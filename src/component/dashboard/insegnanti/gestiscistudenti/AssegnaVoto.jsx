import { useState } from "react";
import { Alert, Container, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function AssegnaVoto(props) {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [voto, setVoto] = useState("");
  const handleValutazione = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/iscrizioni/voto/${props.idCorso}/${props.idStudente}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ valutazione: voto }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message);
          });
        }
      })
      .then((data) => {
        setAlertMessage("Voto assegnato con successo");
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          props.onHide();
        }, 5000);
        if (props.setUpdate) {
          props.setUpdate((prev) => prev + 1);
        }
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
    <Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="metal-mania-regular">
          Gestisci Presenze
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => handleValutazione(e)}>
          <Form.Group className="mb-3">
            <Form.Label>Valutazione</Form.Label>
            <Form.Control type="number" value={voto} min="0" max="10" onChange={(e) => setVoto(e.target.value)} />
          </Form.Group>
          <Button variant="success" type="submit">
            Assegna
          </Button>
        </Form>
        <Container className="my-3">
          <Alert show={showAlert} variant={alertType} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
export default AssegnaVoto;
