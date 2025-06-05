import { Button, Modal } from "react-bootstrap";
import ScriviRecensioneScuola from "./ScriviRecensioneScuola";
function UpdateRecensioneScuolaModal(props) {
  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter metal-mania-regular">Modifica Recensione</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ScriviRecensioneScuola
          recensione={props.recensione}
          setUpdate={props.setUpdate}
          mode="update"
          onHide={props.onHide}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default UpdateRecensioneScuolaModal;
