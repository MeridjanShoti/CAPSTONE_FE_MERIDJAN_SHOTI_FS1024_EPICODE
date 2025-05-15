import { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import concerti from "../../assets/img/concerti.png";
import scuola from "../../assets/img/scuola.png";
import user from "../../assets/img/utente.png";
import sala from "../../assets/img/sala.png";
import RegisterForm from "./RegisterForm";

function MyRegister() {
  const [selectedUserType, setSelectedUserType] = useState(null);
  return (
    <>
      {selectedUserType ? (
        <RegisterForm userType={selectedUserType} setSelectedUserType={setSelectedUserType} />
      ) : (
        <div className="metal-mania-regular text-center mt-5">
          <h1>Registrati</h1>
          <h2>Seleziona il tipo di utente da registrare</h2>
          <Row xs={1} md={2} lg={4} className="g-4 mt-5">
            <Col className="d-flex flex-column">
              <img
                src={user}
                className={selectedUserType === "normale" || null ? "selected" : ""}
                onClick={() => setSelectedUserType("normale")}
              />
              <h3>Utente normale</h3>
            </Col>
            <Col className="d-flex flex-column">
              <img
                src={scuola}
                className={selectedUserType === "scuola" ? "selected" : ""}
                onClick={() => setSelectedUserType("scuola")}
              />
              <h3>Scuola di musica</h3>
            </Col>
            <Col className="d-flex flex-column">
              <img
                src={concerti}
                className={selectedUserType === "concerto" ? "selected" : ""}
                onClick={() => setSelectedUserType("concerto")}
              />
              <h3>Organizzatore Eventi</h3>
            </Col>
            <Col className="d-flex flex-column">
              <img
                src={sala}
                className={selectedUserType === "sala" ? "selected" : ""}
                onClick={() => setSelectedUserType("sala")}
              />
              <h3>Sala Prove</h3>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}
export default MyRegister;
