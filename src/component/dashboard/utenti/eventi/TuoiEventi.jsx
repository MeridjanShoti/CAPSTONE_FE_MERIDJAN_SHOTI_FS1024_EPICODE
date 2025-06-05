import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

function TuoiEventi() {
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [elementiTotali, setElementiTotali] = useState(0);
  const [filtro, setFiltro] = useState({
    data1: null,
    data2: null,
    artista: null,
    soloFuturi: true,
    nomeParziale: null,
    page: 0,
    size: 10,
    sort: "dataEvento",
    sortDir: "desc",
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (userType && !userType.includes("ROLE_USER")) {
      navigate("/");
      return;
    }
    const params = new URLSearchParams();
    Object.entries(filtro).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });
    fetch(`${import.meta.env.VITE_API_URL}/prenotazioni-eventi?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero dei tuoi eventi");
        return res.json();
      })
      .then((data) => {
        setPrenotazioni(data.content);
        setElementiTotali(data.totalElements);
      })
      .catch((error) => {
        navigate("/");
      });
  }, [user, userType, filtro]);

  if (!userType) {
    return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />;
  }

  return (
    <>
      <h1 className="text-center metal-mania-regular my-4">I tuoi eventi</h1>
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
        <Row xs={1} md={2} lg={4} className="align-items-end my-4">
          <Col>
            <Form.Group controlId="sortBy">
              <Form.Label>Ordina per:</Form.Label>
              <Form.Select
                value={filtro.sort || "dataEvento"}
                onChange={(e) => setFiltro({ ...filtro, sort: e.target.value })}
              >
                <option value="dataEvento">Data evento</option>
                <option value="dataPrenotazione">Data prenotazione</option>
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
      {!prenotazioni || prenotazioni.length === 0 ? (
        <Container>
          <h2 className="text-center">Nessun Evento</h2>
          <p className="text-center">Cerca gli eventi che ti interessano!</p>
          <Button as={Link} to="/cerca-eventi" variant="primary" className="d-block mx-auto mt-3 text-decoration-none">
            DAJE
          </Button>
        </Container>
      ) : (
        <>
          <Container>
            <Row xs={1} md={2} lg={4} className="g-3">
              {prenotazioni.map((prenotazione) => (
                <Col key={prenotazione.id}>
                  <Card style={{ height: "400px" }}>
                    <Card.Img
                      variant="top"
                      src={prenotazione.evento.locandina}
                      alt={prenotazione.evento.nomeEvento}
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
                        {prenotazione.evento.nomeEvento}
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
                        {prenotazione.evento.dataEvento} - {prenotazione.evento.citta}
                        <br />
                        Artisti partecipanti: {prenotazione.evento.artistiPartecipanti.join(", ")}
                      </Card.Text>
                      <Button
                        variant="primary"
                        className="w-100 mt-auto"
                        onClick={() => navigate(`/prenotazioni-eventi/${prenotazione.id}`)}
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
      )}
    </>
  );
}

export default TuoiEventi;
