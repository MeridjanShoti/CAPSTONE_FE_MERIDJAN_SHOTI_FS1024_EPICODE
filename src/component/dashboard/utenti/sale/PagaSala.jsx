import { useState } from "react";
import { Alert, Button, Container, Form, Modal } from "react-bootstrap";
function PagaSala(props) {
  const [numeroCarta, setNumeroCarta] = useState("");
  const [cvv, setCvv] = useState("");
  const [dataScadenza, setDataScadenza] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      new Date(dataScadenza) > new Date().setHours(0, 0, 0, 0) &&
      numeroCarta === "1111222233334444" &&
      cvv === "123"
    ) {
      fetch(`${apiUrl}/prenotazioni-sala-prove/${props.sala.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...props.body, pagata: true }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Errore nella prenotazione");
          setAlertMessage("Prenotazione effettuata con successo");
          setAlertType("success");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            props.onHide();
            setNumeroCarta("");
            setCvv("");
            setDataScadenza("");
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
    } else {
      setAlertMessage("Carta non valida");
      setAlertType("danger");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" style={{ fontFamily: "Metal Mania" }}>
          Acquista Biglietto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <h4 className="text-center metal-mania-regular my-3">{props.sala.nomeSala}</h4>
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
            <Button type="submit">Acquista</Button>
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
export default PagaSala;
