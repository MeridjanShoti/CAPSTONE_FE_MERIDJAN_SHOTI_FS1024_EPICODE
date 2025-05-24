import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { QrCode } from "react-bootstrap-icons";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";

function PrenotazioneDetail() {
  const user = useSelector((state) => state.user.user);
  const [prenotazione, setPrenotazione] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.VITE_API_URL}/prenotazioni-eventi/${id}`, {
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
        })
        .catch(() => {
          navigate("/");
        });
    }
  }, [user, navigate, id]);
  return (
    <>
      {prenotazione ? (
        <>
          <Container className="border border-3 border-primary m-4 rounded-5 overflow-hidden bg-secondary text-white mx-auto">
            <Row xs={1} md={2}>
              <Col className="p-0 bg-primary">
                <img src={prenotazione?.evento.locandina} alt="locandina" className="img-fluid" />
              </Col>
              <Col>
                <h3 className="text-center my-3 metal-mania-regular">
                  <Link to={`/eventi/${prenotazione?.evento.id}`} className="text-white text-decoration-none">
                    {prenotazione?.evento.nomeEvento}
                  </Link>
                </h3>
                <p className="text-center">
                  by{" "}
                  <Link
                    to={`/organizzatori/${prenotazione?.evento.organizzatore.id}`}
                    className="text-white text-decoration-none"
                  >
                    {prenotazione?.evento.organizzatore.ragioneSociale}
                  </Link>
                </p>
                <h4 className="my-3 text-center">
                  <strong>{prenotazione?.evento.artistiPartecipanti.join(", ")}</strong>
                </h4>
                <div className="d-flex justify-content-between flex-wrap gap-3">
                  <div className="d-flex flex-column align-items-start justify-content-center">
                    <h4>{prenotazione?.evento.dataEvento}</h4>
                    <p>Apertura porte:</p>
                    <p>{prenotazione?.evento.aperturaPorte.slice(0, 5)}</p>
                  </div>
                  <div className="d-flex flex-column align-items-end justify-content-center">
                    <h4>{prenotazione?.evento.luogo}</h4>
                    <p>{prenotazione?.evento.citta}</p>
                  </div>
                </div>
                <hr className="my-2 text-white" />
                <p>{prenotazione?.evento.note}</p>
                <hr className="my-2 text-white" />
                <p>Numero ingressi: {prenotazione?.numeroBiglietti}</p>
                <p>Importo totale: {prenotazione?.prezzoPagato} €</p>
                <Container className="d-flex flex-column justify-content-center align-items-center my-4">
                  <QRCode className="border border-3 border-primary" value={prenotazione?.codicePrenotazione} />
                  <p className="mt-3">Codice prenotazione:</p>
                  <p className="mb-3 text-center">{prenotazione?.codicePrenotazione}</p>
                </Container>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <Spinner animation="border" className="d-block mx-auto mt-5" />
      )}
    </>
  );
}
export default PrenotazioneDetail;
