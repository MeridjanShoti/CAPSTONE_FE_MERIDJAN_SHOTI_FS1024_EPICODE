import { Col, Container, Row } from "react-bootstrap";
import GestoreSalaForm from "./GestoreSalaForm";
import OrganizzatoreConcertiForm from "./OrganizzatoreConcertiForm";
import ScuolaForm from "./ScuolaForm";
import UserForm from "./UserForm";
import concerti from "../../assets/img/concerti.png";
import scuola from "../../assets/img/scuola.png";
import user from "../../assets/img/utente.png";
import sala from "../../assets/img/sala.png";
import "./registerForm.scss";
function RegisterForm({ userType, setSelectedUserType }) {
  let componente;
  switch (userType) {
    case "normale":
      componente = <UserForm />;
      break;
    case "scuola":
      componente = <ScuolaForm />;
      break;
    case "concerto":
      componente = <OrganizzatoreConcertiForm />;
      break;
    case "sala":
      componente = <GestoreSalaForm />;
      break;
    default:
      return <p>Seleziona un tipo di utente</p>;
  }

  return (
    <>
      {
        <Row className="select-user-type my-4">
          <Col className="d-flex justify-content-center">
            <img
              src={user}
              className={userType === "normale" ? "selected" : ""}
              onClick={() => setSelectedUserType("normale")}
            />
          </Col>
          <Col className="d-flex justify-content-center">
            <img
              src={scuola}
              className={userType === "scuola" ? "selected" : ""}
              onClick={() => setSelectedUserType("scuola")}
            />
          </Col>
          <Col className="d-flex justify-content-center">
            <img
              src={concerti}
              className={userType === "concerto" ? "selected" : ""}
              onClick={() => setSelectedUserType("concerto")}
            />
          </Col>
          <Col className="d-flex justify-content-center">
            <img
              src={sala}
              className={userType === "sala" ? "selected" : ""}
              onClick={() => setSelectedUserType("sala")}
            />
          </Col>
        </Row>
      }
      <Container className="mt-3">{componente}</Container>
    </>
  );
}
export default RegisterForm;
