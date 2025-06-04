import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function SegnalazioneModal(props) {
  const [motivo, setMotivo] = useState("");
  const [idSegnalazione, setIdSegnalazione] = useState(props.id);
  const [tipoSegnalazione, setTipoSegnalazione] = useState(props.tipoSegnalazione);
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/segnalazioni/${idSegnalazione}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ descrizione: motivo, tipoSegnalazione: tipoSegnalazione }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore nella creazione della segnalazione");
        }
      })
      .then((data) => {
        console.log(data);
        props.onHide();
      })
      .catch((error) => {
        console.error("Errore nella creazione della segnalazione:", error);
      });
  };

  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{props.titolo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Motivo Segnalazione:</Form.Label>
            <Form.Control as="textarea" rows={3} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </Form.Group>
          <Button type="submit">Invia</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default SegnalazioneModal;
