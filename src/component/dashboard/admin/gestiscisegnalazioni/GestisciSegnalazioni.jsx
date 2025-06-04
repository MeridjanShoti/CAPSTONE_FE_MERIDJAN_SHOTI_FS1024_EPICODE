import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
function GestisciSegnalazioni() {
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const [segnalazioni, setSegnalazioni] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [tipoSegnalazione, setTipoSegnalazione] = useState("");
  const [autore, setAutore] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [update, setUpdate] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    console.log(userType);
    if (userType && !userType.includes("ROLE_ADMIN")) {
      navigate("/");
    } else {
      const params = new URLSearchParams();
      if (tipoSegnalazione !== "") {
        params.append("tipoSegnalazione", tipoSegnalazione);
      }
      if (autore !== "") {
        params.append("autore", autore);
      }
      fetch(`${import.meta.env.VITE_API_URL}/segnalazioni?page=${page}&${params.toString()}`, {
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
          setSegnalazioni(data.content);
          setTotalPages(data.totalPages);
        })
        .catch((error) => {
          navigate("/");
        });
    }
  }, [user, userType, page, tipoSegnalazione, autore, update]);
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
        <div className="d-flex justify-content-between my-4">
          <div className="d-flex flex-column align-items-center">
            <Form.Label>filtra per Tipo:</Form.Label>
            <Form.Select value={tipoSegnalazione} onChange={(e) => setTipoSegnalazione(e.target.value)}>
              <option value="">Tutti</option>
              <option value="UTENTE">Utente</option>
              <option value="SCUOLA">Scuole</option>
              <option value="INSEGNANTE">Insegnanti</option>
              <option value="CORSO">Corsi</option>
              <option value="GESTORE_SP">Gestori Sale</option>
              <option value="SALA">Sale</option>
              <option value="ORGANIZZATORE">Organizzatori di eventi</option>
              <option value="EVENTO">Eventi</option>
              <option value="COMMENTO">Commenti</option>
              <option value="RECENSIONE_SALA">Recensioni Sala</option>
              <option value="RECENSIONE_SCUOLA">Recensioni Scuola</option>
            </Form.Select>
          </div>
          <div className="d-flex flex-column align-items-center">
            <Form.Label>filtra autore:</Form.Label>
            <Form.Control value={autore} onChange={(e) => setAutore(e.target.value)} />
          </div>
        </div>
        <h1 className="text-center metal-mania-regular my-4">Gestisci Corsi</h1>
        <Row xs={1} md={2} lg={4} className="g-3">
          {segnalazioni &&
            segnalazioni.map((segnalazione) => (
              <Col key={segnalazione.id}>
                <Card>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {segnalazione.tipoSegnalazione}
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
                      Da: {segnalazione.autore.username}
                      <br />
                      Motivazione: {segnalazione.descrizione}
                      id Elemento: {segnalazione.idElemento}
                    </Card.Text>
                    <div>
                      <Button
                        variant="primary"
                        className="w-100 mt-auto"
                        onClick={() => {
                          switch (true) {
                            case segnalazione.tipoSegnalazione === "UTENTE":
                              navigate(`/utenti/${segnalazione.idElemento}`);
                              break;
                            case segnalazione.tipoSegnalazione === "SCUOLA":
                              navigate(`/scuole/${segnalazione.idElemento}`);
                              break;
                            case segnalazione.tipoSegnalazione === "INSEGNANTE":
                              navigate(`/insegnanti/${segnalazione.idElemento}`);
                              break;
                            case segnalazione.tipoSegnalazione === "CORSO":
                              navigate(`/corsi/${segnalazione.idElemento}`);
                              break;
                            case segnalazione.tipoSegnalazione === "GESTORE_SP":
                              navigate(`/gestori/${segnalazione.idElemento}`);
                              break;
                            case segnalazione.tipoSegnalazione === "SALA":
                              navigate(`/sale-prove/${segnalazione.idElemento}`);
                              break;
                            case segnalazione.tipoSegnalazione === "ORGANIZZATORE":
                              navigate(`/organizzatori/${segnalazione.idElemento}`);
                              break;
                            case segnalazione.tipoSegnalazione === "EVENTO":
                              navigate(`/eventi/${segnalazione.idElemento}`);
                              break;
                            case segnalazione.tipoSegnalazione === "COMMENTO":
                              fetch(`${import.meta.env.VITE_API_URL}/commenti/${segnalazione.idElemento}`, {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              })
                                .then((res) => res.json())
                                .then((data) => {
                                  setAlertMessage("Commento:" + data.testo + " - Autore: " + data.autore.username);
                                  setAlertType("success");
                                  setShowAlert(true);
                                });
                              break;
                            case segnalazione.tipoSegnalazione === "RECENSIONE_SALA":
                              fetch(`${import.meta.env.VITE_API_URL}/recensioni-sala/${segnalazione.idElemento}`, {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              })
                                .then((res) => res.json())
                                .then((data) => {
                                  setAlertMessage(
                                    "testo:" + data.testo + " - Autore: " + data.autore.username,
                                    " - Voto: " + data.voto
                                  );
                                  setAlertType("success");
                                  setShowAlert(true);
                                });
                              break;
                            case segnalazione.tipoSegnalazione === "RECENSIONE_SCUOLA":
                              fetch(`${import.meta.env.VITE_API_URL}/recensioni-scuola/${segnalazione.idElemento}`, {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              })
                                .then((res) => res.json())
                                .then((data) => {
                                  setAlertMessage(
                                    "testo:" + data.testo + " - Autore: " + data.autore.username,
                                    " - Voto: " + data.voto
                                  );
                                  setAlertType("success");
                                  setShowAlert(true);
                                });
                              break;
                          }
                        }}
                      >
                        Dettagli
                      </Button>
                    </div>
                    <div className="d-flex gap-2 my-2">
                      <Button
                        variant="danger"
                        className="w-100 mt-auto"
                        onClick={() => {
                          fetch(`${import.meta.env.VITE_API_URL}/segnalazioni/rifiuta/${segnalazione.id}`, {
                            method: "DELETE",
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                          })
                            .then((res) => res.json())
                            .then((data) => {
                              setAlertMessage("segnalazione rifiutata con successo");
                              setAlertType("success");
                              setShowAlert(true);
                              setUpdate(update + 1);
                              setTimeout(() => {
                                setShowAlert(false);
                              }, 3000);
                            })
                            .catch((error) => {
                              setAlertMessage(error.message);
                              setAlertType("danger");
                              setShowAlert(true);
                              setTimeout(() => {
                                setShowAlert(false);
                              }, 3000);
                            });
                        }}
                      >
                        Rifiuta
                      </Button>
                      <Button
                        variant="success"
                        className="w-100 mt-auto"
                        onClick={() => {
                          fetch(`${import.meta.env.VITE_API_URL}/segnalazioni/approva/${segnalazione.id}`, {
                            method: "DELETE",
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                          })
                            .then((res) => res.json())
                            .then((data) => {
                              setAlertMessage(data.message);
                              setAlertType("success");
                              setShowAlert(true);
                              setUpdate(update + 1);
                              setTimeout(() => {
                                setShowAlert(false);
                              }, 3000);
                            })
                            .catch((error) => {
                              setAlertMessage(error.message);
                              setAlertType("danger");
                              setShowAlert(true);
                              setTimeout(() => {
                                setShowAlert(false);
                              });
                            }, 3000);
                        }}
                      >
                        Approva
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
        <Alert
          show={showAlert}
          variant={alertType}
          onClose={() => setShowAlert(false)}
          dismissible
          className="text-center my-4"
        >
          {alertMessage}
        </Alert>
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
export default GestisciSegnalazioni;
