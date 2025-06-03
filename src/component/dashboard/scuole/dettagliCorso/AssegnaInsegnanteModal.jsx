import { useEffect, useState } from "react";
import { Alert, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function AssegnaInsegnanteModal(props) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const [insegnanti, setInsegnanti] = useState([]);
  const [insegnante, setInsegnante] = useState(props?.insegnante?.id || "");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(apiUrl + "/corsi/assegna-insegnante/" + props?.id + "/" + insegnante, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("errore nell'aggiornamento dell'insegnante");
        }
      })
      .then((data) => {
        props.setUpdate((prev) => prev + 1);
        setAlertMessage("Insegnante assegnato con successo");
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          props.onHide();
        }, 2000);
      })
      .catch((error) => {
        setAlertMessage(error.message);
        setAlertType("danger");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      });
  };
  useEffect(() => {
    fetch(apiUrl + "/insegnanti", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("errore nel recupero degli insegnanti");
        }
      })
      .then((data) => {
        setInsegnanti(data);
        if (insegnante === "" || !insegnante) {
          setInsegnante(data[0]?.id);
        }
      });
  }, []);
  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="metal-mania-regular">
          Assegna Insegnante
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Select value={insegnante} onChange={(e) => setInsegnante(e.target.value)}>
            {insegnanti &&
              insegnanti.map((insegnante) => {
                return (
                  <option key={insegnante?.id} value={insegnante?.id}>
                    {insegnante.nome} {insegnante.cognome}
                  </option>
                );
              })}
          </Form.Select>
          <Button type="submit" className="my-3">
            Assegna Insegnante
          </Button>
        </Form>
        {showAlert && (
          <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AssegnaInsegnanteModal;
