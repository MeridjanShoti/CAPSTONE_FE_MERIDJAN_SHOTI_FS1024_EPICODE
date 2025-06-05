import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
function PrenotazioneSalaDetail() {
  const [inizioDate, setInizioDate] = useState("");
  const [fineDate, setFineDate] = useState("");
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const [prenotazione, setPrenotazione] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.VITE_API_URL}/prenotazioni-sala-prove/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Errore nel recupero della prenotazione");
          }
        })
        .then((data) => {
          setPrenotazione(data);
          setInizioDate(new Date(data.inizio));
          setFineDate(new Date(data.fine));
        })
        .catch(() => {
          navigate("/");
        });
    }
  }, [user, id]);
  return (
    <>
      {prenotazione ? (
        <>
          <Container className="border border-3 border-primary m-4 rounded-5 overflow-hidden bg-secondary text-white mx-auto">
            <Row xs={1} md={2}>
              <Col className="p-0 bg-primary">
                <img src={prenotazione?.salaProve.copertinaSala} alt="copertina sala" className="img-fluid" />
              </Col>
              <Col>
                <h3 className="text-center my-3 metal-mania-regular">
                  <Link to={`/sale-prove/${prenotazione?.salaProve.id}`} className="text-white text-decoration-none">
                    {prenotazione?.salaProve.nomeSala}
                  </Link>
                </h3>
                <p className="text-center">
                  by{" "}
                  <Link
                    to={`/gestori/${prenotazione?.salaProve.gestoreSala.id}`}
                    className="text-white text-decoration-none"
                  >
                    {prenotazione?.salaProve.gestoreSala.ragioneSociale}
                  </Link>
                </p>
                <h4 className="my-3 text-center">
                  <strong>
                    {user?.nome} {user?.cognome}
                  </strong>
                </h4>
                <div className="d-flex justify-content-between flex-wrap gap-3">
                  <div className="d-flex flex-column align-items-start justify-content-center">
                    <h4>{prenotazione?.inizio.slice(0, 10)}</h4>
                    <p>
                      {prenotazione?.inizio.slice(11, 16)}-{prenotazione?.fine.slice(11, 16)}
                    </p>
                  </div>
                  <div className="d-flex flex-column align-items-end justify-content-center">
                    <h4>{prenotazione?.salaProve.indirizzoSala}</h4>
                    <p>{prenotazione?.salaProve.citta}</p>
                  </div>
                </div>
                <hr className="my-2 text-white" />
                <p>{prenotazione?.salaProve.regolamento}</p>
                <hr className="my-2 text-white" />
                <p>Numero membri: {prenotazione?.numMembri}</p>
                <p>Durata: {(fineDate - inizioDate) / (1000 * 60)} min</p>
                <p>
                  Importo totale: {((fineDate - inizioDate) / (1000 * 60 * 60)) * prenotazione?.salaProve.prezzoOrario}{" "}
                  €
                </p>
                <p>
                  <strong>{prenotazione?.pagata ? "PAGATA" : "DA PAGARE"}</strong>{" "}
                </p>
                <Container className="d-flex flex-column justify-content-center align-items-center my-4">
                  <QRCode className="border border-3 border-primary" value={prenotazione?.codicePrenotazione} />
                  <p className="mt-3">Codice prenotazione:</p>
                  <p className="mb-3 text-center">{prenotazione?.codicePrenotazione}</p>
                  <p>
                    Per eventuali modifiche{" "}
                    {prenotazione?.salaProve.gestoreSala.email
                      ? `scrivere a ${prenotazione?.salaProve.gestoreSala.email}`
                      : ""}{" "}
                    {prenotazione?.salaProve.gestoreSala.numeroTelefono && prenotazione?.salaProve.gestoreSala.email
                      ? "o "
                      : ""}{" "}
                    {prenotazione?.salaProve.gestoreSala.numeroTelefono
                      ? `chiamare al ${prenotazione?.salaProve.gestoreSala.numeroTelefono}`
                      : ""}
                  </p>
                </Container>
              </Col>
              {userType && userType.includes("ROLE_GESTORE_SP") && (
                <div className="d-flex flex-column p-0">
                  <Button
                    className="border border-3 border-primary"
                    variant="info"
                    onClick={() => {
                      navigate("/modifica-prenotazione-sala/" + prenotazione.id);
                    }}
                  >
                    Modifica Prenotazione
                  </Button>

                  <Button
                    variant="danger"
                    className="border border-3 border-primary"
                    onClick={() => {
                      fetch(`${import.meta.env.VITE_API_URL}/prenotazioni-sala-prove/${prenotazione.id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                      })
                        .then((res) => {
                          if (!res.ok) {
                            throw new Error("Errore nell'eliminazione della prenotazione");
                          } else {
                            navigate("/prenotazioni-gestore");
                          }
                        })
                        .catch((err) => {
                          alert(err.message);
                        });
                    }}
                  >
                    Cancella Prenotazione
                  </Button>
                </div>
              )}
            </Row>
          </Container>
        </>
      ) : (
        <Spinner animation="border" className="d-block mx-auto mt-5" />
      )}
    </>
  );
}
export default PrenotazioneSalaDetail;
