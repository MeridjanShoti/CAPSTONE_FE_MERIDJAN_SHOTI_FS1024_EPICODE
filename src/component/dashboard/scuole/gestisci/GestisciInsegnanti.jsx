import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
function GestisciInsegnanti() {
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const [insegnanti, setInsegnanti] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (userType && !userType.includes("ROLE_SCUOLA")) {
      navigate("/");
    } else {
      fetch(`${import.meta.env.VITE_API_URL}/insegnanti/page?page=${page}`, {
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
          setInsegnanti(data.content);
          setTotalPages(data.totalPages);
        })
        .catch((error) => {
          navigate("/");
        });
    }
  }, [user, userType, page]);
  return (
    <>
      <Container>
        <div className="d-flex justify-content-center my-4">
          <Button
            variant="secondary"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className="me-2"
          >
            Precedente
          </Button>
          <span className="align-self-center">
            Pagina {page + 1} di {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="ms-2"
          >
            Successiva
          </Button>
        </div>
        <h1 className="text-center metal-mania-regular my-4">Gestisci Insegnanti</h1>
        <Row xs={1} md={2} lg={4} className="g-3">
          {insegnanti &&
            insegnanti.map((insegnante) => (
              <Col key={insegnante.id}>
                <Card style={{ height: "400px" }}>
                  <Card.Img
                    variant="top"
                    src={insegnante.avatar}
                    alt={insegnante.nome + " " + insegnante.cognome}
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
                      {insegnante.nome + " " + insegnante.cognome}
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
                      {insegnante.email}
                      <br />
                      strumenti: {insegnante.strumenti.join(", ")}
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="w-100 mt-auto"
                      onClick={() => navigate(`/insegnanti/${insegnante.id}`)}
                    >
                      Dettagli
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
        <div className="d-flex justify-content-center my-4">
          <Button
            variant="secondary"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className="me-2"
          >
            Precedente
          </Button>
          <span className="align-self-center">
            Pagina {page + 1} di {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="ms-2"
          >
            Successiva
          </Button>
        </div>
      </Container>
    </>
  );
}

export default GestisciInsegnanti;
