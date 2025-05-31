import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
function CercaCorsi() {
  const [filtro, setFiltro] = useState({
    nomeCorso: "",
    livello: "",
    dataInizio: "",
    dataFine: "",
    giorniASettimana: "",
    strumenti: "",
    costo: "",
    page: 0,
    size: 10,
    sortBy: "dataInizio",
    sortDir: "asc",
  });
  const [corsi, setCorsi] = useState([]);
  const [elementiTotali, setElementiTotali] = useState(0);
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const giorniOrdinati = [
    { eng: "MONDAY", ita: "L" },
    { eng: "TUESDAY", ita: "Ma" },
    { eng: "WEDNESDAY", ita: "Me" },
    { eng: "THURSDAY", ita: "G" },
    { eng: "FRIDAY", ita: "V" },
    { eng: "SATURDAY", ita: "S" },
    { eng: "SUNDAY", ita: "D" },
  ];

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
      fetch(`${apiUrl}/corsi?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Errore nel recupero dei corsi");
          return res.json();
        })
        .then((data) => {
          setCorsi(data.content);
          setElementiTotali(data.totalElements);
        })
        .catch(() => {
          navigate("/");
        });
    }
  }, [userType, filtro, apiUrl, token]);

  return (
    <>
      <h1 className="text-center metal-mania-regular my-4">Cerca Corsi</h1>
      {userType && userType.includes("ROLE_USER") ? (
        <>
          <Container className="bg-secondary my-4 text-white p-3 rounded-3 border border-primary border-3">
            <Row xs={1} md={2} lg={4} className="gy-3">
              <Col>
                <Form.Label>Nome Corso</Form.Label>
                <Form.Control
                  type="text"
                  value={filtro.nomeCorso || ""}
                  onChange={(e) => setFiltro({ ...filtro, nomeCorso: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Livello</Form.Label>
                <Form.Select
                  value={filtro.livello || ""}
                  onChange={(e) => setFiltro({ ...filtro, livello: e.target.value })}
                >
                  <option value="">Tutti</option>
                  <option value="PRINCIPIANTE">Principiante</option>
                  <option value="MEDIO">Intermedio</option>
                  <option value="AVANZATO">Avanzato</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label>Strumenti</Form.Label>
                <Form.Control
                  type="text"
                  value={filtro.strumenti || ""}
                  onChange={(e) => setFiltro({ ...filtro, strumenti: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Giorni a settimana </Form.Label>
                <Form.Control
                  type="number"
                  value={filtro.giorniASettimana || ""}
                  onChange={(e) => setFiltro({ ...filtro, giorniASettimana: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Costo massimo</Form.Label>
                <Form.Control
                  type="number"
                  value={filtro.costo || ""}
                  onChange={(e) => setFiltro({ ...filtro, costo: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Dal</Form.Label>
                <Form.Control
                  type="date"
                  value={filtro.dataInizio || ""}
                  onChange={(e) => setFiltro({ ...filtro, dataInizio: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Al</Form.Label>
                <Form.Control
                  type="date"
                  value={filtro.citta || ""}
                  onChange={(e) => setFiltro({ ...filtro, dataFine: e.target.value })}
                />
              </Col>
            </Row>

            <Row xs={1} md={2} lg={4} className="my-4 align-items-end">
              <Col>
                <Form.Group controlId="sortBy">
                  <Form.Label>Ordina per:</Form.Label>
                  <Form.Select
                    value={filtro.sortBy || "id"}
                    onChange={(e) => setFiltro({ ...filtro, sortBy: e.target.value })}
                  >
                    <option value="id">id</option>
                    <option value="costo">Prezzo</option>
                    <option value="nomeCorso">Nome corso</option>
                    <option value="dataInizio">data inizio</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId="sortDir">
                  <Form.Label>Direzione:</Form.Label>
                  <Form.Select
                    value={filtro.sortDir || "asc"}
                    onChange={(e) => setFiltro({ ...filtro, sortDir: e.target.value })}
                  >
                    <option value="desc">Decrescente</option>
                    <option value="asc">Crescente</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="pageSize">
                  <Form.Label>Corsi per pagina:</Form.Label>
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
                disabled={filtro.page >= Math.ceil(elementiTotali / filtro.size) - 1}
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
              {corsi ? (
                corsi.length > 0 ? (
                  corsi.map((corso) => (
                    <Col key={corso.id}>
                      <Card style={{ height: "450px" }}>
                        <div className="position-relative">
                          <Card.Img
                            variant="top"
                            src={corso.locandina}
                            alt={corso.nomeCorso}
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
                          {corso.costo}€
                        </span>
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
                              maxHeight: "70px",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 4,
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
                          <Button
                            variant="primary"
                            className="w-100 mt-auto"
                            onClick={() => navigate(`/corso/${corso.id}`)}
                          >
                            Dettagli
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <h1 className="text-center mt-5 metal-mania-regular mx-auto">Nessun Risultato</h1>
                )
              ) : (
                <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />
              )}
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
                  disabled={filtro.page >= Math.ceil(elementiTotali / filtro.size) - 1}
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
export default CercaCorsi;
