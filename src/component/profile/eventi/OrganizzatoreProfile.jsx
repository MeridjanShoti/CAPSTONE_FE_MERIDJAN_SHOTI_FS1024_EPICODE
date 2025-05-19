import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import utenteGenerico from "../../../assets/img/user-generico.png";
import { useEffect, useState } from "react";
function OrganizzatoreProfile() {
  const utente = useSelector((state) => state.user.user);
  const [organizzatore, setOrganizzatore] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      fetch(`${apiUrl}/organizzatori/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Errore nel recupero dell'organizzatore");
          return res.json();
        })
        .then((data) => {
          setOrganizzatore(data);
        })
        .catch((error) => {
          alert(error.message);
          navigate("/");
        });
    } else {
      setOrganizzatore(utente);
    }
  }, [id, apiUrl, token, utente, navigate]);
  const userType = utente?.roles || utente?.appUser?.roles;
  if (!userType) {
    return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />;
  }
  return (
    <>
      {organizzatore ? (
        <>
          <Container
            fluid
            className="d-flex flex-column position-relative text-white copertina"
            style={{
              width: "100%",
              height: "400px",
              backgroundImage: `url(${organizzatore.copertina || "/assets/img/copertina-default.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h1 className="text-center mt-5 metal-mania-regular">{organizzatore.ragioneSociale}</h1>
            <h3 className="text-center">{organizzatore.appUser?.username}</h3>
            <img
              src={organizzatore.avatar ? organizzatore.avatar : utenteGenerico}
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
            {organizzatore.id === utente.id && (
              <Button
                as={Link}
                to={`/edit-profile/${organizzatore.id}`}
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
            <p>Email: {organizzatore.email}</p>
            <div className="d-flex flex-column">
              <p>Partita Iva : {organizzatore.partitaIva}</p>
            </div>
          </Container>
          <Container>
            <Row className="mt-5 g-3">
              <Col xs={12} md={6} className="d-flex flex-column align-items-center">
                <div className="rounded-4 border border-primary border-3 p-3 w-100">
                  <p>
                    <strong>Telefono: </strong>
                    {organizzatore.numeroTelefono}
                  </p>
                  <p>
                    <strong>Link Social:</strong>
                  </p>
                  <ul>
                    {organizzatore.linkSocial &&
                      organizzatore.linkSocial.map((link, index) => <li key={index}>{link}</li>)}
                  </ul>
                </div>
              </Col>
              <Col xs={12} md={6} className="d-flex flex-column align-items-center">
                <div className="rounded-4 border border-primary border-3 p-3 w-100">
                  <p>
                    <strong>Indirizzo principale: </strong> {organizzatore.indirizzoPrincipale}
                  </p>
                  <p>
                    <strong>Indirizzi secondari: </strong>
                  </p>
                  {organizzatore.altreSedi &&
                    organizzatore.altreSedi.map((indirizzo, index) => (
                      <p key={index}>{indirizzo.charAt(0).toUpperCase() + indirizzo.slice(1)}</p>
                    ))}
                </div>
              </Col>
            </Row>
          </Container>
          <h2 className="mt-5 metal-mania-regular text-center">Bio</h2>
          <p className="text-center">{organizzatore.bio}</p>
        </>
      ) : (
        <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />
      )}
    </>
  );
}
export default OrganizzatoreProfile;
