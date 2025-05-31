import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
function GestisciCorsi() {
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const [corsi, setCorsi] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const giorniOrdinati = [
    { eng: "MONDAY", ita: "L" },
    { eng: "TUESDAY", ita: "Ma" },
    { eng: "WEDNESDAY", ita: "Me" },
    { eng: "THURSDAY", ita: "G" },
    { eng: "FRIDAY", ita: "V" },
    { eng: "SATURDAY", ita: "S" },
    { eng: "SUNDAY", ita: "D" },
  ];
  const navigate = useNavigate();
  useEffect(() => {
    if (userType && !userType.includes("ROLE_SCUOLA")) {
      navigate("/");
    } else {
      fetch(`${import.meta.env.VITE_API_URL}/corsi/miei-corsi?page=${page}`, {
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
          setCorsi(data.content);
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
        <h1 className="text-center metal-mania-regular my-4">Gestisci Corsi</h1>
        <Row xs={1} md={2} lg={4} className="g-3">
          {corsi &&
            corsi.map((corso) => (
              <Col key={corso.id}>
                <Card style={{ height: "450px" }}>
                  <Card.Img
                    variant="top"
                    src={corso.locandina}
                    alt={corso.nomeCorso}
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
                      {corso.nomeCorso}
                    </Card.Title>
                    <Card.Text
                      style={{
                        maxHeight: "100px",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      <strong> {corso.strumenti.join(", ")}</strong>
                      <br />
                      Dal {corso.dataInizio} al {corso.dataFine}
                      <br />
                      {corso.orarioInizio.slice(0, 5)} - {corso.orarioFine.slice(0, 5)}
                      <br />
                      <strong>
                        {giorniOrdinati
                          .filter((g) => corso?.giorniLezione?.includes(g.eng))
                          .map((g) => g.ita)
                          .join("-")}
                      </strong>
                      <br />
                      {corso.livello}
                    </Card.Text>
                    <Button variant="primary" className="w-100 mt-auto" onClick={() => navigate(`/corso/${corso.id}`)}>
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

export default GestisciCorsi;
