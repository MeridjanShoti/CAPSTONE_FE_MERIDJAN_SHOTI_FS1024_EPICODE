import { useState } from "react";
import { Alert, Button, Container, Form, Modal } from "react-bootstrap";

function AcquistaBiglietto(props) {
  const [numeroCarta, setNumeroCarta] = useState("");
  const [cvv, setCvv] = useState("");
  const [dataScadenza, setDataScadenza] = useState("");
  const [numeroBiglietti, setNumeroBiglietti] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("sono in handlesubmit");
    if (
      numeroCarta === "1111222233334444" &&
      cvv === "123" &&
      new Date(dataScadenza) > new Date().setHours(0, 0, 0, 0)
    ) {
      fetch(apiUrl + "/prenotazioni-eventi/" + props.evento.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          numeroBiglietti: numeroBiglietti,
        }),
      })
        .then((res) => {
          if (res.ok) {
            setAlertMessage("Biglietto acquistato con successo");
            setAlertType("success");
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
              props.onHide();
              setNumeroCarta("");
              setCvv("");
              setDataScadenza("");
              setNumeroBiglietti(1);
            }, 5000);
          } else {
            return res.json().then((errorData) => {
              throw new Error(errorData.message);
            });
          }
        })
        .catch((error) => {
          setAlertMessage(error.message + " Errore nell'acquisto del biglietto");
          setAlertType("danger");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
        });
    } else {
      alert("Carta non valida");
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
          <h4 className="text-center metal-mania-regular my-3">{props.evento.nomeEvento}</h4>
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
          <Form.Group className="mb-3">
            <Form.Label>Numero biglietti</Form.Label>
            <Form.Control
              type="number"
              value={numeroBiglietti}
              onChange={(e) => setNumeroBiglietti(e.target.value)}
              placeholder="Inserisci l'indirizzo di consegna"
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
                setNumeroBiglietti(1);
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

export default AcquistaBiglietto;
