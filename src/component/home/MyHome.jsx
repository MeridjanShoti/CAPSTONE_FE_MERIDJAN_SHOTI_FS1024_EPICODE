import { Button, Col, Container, Row } from "react-bootstrap";
import logo from "/assets/img/logoSdM.png";
import { useSelector } from "react-redux";
import userpic from "../../assets/img/utente.png";
import adminpic from "../../assets/img/admin.png";
import scuolapic from "../../assets/img/scuola.png";
import insegnantepic from "../../assets/img/insegnante.png";
import organizzatorepic from "../../assets/img/concerti.png";
import salapic from "../../assets/img/sala.png";
import genericpic from "../../assets/img/user-generico.png";
import { Link } from "react-router";
function MyHome() {
  const user = useSelector((state) => state.user?.user);
  const userType = user?.roles || user?.appUser?.roles;
  let homeText = "Home";
  let userTypePicture = genericpic;
  let nome = "utente";
  if (userType) {
    switch (true) {
      case userType.includes("ROLE_ADMIN"):
        homeText = (
          <div>
            <p>Gestisci le segnalazioni o registra nuovi collaboratori</p>
          </div>
        );
        userTypePicture = adminpic;
        nome = user?.username;
        console.log(nome);
        break;
      case userType.includes("ROLE_ORGANIZZATORE"):
        homeText = (
          <div>
            <p className="text-center">Con la nostra app potrai:</p>
            <ul>
              <li>Proporre concerti, workshop, clinic musicali e tanti altri entusiasmanti eventi</li>
              <li>Gestire i tuoi eventi</li>
              <li>Caricare le foto degli eventi e vedere i commenti degli utenti</li>
            </ul>
          </div>
        );
        userTypePicture = organizzatorepic;
        nome = user?.ragioneSociale;
        break;
      case userType.includes("ROLE_INSEGNANTE"):
        homeText = (
          <div>
            <p className="text-center">Con la nostra app potrai:</p>
            <ul>
              <li>Seguire i progressi dei tuoi studenti</li>
              <li>Gestire i tuoi corsi</li>
              <li>Valutare i tuoi studenti</li>
            </ul>
          </div>
        );
        userTypePicture = insegnantepic;
        nome = user?.nome + " " + user?.cognome;
        break;
      case userType.includes("ROLE_GESTORE_SP"):
        homeText = (
          <div>
            <p className="text-center">Con la nostra app potrai:</p>
            <ul>
              <li>Affittare le tue sale prove</li>
              <li>Gestire, aggiungere, modificare e eliminare le tue sale prove</li>
              <li>Vedere le recensioni delle tue Sale prove</li>
              <li>Gestire le prenotazioni</li>
            </ul>
          </div>
        );
        userTypePicture = salapic;
        nome = user?.ragioneSociale;
        break;
      case userType.includes("ROLE_USER"):
        homeText = (
          <div>
            <p className="text-center">Con la nostra app potrai:</p>
            <ul>
              <li>Partecipare a corsi di musica</li>
              <li>Prenotare sale prove</li>
              <li>comprare biglietti per concerti o altri eventi inerenti alla musica</li>
              <li>Recensire scuole di musica e sale prove</li>
              <li>Commentare gli eventi a cui vorresti partecipare o a cui hai partecipato</li>
              <li>Vedere le foto degli eventi</li>
            </ul>
          </div>
        );
        userTypePicture = userpic;
        nome = user?.nome + " " + user?.cognome;
        break;
      case userType.includes("ROLE_SCUOLA"):
        homeText = (
          <div>
            <p className="text-center">Con la nostra app potrai:</p>
            <ul>
              <li>Offrire i tuoi corsi di musica</li>
              <li>Registrare i tuoi insegnanti</li>
              <li>Gestire l'iscrizione ai corsi</li>
              <li>Vedere i feedback degli utenti</li>
            </ul>
          </div>
        );
        userTypePicture = scuolapic;
        nome = user?.ragioneSociale;
        break;
      default:
        homeText = "Home";
    }
  }
  return (
    <Container fluid>
      {userType && (
        <Row>
          <Col xs={12} sm={6} md={4} className="d-flex flex-column justify-content-center align-items-center">
            <img src={logo} alt="logo" className="d-inline-block align-top me-2 w-100" />
            <h1 className="text-center metal-mania-regular">Simposio der Medallo</h1>
          </Col>
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <h2 className="text-center metal-mania-regular">La piattaforma per chi ha il cuore affogato nel metallo</h2>
            <div className="d-flex align-items-center">
              <h3>Benvenuto {nome}!</h3>
              <img src={userTypePicture} alt="logo" className="d-inline-block align-top me-2" width="50" height="50" />
            </div>

            <div>{homeText}</div>
            <Button as={Link} to="/dashboard" variant="primary" className="me-2">
              Vai alla Dashboard!
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
}
export default MyHome;
