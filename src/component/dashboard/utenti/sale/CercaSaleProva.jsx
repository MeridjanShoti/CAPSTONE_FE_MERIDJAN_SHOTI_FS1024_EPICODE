import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { PersonFill } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
function CercaSaleProva() {
  const [filtro, setFiltro] = useState({
    citta: "",
    capienzaMin: 0,
    prezzoOrarioMax: "",
    giornoApertura: "",
    page: 0,
    size: 10,
    sortBy: "id",
    sortDir: "asc",
  });
  const [sale, setSale] = useState([]);
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
      fetch(`${apiUrl}/saleprove?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Errore nel recupero delle sale prove");
          return res.json();
        })
        .then((data) => {
          setSale(data.content);
          setElementiTotali(data.totalElements);
        })
        .catch(() => {
          navigate("/");
        });
    }
  }, [userType, navigate, filtro, apiUrl, token]);

  return (
    <>
      <h1 className="text-center metal-mania-regular my-4">Cerca Sale Prove</h1>
      {userType && userType.includes("ROLE_USER") ? (
        <>
          <Container className="bg-secondary my-4 text-white p-3 rounded-3 border border-primary border-3">
            <Row xs={1} md={2} lg={4}>
              <Col>
                <Form.Label>Aperte il giorno: </Form.Label>
                <Form.Select
                  value={filtro.giornoApertura || ""}
                  onChange={(e) => setFiltro({ ...filtro, giornoApertura: e.target.value })}
                >
                  <option value="">Tutti</option>
                  <option value="MONDAY">Lunedì</option>
                  <option value="TUESDAY">Martedi</option>
                  <option value="WEDNESDAY">Mercoledi</option>
                  <option value="THURSDAY">Giovedi</option>
                  <option value="FRIDAY">Venerdi</option>
                  <option value="SATURDAY">Sabato</option>
                  <option value="SUNDAY">Domenica</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label>Capienza minima:</Form.Label>
                <Form.Control
                  type="number"
                  value={filtro.capienzaMin || ""}
                  onChange={(e) => setFiltro({ ...filtro, capienzaMin: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Prezzo orario max:</Form.Label>
                <Form.Control
                  type="text"
                  value={filtro.prezzoOrarioMax || ""}
                  onChange={(e) => setFiltro({ ...filtro, prezzoOrarioMax: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Città:</Form.Label>
                <Form.Control
                  type="text"
                  value={filtro.citta || ""}
                  onChange={(e) => setFiltro({ ...filtro, citta: e.target.value })}
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
                    <option value="prezzoOrario">Prezzo</option>
                    <option value="nomeSala">Nome Sala</option>
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
                  <Form.Label>Sale per pagina:</Form.Label>
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
              {sale &&
                sale.map((sala) => (
                  <Col key={sala.id}>
                    <Card style={{ height: "450px" }}>
                      <div className="position-relative">
                        <Card.Img
                          variant="top"
                          src={sala.copertinaSala}
                          alt={sala.nomeSala}
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
                        {sala.prezzoOrario}€
                      </span>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {sala.nomeSala}
                        </Card.Title>
                        <Card.Text
                          style={{
                            maxHeight: "70px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          Max <PersonFill className="align-middle" />: {sala.capienzaMax} - {sala.citta}
                          <br />
                          {sala.orarioApertura} - {sala.orarioChiusura}
                          <br />
                          <strong>
                            {giorniOrdinati
                              .filter((g) => sala?.giorniApertura?.includes(g.eng))
                              .map((g) => g.ita)
                              .join("-")}
                          </strong>
                        </Card.Text>
                        <Button
                          variant="primary"
                          className="w-100 mt-auto"
                          onClick={() => navigate(`/sale-prove/${sala.id}`)}
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
export default CercaSaleProva;
