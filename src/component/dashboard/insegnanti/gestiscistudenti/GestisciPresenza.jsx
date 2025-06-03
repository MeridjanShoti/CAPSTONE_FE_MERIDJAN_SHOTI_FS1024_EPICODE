import { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function GestisciPresenza(props) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const handlePresenza = (isPresente) => {
    fetch(`${import.meta.env.VITE_API_URL}/iscrizioni/presenze/${props.idCorso}/${props.idStudente}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ isPresente: isPresente }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message);
          });
        }
      })
      .then((data) => {
        setAlertMessage("Presenza assegnata con successo");
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          props.onHide();
        }, 3000);
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
    <Modal show={props.show} onHide={props.onHide} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="metal-mania-regular">
          Gestisci Presenze
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center my-3 gap-3">
          <Button
            variant="success"
            onClick={() => {
              handlePresenza(true);
            }}
          >
            Presente
          </Button>

          <Button
            variant="danger"
            onClick={() => {
              handlePresenza(false);
            }}
          >
            Assente
          </Button>
        </div>
        {showAlert && (
          <Container className="my-3">
            <Alert variant={alertType}>{alertMessage}</Alert>
          </Container>
        )}
      </Modal.Body>
    </Modal>
  );
}
export default GestisciPresenza;
