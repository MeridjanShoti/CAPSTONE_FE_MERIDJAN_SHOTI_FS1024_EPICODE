import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function DettagliStudente(props) {
  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.studente.utente.cognome} {props.studente.utente.nome}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className="d-flex flex-column align-items-center">
            <h4 className="metal-mania-regular my-3 text-center">Presenze:</h4>
            <p className="text-center fw-bold">
              {(
                (props.studente?.presenze.filter((p) => p.presenza).length / props.studente?.presenze.length) *
                100
              ).toFixed(2)}
              %
            </p>
            <ul className="bg-light p-3 rounded-3 border border-primary border-3 text-dark">
              {props.studente.presenze.map((p, i) => (
                <li key={i}>
                  {p.data.slice(0, 10)}:{" "}
                  {p.presenza ? (
                    <strong className="text-success">Presente</strong>
                  ) : (
                    <strong className="text-danger">Assente</strong>
                  )}
                </li>
              ))}
            </ul>
          </Col>
          <Col className="d-flex flex-column align-items-center">
            <h4 className="metal-mania-regular my-3 text-center">Media:</h4>
            <p className="text-center">
              <strong>
                {(
                  props.studente.valutazioni.reduce((acc, val) => acc + val, 0) / props.studente.valutazioni.length
                ).toFixed(2)}
              </strong>
              /10
            </p>
            <ul className="bg-light p-3 rounded-3 border border-primary border-3 text-dark">
              {props.studente.valutazioni.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default DettagliStudente;
