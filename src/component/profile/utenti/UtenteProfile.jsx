import { Button, Container, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import utenteGenerico from "../../../assets/img/user-generico.png";
import { useEffect, useState } from "react";

function UtenteProfile() {
  const utenteLoggato = useSelector((state) => state.user.user);
  const [utente, setUtente] = useState(null);
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`${apiUrl}/utenti/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Errore nel recupero dell'insegnante");
          return res.json();
        })
        .then((data) => {
          setUtente(data);
        })
        .catch((error) => {
          navigate("/");
        });
    } else {
      setUtente(utenteLoggato);
    }
  }, [id, apiUrl, token, utenteLoggato, navigate]);

  return (
    <>
      {utente ? (
        <>
          <Container
            fluid
            className="d-flex flex-column position-relative text-white copertina"
            style={{
              width: "100%",
              height: "400px",
              backgroundImage: `url(${utente.copertina || "/assets/img/copertina-default.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h1 className="text-center mt-5 metal-mania-regular">{utente.nome + " " + utente.cognome}</h1>
            <h3 className="text-center">{utente.appUser?.username}</h3>
            <img
              src={utente.avatar || utenteGenerico}
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
            {utente.id === utenteLoggato.id && (
              <Button
                as={Link}
                to={`/edit-profile/${utente.id}`}
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
            <p>Email: {utente.email}</p>
            <p>Data di nascita: {utente.dataNascita}</p>
          </Container>
          <h2 className="mt-5 metal-mania-regular text-center">Bio</h2>
          <p className="text-center">{utente.bio}</p>
        </>
      ) : (
        <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />
      )}
    </>
  );
}
export default UtenteProfile;
