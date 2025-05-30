import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import utenteGenerico from "../../../assets/img/user-generico.png";
import { useEffect, useState } from "react";
import RecensioniScuola from "../../dashboard/scuole/recensioni/RecensioniScuola";
function ScuolaProfile() {
  const utente = useSelector((state) => state.user.user);
  const [scuola, setScuola] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      fetch(`${apiUrl}/scuole/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Errore nel recupero della scuola");
          return res.json();
        })
        .then((data) => {
          setScuola(data);
        })
        .catch((error) => {
          navigate("/");
        });
    } else {
      setScuola(utente);
    }
  }, [id, apiUrl, token, utente, navigate]);
  const userType = utente?.roles || utente?.appUser?.roles;
  if (!userType) {
    return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />;
  }
  return (
    <>
      {scuola ? (
        <>
          <Container
            fluid
            className="d-flex flex-column position-relative text-white copertina"
            style={{
              width: "100%",
              height: "400px",
              backgroundImage: `url(${scuola.copertina || "/assets/img/copertina-default.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h1 className="text-center mt-5 metal-mania-regular">{scuola.ragioneSociale}</h1>
            <h3 className="text-center">{scuola.appUser?.username}</h3>
            <img
              src={scuola.avatar ? scuola.avatar : utenteGenerico}
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
            {scuola.id === utente.id && (
              <Button
                as={Link}
                to={`/edit-profile/${scuola.id}`}
                variant="primary"
                className="d-block mx-auto mt-2 position-absolute top-0"
              >
                Modifica profilo
              </Button>
            )}
          </Container>
          <Container
            fluid
            className="py-5 d-flex justify-content-between fw-bold border-bottom border-primary border-3 text-white bg-secondary"
          >
            <p>Email: {scuola.email}</p>
            <div className="d-flex flex-column">
              <p>Partita Iva : {scuola.partitaIva}</p>
            </div>
          </Container>
          <Container>
            <Row className="mt-5 g-3">
              <Col xs={12} md={6} className="d-flex flex-column align-items-center">
                <div className="rounded-4 border border-primary border-3 p-3 w-100">
                  <p>
                    <strong>Telefono: </strong>
                    {scuola.numeroTelefono}
                  </p>
                  <p>
                    <strong>Link Social:</strong>
                  </p>
                  <ul>
                    {scuola.linkSocial &&
                      scuola.linkSocial.map((link, index) => (
                        <li key={index}>{<a href={link.startsWith("http") ? link : "https://" + link}>{link}</a>}</li>
                      ))}
                  </ul>
                </div>
              </Col>
              <Col xs={12} md={6} className="d-flex flex-column align-items-center">
                <div className="rounded-4 border border-primary border-3 p-3 w-100">
                  <p>
                    <strong>Indirizzo principale: </strong> {scuola.indirizzoPrincipale}
                  </p>
                  <p>
                    <strong>Indirizzi secondari: </strong>
                  </p>
                  {scuola.altreSedi &&
                    scuola.altreSedi.map((indirizzo, index) => (
                      <p key={index}>{indirizzo.charAt(0).toUpperCase() + indirizzo.slice(1)}</p>
                    ))}
                </div>
              </Col>
            </Row>
          </Container>
          <Container>
            <h2 className="mt-5 metal-mania-regular text-center">Bio</h2>
            <p className="text-center">{scuola.bio}</p>
            <RecensioniScuola id={scuola.id} />
          </Container>
        </>
      ) : (
        <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />
      )}
    </>
  );
}
export default ScuolaProfile;
