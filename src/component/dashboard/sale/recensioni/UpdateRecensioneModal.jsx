import { Button, Modal } from "react-bootstrap";
import ScriviRecensione from "./ScriviRecensione";
function UpdateRecensioneModal(props) {
  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter metal-mania-regular">Modifica Recensione</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ScriviRecensione
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
export default UpdateRecensioneModal;
