import { useState } from "react";
import { Alert, Button, Container, Form, Modal } from "react-bootstrap";
function PagaCorsoModal(props) {
  const [numeroCarta, setNumeroCarta] = useState("");
  const [cvv, setCvv] = useState("");
  const [dataScadenza, setDataScadenza] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const handleIscrizione = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/iscrizioni/${props.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Iscrizione fallita");
        setAlertMessage("Iscrizione effettuata con successo");
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          props.setUpdate((prev) => prev + 1);
          props.onHide();
        }, 3000);
      })
      .catch((error) => {
        setAlertMessage(error.message);
        setAlertType("danger");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      });
  };
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" style={{ fontFamily: "Metal Mania" }}>
          Iscriviti al Corso
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => handleIscrizione(e)}>
          <h4 className="text-center metal-mania-regular my-3">{props.corso.nomeCorso}</h4>
          <Form.Group className="mb-3">
            <Form.Label>Numero Carta</Form.Label>
            <Form.Control
              type="number"
              value={numeroCarta}
              onChange={(e) => setNumeroCarta(e.target.value)}
              placeholder="Inserisci il numero della tua carta"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>CVV</Form.Label>
            <Form.Control
              type="number"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="Inserisci il CVV"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Data di scadenza</Form.Label>
            <Form.Control
              type="date"
              value={dataScadenza}
              onChange={(e) => setDataScadenza(e.target.value)}
              placeholder="Inserisci la data di scadenza"
              required
            />
          </Form.Group>

          <Container fluid className="d-flex justify-content-between px-0">
            <Button
              onClick={() => {
                props.onHide();
                setNumeroCarta("");
                setCvv("");
                setDataScadenza("");
              }}
            >
              Annulla
            </Button>
            <Button type="submit">Iscriviti</Button>
          </Container>
        </Form>
        {showAlert && (
          <Alert className="my-3" variant={alertType}>
            {alertMessage}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
}
export default PagaCorsoModal;
