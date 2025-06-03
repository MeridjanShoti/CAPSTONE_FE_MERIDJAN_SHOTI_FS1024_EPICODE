import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import GestisciPresenza from "./GestisciPresenza";
import AssegnaVoto from "./AssegnaVoto";
import DettagliStudente from "./DettagliStudente";
function GestisciStudenti() {
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const [studenti, setStudenti] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [corsi, setCorsi] = useState([]);
  const [idCorso, setIdCorso] = useState(null);
  const [presenzaStudenteSelezionato, setPresenzaStudenteSelezionato] = useState(null);
  const [votoStudenteSelezionato, setVotoStudenteSelezionato] = useState(null);
  const [studenteSelezionato, setStudenteSelezionato] = useState(null);
  const [update, setUpdate] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/corsi/insegnante`, {
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
        setCorsi(data);
        setIdCorso(data[0].id);
      })
      .catch((error) => {
        navigate("/");
      });
  }, [user]);
  useEffect(() => {
    if (corsi && corsi.length > 0) {
      if (userType && !userType.includes("ROLE_INSEGNANTE")) {
        navigate("/");
      } else {
        fetch(`${import.meta.env.VITE_API_URL}/iscrizioni/scuole/${idCorso}?page=${page}`, {
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
            setStudenti(data.content);
            setTotalPages(data.totalPages);
          })
          .catch((error) => {
            navigate("/");
          });
      }
    }
  }, [user, userType, page, idCorso, update]);

  return (
    <>
      <Container>
        {presenzaStudenteSelezionato && (
          <GestisciPresenza
            show={true}
            idCorso={idCorso}
            idStudente={presenzaStudenteSelezionato}
            onHide={() => setPresenzaStudenteSelezionato(null)}
            setUpdate={setUpdate}
          />
        )}
        {votoStudenteSelezionato && (
          <AssegnaVoto
            show={true}
            idCorso={idCorso}
            idStudente={votoStudenteSelezionato}
            onHide={() => setVotoStudenteSelezionato(null)}
            setUpdate={setUpdate}
          />
        )}
        {studenteSelezionato && (
          <DettagliStudente
            show={true}
            idCorso={idCorso}
            studente={studenteSelezionato}
            onHide={() => setStudenteSelezionato(null)}
          />
        )}
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

        <h1 className="text-center metal-mania-regular my-4">Gestisci Studenti</h1>

        {corsi && corsi.length > 0 && (
          <>
            <Form.Label>filtra per corso</Form.Label>
            <Form.Select value={idCorso} onChange={(e) => setIdCorso(e.target.value)}>
              {corsi.map((corso) => (
                <option key={corso.id} value={corso.id}>
                  {corso.nomeCorso}
                </option>
              ))}
            </Form.Select>
          </>
        )}

        {corsi && corsi.length > 0 && idCorso && (
          <Row xs={1} md={2} lg={4} className="g-3">
            {studenti && studenti.length > 0 ? (
              <>
                {studenti &&
                  studenti.map((studente) => (
                    <Col key={studente.id} className="my-4">
                      <Card>
                        <Card.Img
                          variant="top"
                          src={studente.utente.avatar}
                          alt={studente.utente.nome + " " + studente.utente.cognome}
                          style={{ height: "200px", objectFit: "cover", objectPosition: "center", cursor: "pointer" }}
                          onClick={() => navigate(`/profile/utenti/${studente.utente.id}`)}
                        />
                        <Card.Body className="d-flex flex-column">
                          <Row className="my-2">
                            <Col className="d-flex justify-content-center">
                              <Button
                                variant="primary"
                                className="me-2"
                                onClick={() => setPresenzaStudenteSelezionato(studente.utente.id)}
                              >
                                Presenza
                              </Button>
                            </Col>
                            <Col className="d-flex justify-content-center">
                              <Button
                                variant="primary"
                                className="me-2"
                                onClick={() => setVotoStudenteSelezionato(studente.utente.id)}
                              >
                                Valutazione
                              </Button>
                            </Col>
                          </Row>
                          <Card.Title
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              cursor: "pointer",
                            }}
                            onClick={() => navigate(`/profile/utenti/${studente.utente.id}`)}
                          >
                            {studente.utente.nome} {studente.utente.cognome}
                          </Card.Title>
                          <Card.Text>
                            <strong> {studente.utente.email}</strong>
                            <br />
                            {studente &&
                              studente.presenze &&
                              studente.presenze.length > 0 &&
                              `Presenze: ${(
                                (studente?.presenze.filter((p) => p.presenza).length / studente?.presenze.length) *
                                100
                              ).toFixed(2)}
                      %`}
                            <br />
                            {studente &&
                              studente.valutazioni &&
                              studente.valutazioni.length > 0 &&
                              `Media: ${(
                                studente.valutazioni.reduce((acc, val) => acc + val, 0) / studente.valutazioni.length
                              ).toFixed(2)}`}
                          </Card.Text>
                          <Button
                            variant="info"
                            className="w-100 mt-auto"
                            onClick={() => setStudenteSelezionato(studente)}
                          >
                            Dettagli
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
              </>
            ) : (
              <h2 className="text-center metal-mania-regular my-4">Nessun studente trovato</h2>
            )}
          </Row>
        )}

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

export default GestisciStudenti;
