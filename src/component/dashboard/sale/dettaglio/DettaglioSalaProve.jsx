import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
/* import Commenti from "../commenti/Commenti"; */
function DettaglioSalaProve() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const [sala, setSala] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const giorniOrdinati = [
    { eng: "MONDAY", ita: "Lunedì" },
    { eng: "TUESDAY", ita: "Martedì" },
    { eng: "WEDNESDAY", ita: "Mercoledì" },
    { eng: "THURSDAY", ita: "Giovedì" },
    { eng: "FRIDAY", ita: "Venerdì" },
    { eng: "SATURDAY", ita: "Sabato" },
    { eng: "SUNDAY", ita: "Domenica" },
  ];
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/saleprove/${id}`, {
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
        setSala(data);
      })
      .catch((error) => {
        alert(error.message);
        navigate("/");
      });
  }, [user, userType, id, navigate]);

  const handleDelete = () => {
    confirm("Sei sicuro di voler eliminare la sala?") &&
      fetch(`${import.meta.env.VITE_API_URL}/saleprove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setAlertMessage("Sala prove eliminata con successo");
            setAlertType("success");
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
              navigate("/gestisci-sale");
            }, 5000);
          } else {
            throw new Error("Errore nell'eliminazione della sala prove");
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
      {sala ? (
        <Container fluid>
          <h1 className="text-center metal-mania-regular my-4">{sala?.nomeSala}</h1>
          <p className="text-center">
            by{" "}
            <Link to={`/gestori/${sala?.gestoreSala.id}`} className="text-center">
              {sala?.gestoreSala.ragioneSociale}
            </Link>
          </p>
          <p className="text-center ">Capienza massima: {sala?.capienzaMax} persone</p>

          <Row xs={1} lg={2} className="g-3">
            <Col className="d-flex justify-content-center p-3">
              <img
                src={sala?.copertinaSala}
                alt={sala?.nomeSala}
                className="img-fluid rounded-3 border border-primary border-3"
                style={{ maxWidth: "100%", height: "auto", display: "block" }}
              />
            </Col>
            <Col className="p-3">
              <Row>
                <Col>
                  <h3 className="metal-mania-regular">
                    {sala.indirizzoSala} - {sala?.citta}
                  </h3>
                  <p>
                    <strong>Orari</strong> {sala?.orarioApertura.slice(0, 5)} - {sala?.orarioChiusura.slice(0, 5)}
                  </p>
                </Col>
                <Col>
                  <p>Giorni Apertura:</p>
                  <p className="fw-bold">
                    {giorniOrdinati
                      .filter((g) => sala?.giorniApertura?.includes(g.eng))
                      .map((g) => g.ita)
                      .join(", ")}
                  </p>
                  <p>
                    <strong>Prezzo:</strong> {sala?.prezzoOrario}
                  </p>
                </Col>
              </Row>
              <p className="bg-secondary text-white p-3 border border-primary border-3 rounded-3">
                {sala?.descrizione}
              </p>
              <hr />
              <h4 className="metal-mania-regular my-3 text-center">Regolamento</h4>
              <p>{sala?.regolamento}</p>

              {userType && userType.includes("ROLE_USER") && (
                <>
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => {
                      navigate(`/prenota-sala/${id}`);
                    }}
                  >
                    {" "}
                    Prenota Sala
                  </Button>
                </>
              )}
              {userType && userType.includes("ROLE_GESTORE_SP") && (
                <div className="d-flex flex-column">
                  <div className="d-flex  justify-content-between align-items-center w-100">
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={() => {
                        navigate(`/edit-sala/${id}`);
                      }}
                    >
                      {" "}
                      Modifica Sala
                    </Button>
                    <Button
                      variant="info"
                      className="mt-3"
                      onClick={() => {
                        navigate(`/gestisci-prenotazioni/${id}`);
                      }}
                    >
                      {" "}
                      Prenotazioni
                    </Button>

                    <Button variant="danger" className="mt-3 border border-primary border-2" onClick={handleDelete}>
                      {" "}
                      Elimina Sala
                    </Button>
                  </div>
                  <Alert show={showAlert} variant={alertType} className="mt-3">
                    {alertMessage}
                  </Alert>
                </div>
              )}
            </Col>
          </Row>
          {/* <Commenti id={id} /> */}
        </Container>
      ) : (
        <Spinner animation="border" />
      )}
    </>
  );
}
export default DettaglioSalaProve;
