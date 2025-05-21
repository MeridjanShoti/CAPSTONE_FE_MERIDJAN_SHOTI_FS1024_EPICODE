import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function GestisciEventi() {
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const [eventi, setEventi] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (userType && !userType.includes("ROLE_ORGANIZZATORE")) {
      navigate("/");
    } else {
      fetch(`${import.meta.env.VITE_API_URL}/eventi/my-events`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Errore nel recupero dell'organizzatore");
          return res.json();
        })
        .then((data) => {
          setEventi(data.content);
        })
        .catch((error) => {
          alert(error.message);
          navigate("/");
        });
    }
  }, [user, userType, navigate]);
  return (
    <>
      <Container>
        <h1 className="text-center metal-mania-regular my-4">Gestisci Eventi</h1>
        <Row xs={1} md={2} lg={4} className="g-3">
          {eventi &&
            eventi.map((evento) => (
              <Col key={evento.id}>
                <Card style={{ height: "400px" }}>
                  <Card.Img
                    variant="top"
                    src={evento.locandina}
                    alt={evento.nomeEvento}
                    style={{ height: "200px", objectFit: "cover", objectPosition: "center" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {evento.nomeEvento}
                    </Card.Title>
                    <Card.Text
                      style={{
                        maxHeight: "70px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {evento.dataEvento} - {evento.citta}
                      <br />
                      Artisti partecipanti: {evento.artistiPartecipanti.join(", ")}
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="w-100 mt-auto"
                      onClick={() => navigate(`/eventi/${evento.id}`)}
                    >
                      Dettagli
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    </>
  );
}

export default GestisciEventi;
