import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function AcquistaBiglietto(props) {
  const [numeroCarta, setNumeroCarta] = useState("");
  const [cvv, setCvv] = useState("");
  const [dataScadenza, setDataScadenza] = useState("");
  const [numeroBiglietti, setNumeroBiglietti] = useState(1);
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
      fetch("http://localhost:8080/api/acquistaBiglietto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numeroCarta: numeroCarta,
          cvv: cvv,
          dataScadenza: dataScadenza,
          numeroBiglietti: numeroBiglietti,
          idEvento: props.evento.id,
        }),
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Annulla</Button>
        <Button onClick={handleSubmit}>Acquista</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AcquistaBiglietto;
