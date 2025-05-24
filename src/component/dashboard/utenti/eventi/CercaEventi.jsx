import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function CercaEventi() {
  const [filtro, setFiltro] = useState({
    citta: "",
    tipoEvento: "",
    nomeParziale: "",
    data1: "",
    data2: "",
    artista: "",
    soloFuturi: true,
    page: 0,
    size: 10,
    sort: "dataEvento",
    sortDir: "desc",
  });
  const [eventi, setEventi] = useState([]);
  const [elementiTotali, setElementiTotali] = useState(0);
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userType && !userType.includes("ROLE_USER")) {
      navigate("/");
      return;
    } else {
      const params = new URLSearchParams();
      Object.entries(filtro).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });
      fetch(`${apiUrl}/eventi?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Errore nel recupero dei tuoi eventi");
          return res.json();
        })
        .then((data) => {
          setEventi(data.content);
          setElementiTotali(data.totalElements);
        })
        .catch((error) => {
          navigate("/");
        });
    }
  }, [userType, navigate, filtro, apiUrl, token]);

  return (
    <>
      <h1 className="text-center metal-mania-regular my-4">Cerca Eventi</h1>
      {userType && userType.includes("ROLE_USER") ? (
        <>
          <Container className="bg-secondary my-4 text-white p-3 rounded-3 border border-primary border-3">
            <Row xs={1} md={2} lg={4}>
              <Col>
                <Form.Label>Da:</Form.Label>
                <Form.Control
                  type="date"
                  value={filtro.data1 || ""}
                  onChange={(e) => setFiltro({ ...filtro, data1: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>A:</Form.Label>
                <Form.Control
                  type="date"
                  value={filtro.data2 || ""}
                  onChange={(e) => setFiltro({ ...filtro, data2: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Artista:</Form.Label>
                <Form.Control
                  type="text"
                  value={filtro.artista || ""}
                  onChange={(e) => setFiltro({ ...filtro, artista: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Nome evento:</Form.Label>
                <Form.Control
                  type="text"
                  value={filtro.nomeParziale || ""}
                  onChange={(e) => setFiltro({ ...filtro, nomeParziale: e.target.value })}
                />
              </Col>
            </Row>

            <Row xs={1} md={2} lg={4} className="my-4 align-items-end">
              <Col>
                <Form.Label>Città:</Form.Label>
                <Form.Control
                  type="text"
                  value={filtro.citta || ""}
                  onChange={(e) => setFiltro({ ...filtro, citta: e.target.value })}
                />
              </Col>

              <Col>
                <Form.Label>Tipo evento:</Form.Label>
                <Form.Select
                  value={filtro.tipoEvento || "TUTTI"}
                  onChange={(e) => {
                    const valore = e.target.value;
                    setFiltro({ ...filtro, tipoEvento: valore === "TUTTI" ? "" : valore });
                  }}
                >
                  <option value="TUTTI">Tutti</option>
                  <option value="CONCERTO">Concerto</option>
                  <option value="MEET_AND_GREET">Meet and Greet</option>
                  <option value="CLINIC">Clinic</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="ALTRO">Altro</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Group controlId="sortBy">
                  <Form.Label>Ordina per:</Form.Label>
                  <Form.Select
                    value={filtro.sort || "dataEvento"}
                    onChange={(e) => setFiltro({ ...filtro, sort: e.target.value })}
                  >
                    <option value="dataEvento">Data evento</option>
                    <option value="prezzoBiglietto">Prezzo</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId="sortDir">
                  <Form.Label>Direzione:</Form.Label>
                  <Form.Select
                    value={filtro.sortDir || "desc"}
                    onChange={(e) => setFiltro({ ...filtro, sortDir: e.target.value })}
                  >
                    <option value="desc">Decrescente</option>
                    <option value="asc">Crescente</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row xs={1} md={2} lg={4} className="align-items-end my-4">
              <Col>
                <Form.Group controlId="pageSize">
                  <Form.Label>Eventi per pagina:</Form.Label>
                  <Form.Select
                    value={filtro.size || 10}
                    onChange={(e) => setFiltro({ ...filtro, size: parseInt(e.target.value), page: 0 })}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Label>Solo futuri:</Form.Label>
                <Form.Check
                  type="checkbox"
                  checked={filtro.soloFuturi}
                  onChange={(e) => setFiltro({ ...filtro, soloFuturi: e.target.checked })}
                />
              </Col>
            </Row>
          </Container>
          <Row className="justify-content-center my-3">
            <Col xs="auto">
              <Button
                variant="secondary"
                disabled={filtro.page <= 0}
                onClick={() => setFiltro({ ...filtro, page: filtro.page - 1 })}
              >
                &lt;&lt;
              </Button>
            </Col>
            <Col xs="auto" className="d-flex align-items-center">
              <strong>Pagina {filtro.page + 1}</strong>
            </Col>
            <Col xs="auto">
              <Button
                variant="secondary"
                disabled={filtro.page > elementiTotali / filtro.size - 1}
                onClick={() => {
                  setFiltro({ ...filtro, page: filtro.page + 1 });
                }}
              >
                &gt;&gt;
              </Button>
            </Col>
          </Row>
          <Container>
            <Row xs={1} md={2} lg={4} className="g-3">
              {eventi &&
                eventi.map((evento) => (
                  <Col key={evento.id}>
                    <Card style={{ height: "400px" }}>
                      <div className="position-relative">
                        <Card.Img
                          variant="top"
                          src={evento.locandina}
                          alt={evento.nomeEvento}
                          style={{ height: "200px", objectFit: "cover", objectPosition: "center" }}
                        />
                      </div>
                      <span
                        className="badge bg-success rounded-pill"
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          fontSize: "0.9rem",
                          padding: "0.4em 0.7em",
                        }}
                      >
                        {evento.prezzoBiglietto}€
                      </span>
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
            <Row className="justify-content-center my-3">
              <Col xs="auto">
                <Button
                  variant="secondary"
                  disabled={filtro.page <= 0}
                  onClick={() => setFiltro({ ...filtro, page: filtro.page - 1 })}
                >
                  &lt;&lt;
                </Button>
              </Col>
              <Col xs="auto" className="d-flex align-items-center">
                <strong>Pagina {filtro.page + 1}</strong>
              </Col>
              <Col xs="auto">
                <Button
                  variant="secondary"
                  disabled={filtro.page > elementiTotali / filtro.size - 1}
                  onClick={() => {
                    setFiltro({ ...filtro, page: filtro.page + 1 });
                  }}
                >
                  &gt;&gt;
                </Button>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <Spinner animation="border" variant="primary" />
      )}
    </>
  );
}

export default CercaEventi;
