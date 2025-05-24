import { Button, Modal } from "react-bootstrap";
import ScriviCommento from "./ScriviCommento";

function UpdateCommentModal(props) {
  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter metal-mania-regular">Modifica commento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ScriviCommento commento={props.commento} setUpdate={props.setUpdate} mode="update" onHide={props.onHide} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateCommentModal;
