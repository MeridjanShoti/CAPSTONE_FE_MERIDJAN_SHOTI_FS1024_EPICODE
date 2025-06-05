import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import utenteGenerico from "../../../assets/img/user-generico.png";
import { useEffect, useState } from "react";
import { FlagFill } from "react-bootstrap-icons";
import SegnalazioneModal from "../../segnalazioni/SegnalazioneModal";
function InsegnanteProfile() {
  const utente = useSelector((state) => state.user.user);
  const [showSegnalazione, setShowSegnalazione] = useState(false);
  const [insegnante, setInsegnante] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      fetch(`${apiUrl}/insegnanti/complete/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          if (!res.ok) throw new Error("Errore nel recupero dell'insegnante");
          return res.json();
        })
        .then((data) => {
          setInsegnante(data);
        })
        .catch(() => {
          fetch(`${apiUrl}/insegnanti/${id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Errore nel recupero dell'insegnante");
              return res.json();
            })
            .then((data) => {
              setInsegnante({ ...data, pagaOraria: null });
            })
            .catch((error) => {
              navigate("/");
            });
        });
    } else {
      setInsegnante(utente);
    }
  }, [id, apiUrl, token, utente]);
  const userType = utente?.roles || utente?.appUser?.roles;
  const handleDownload = () => {
    console.log("sono nel download");
    fetch(`${apiUrl}/insegnanti/curriculum/${id ? id : utente.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Nessun curriculum da scaricare");
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "curriculum.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => alert(error.message));
  };
  if (!userType) {
    return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />;
  }
  return (
    <>
      {insegnante ? (
        <>
          <Container
            fluid
            className="d-flex flex-column position-relative text-white copertina"
            style={{
              width: "100%",
              height: "400px",
              backgroundImage: `url(${insegnante.copertina || "/assets/img/copertina-default.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h1 className="text-center mt-5 metal-mania-regular">{insegnante.nome + " " + insegnante.cognome}</h1>
            <h3 className="text-center">{insegnante.appUser?.username}</h3>
            <img
              src={insegnante.avatar ? insegnante.avatar : utenteGenerico}
              className="profile-pic d-block mx-auto mt-5 border border-primary border-3  rounded-circle"
              style={{
                width: "300px",
                height: "300px",
                objectFit: "cover",
                position: "absolute",
                top: "70%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
            {insegnante.id === utente.id ? (
              <Button
                as={Link}
                to={`/edit-profile/${insegnante.id}`}
                variant="primary"
                className="d-block mx-auto mt-2 position-absolute top-0"
              >
                Modifica profilo
              </Button>
            ) : (
              <>
                <Button
                  as={Link}
                  onClick={() => setShowSegnalazione(true)}
                  variant="primary"
                  className="d-block mx-auto mt-2 position-absolute top-0"
                >
                  <FlagFill />
                </Button>
                <SegnalazioneModal
                  id={insegnante.id}
                  onHide={() => setShowSegnalazione(false)}
                  show={showSegnalazione}
                  tipoSegnalazione="INSEGNANTE"
                  titolo={insegnante.nome + " " + insegnante.cognome}
                />
              </>
            )}
          </Container>
          <Container
            fluid
            className="py-5 d-flex justify-content-between fw-bold border-bottom border-primary border-3 text-white bg-secondary"
          >
            <p>Email: {insegnante.email}</p>
            <p>Data di nascita: {insegnante.dataNascita}</p>
          </Container>
          <Container>
            <Row className="mt-5 g-3">
              <Col xs={12} md={6} className="d-flex flex-column align-items-center">
                <div className="rounded-4 border border-primary border-3 p-3 w-100">
                  <h4 className="metal-mania-regular">Strumenti Suonati:</h4>
                  <ul>
                    {insegnante.strumenti &&
                      insegnante.strumenti.map((strumento, index) => (
                        <li key={index}>{strumento.charAt(0).toUpperCase() + strumento.slice(1)}</li>
                      ))}
                  </ul>
                </div>
              </Col>
              <Col xs={12} md={6} className="d-flex flex-column align-items-center">
                <div className="rounded-4 border border-primary border-3 p-3 w-100">
                  {(userType.includes("ROLE_SCUOLA") ||
                    userType.includes("ROLE_ADMIN") ||
                    userType.includes("ROLE_INSEGNANTE")) && (
                    <>
                      {insegnante.pagaOraria && (
                        <>
                          <h4 className="metal-mania-regular">Paga Oraria:</h4>
                          <p>{insegnante.pagaOraria}</p>
                        </>
                      )}
                    </>
                  )}
                  <h4 className="metal-mania-regular">Curriculum:</h4>
                  <Button variant="secondary" onClick={() => handleDownload()}>
                    Scarica
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
          <h2 className="mt-5 metal-mania-regular text-center">Bio</h2>
          <p className="text-center">{insegnante.bio}</p>
        </>
      ) : (
        <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />
      )}
    </>
  );
}
export default InsegnanteProfile;
