import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import AcquistaBiglietto from "../../../acquistabiglietti/AcquistaBiglietto";
import Commenti from "../commenti/Commenti";

function EventoDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const [evento, setEvento] = useState(null);
  const [tipoEvento, setTipoEvento] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/eventi/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) navigate("/");
        return res.json();
      })
      .then((data) => {
        setEvento(data);
      })
      .catch((error) => {
        alert(error.message);
        navigate("/");
      });
  }, [user, userType, id]);
  useEffect(() => {
    if (evento) {
      switch (evento.tipoEvento) {
        case "CONCERTO":
          setTipoEvento("Concerto");
          break;
        case "WORKSHOP":
          setTipoEvento("Workshop");
          break;
        case "CLINIC":
          setTipoEvento("Clinic");
          break;
        case "FESTA":
          setTipoEvento("Festa");
          break;
        case "ALTRO":
          setTipoEvento("Altro");
          break;
        case "MEET_AND_GREET":
          setTipoEvento("Meet and greet");
          break;
        default:
          setTipoEvento("Sconosciuto");
          break;
      }
    }
  }, [evento]);
  const handleDelete = () => {
    confirm("Sei sicuro di voler eliminare l'evento?") &&
      fetch(`${import.meta.env.VITE_API_URL}/eventi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setAlertMessage("Evento eliminato con successo");
            setAlertType("success");
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
              navigate("/gestisci-eventi");
            }, 5000);
          } else {
            throw new Error("Errore nell'eliminazione dell'evento");
          }
        })
        .catch((error) => {
          setAlertMessage(error.message);
          setAlertType("danger");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
        });
  };
  return (
    <>
      {evento ? (
        <Container fluid>
          <h1 className="text-center metal-mania-regular my-4">{evento?.nomeEvento}</h1>
          <p className="text-center">
            by{" "}
            <Link to={`/organizzatori/${evento?.organizzatore.id}`} className="text-center">
              {evento?.organizzatore.ragioneSociale}
            </Link>
          </p>
          <p className="text-center ">{evento?.artistiPartecipanti.join(", ")}</p>
          <p className="text-center ">Tipo di evento: {tipoEvento}</p>
          <Row xs={1} lg={2} className="g-3">
            <Col className="d-flex justify-content-center p-3">
              <img
                src={evento?.locandina}
                alt={evento?.nomeEvento}
                className="img-fluid rounded-3 border border-primary border-3"
                style={{ maxWidth: "100%", height: "auto", display: "block" }}
              />
            </Col>
            <Col className="p-3">
              <Row>
                <Col>
                  <h3 className="metal-mania-regular">
                    {evento.dataEvento} - {evento?.citta}
                  </h3>
                  <p>
                    <strong>Apertura porte:</strong> {evento?.aperturaPorte.slice(0, 5)}
                  </p>
                </Col>
                <Col>
                  <p className="fw-bold">{evento?.luogo}</p>
                  <p>
                    <strong>Prezzo:</strong> {evento?.prezzoBiglietto}
                  </p>
                </Col>
              </Row>
              <p className="bg-secondary text-white p-3 border border-primary border-3 rounded-3">{evento?.note}</p>

              {evento.fotoEvento && evento.fotoEvento.length > 0 && (
                <>
                  <h3 className="metal-mania-regular">Foto evento</h3>
                  <Row xs={5} className="border border-primary border-3 rounded-3 p-3">
                    {evento.fotoEvento.map((foto, index) => (
                      <Col key={index}>
                        <a href={foto}>
                          <img
                            src={foto}
                            alt={evento?.nomeEvento}
                            className="img-fluid rounded-3 border border-primary border-3"
                            style={{ maxWidth: "100%", height: "auto", display: "block" }}
                          />
                        </a>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
              {userType && userType.includes("ROLE_USER") && evento.dataEvento > new Date().toISOString() && (
                <>
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => {
                      setModalShow(true);
                    }}
                  >
                    {" "}
                    Acquista Biglietto
                  </Button>
                  <AcquistaBiglietto show={modalShow} onHide={() => setModalShow(false)} evento={evento} />
                </>
              )}
              {userType && userType.includes("ROLE_ORGANIZZATORE") && evento.dataEvento > new Date().toISOString() && (
                <div className="d-flex flex-column">
                  <div className="d-flex  justify-content-between align-items-center w-100">
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={() => {
                        navigate(`/edit-evento/${id}`);
                      }}
                    >
                      {" "}
                      Modifica Evento
                    </Button>
                    <Button variant="danger" className="mt-3 border border-primary border-2" onClick={handleDelete}>
                      {" "}
                      Annulla Evento
                    </Button>
                  </div>
                  <Alert show={showAlert} variant={alertType} className="mt-3">
                    {alertMessage}
                  </Alert>
                </div>
              )}
            </Col>
          </Row>
          <Commenti id={id} />
        </Container>
      ) : (
        <Spinner animation="border" />
      )}
    </>
  );
}

export default EventoDetail;
