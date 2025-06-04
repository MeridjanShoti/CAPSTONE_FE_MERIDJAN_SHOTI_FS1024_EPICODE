import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import itLocale from "@fullcalendar/core/locales/it";
import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import AssegnaInsegnanteModal from "./AssegnaInsegnanteModal";
import PagaCorsoModal from "./PagaCorsoModal";
import SegnalazioneModal from "../../../segnalazioni/SegnalazioneModal";
import { FlagFill } from "react-bootstrap-icons";
function CorsoDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const [lezioni, setLezioni] = useState([]);
  const [showSegnalazione, setShowSegnalazione] = useState(false);
  const [update, setUpdate] = useState(0);
  const [showAssegnaInsegnante, setShowAssegnaInsegnante] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [iscrizione, setIscrizione] = useState(null);
  const [mostraValutazioni, setMostraValutazioni] = useState(false);
  const [mostraPresenze, setMostraPresenze] = useState(false);
  const [corso, setCorso] = useState({
    id: "",
    nomeCorso: "",
    strumenti: [],
    scuola: null,
    maxPartecipanti: "",
    minPartecipanti: "",
    partecipanti: [],
    giorniLezione: [],
    obiettivi: "",
    livello: "",
    linkLezione: null,
    costo: "",
    note: "",
    dataInizio: "",
    dataFine: "",
    orarioInizio: "",
    orarioFine: "",
    locandina: null,
    statoCorso: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const giorniOrdinati = [
    { eng: "MONDAY", ita: "Lunedì" },
    { eng: "TUESDAY", ita: "Martedì" },
    { eng: "WEDNESDAY", ita: "Mercoledì" },
    { eng: "THURSDAY", ita: "Giovedì" },
    { eng: "FRIDAY", ita: "Venerdì" },
    { eng: "SATURDAY", ita: "Sabato" },
    { eng: "SUNDAY", ita: "Domenica" },
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/corsi/complete/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Prima fetch fallita");
        return res.json();
      })
      .then((data) => {
        setCorso({
          ...data,
        });
        if (userType && !userType.includes("ROLE_SCUOLA")) {
          fetch(`${import.meta.env.VITE_API_URL}/iscrizioni/corso/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Secondo fetch fallita");
              return res.json();
            })
            .then((data) => {
              setIscrizione(data);
            })
            .catch((error) => {
              console.error("Errore nel recupero delle iscrizioni:", error);
            });
        }
      })
      .catch(() => {
        fetch(`${import.meta.env.VITE_API_URL}/corsi/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Secondo fetch fallita");
            return res.json();
          })
          .then((data) => {
            setCorso({
              ...corso,
              ...data,
            });
          })
          .catch((error) => {
            navigate(-1);
          });
      });
  }, [user, userType, id, update]);
  useEffect(() => {
    if (corso.id !== "" && corso.orarioInizio && corso.orarioFine) {
      fetch(`${import.meta.env.VITE_API_URL}/corsi/${id}/date-lezione`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((dates) => {
          const lezioni = dates.map((date) => ({
            title: `${corso.orarioInizio.slice(0, 5)} - ${corso.orarioFine.slice(0, 5)}`,
            start: `${date}T${corso.orarioInizio}`,
            end: `${date}T${corso.orarioFine}`,
            allDay: true,
          }));
          setLezioni(lezioni);
        });
    }
  }, [corso.id, corso.orarioInizio, corso.orarioFine]);

  const handleDelete = () => {
    confirm("Sei sicuro di voler eliminare il corso?") &&
      fetch(`${import.meta.env.VITE_API_URL}/corsi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setAlertMessage("Corso eliminato con successo");
            setAlertType("success");
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
              navigate("/gestisci-corsi");
            }, 5000);
          } else {
            throw new Error(res);
          }
        })
        .catch((error) => {
          setAlertMessage(error.message);
          setAlertType("danger");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
        });
  };
  return (
    <>
      {corso && corso.id !== "" ? (
        <Container fluid>
          <h1 className="text-center metal-mania-regular my-4">{corso?.nomeCorso}</h1>
          <p className="text-center">
            by{" "}
            {corso.scuola && (
              <Link to={`/scuole/${corso?.scuola.id}`} className="text-center">
                {corso?.scuola.ragioneSociale}
              </Link>
            )}
          </p>
          <p className="text-center ">Massimo Partecipanti: {corso?.maxPartecipanti} persone</p>
          <p className="text-center ">
            Stato Corso:{" "}
            <strong>
              {corso?.statoCorso === "IN_PROGRAMMA"
                ? "In programma"
                : corso?.statoCorso === "IN_CORSO"
                ? "In corso"
                : "Terminato"}
            </strong>
          </p>

          <Row xs={1} lg={2} className="g-3">
            <Col className="d-flex justify-content-center p-3">
              <div style={{ position: "relative" }}>
                <img
                  src={corso?.locandina}
                  alt={corso?.nomeCorso}
                  className="img-fluid rounded-3 border border-primary border-3"
                  style={{ maxWidth: "100%", height: "auto", objectFit: "cover", objectPosition: "center" }}
                />
                {corso?.scuola?.id !== user.id && corso?.insegnante?.id !== user.id && (
                  <div style={{ position: "absolute", top: "10px", right: "50px" }}>
                    <Button
                      as={Link}
                      onClick={() => setShowSegnalazione(true)}
                      variant="primary"
                      className="d-block mx-auto mt-2 position-absolute top-0"
                    >
                      <FlagFill />
                    </Button>
                    <SegnalazioneModal
                      id={corso.id}
                      onHide={() => setShowSegnalazione(false)}
                      show={showSegnalazione}
                      tipoSegnalazione="CORSO"
                      titolo={corso?.nomeCorso}
                    />
                  </div>
                )}
              </div>
            </Col>
            <Col className="p-3">
              <Row>
                <Col>
                  <h3 className="metal-mania-regular">
                    {corso?.dataInizio.slice(0, 10)} - {corso?.dataFine.slice(0, 10)}
                  </h3>
                  <p>
                    <strong>Orari</strong> {corso?.orarioInizio.slice(0, 5)} - {corso?.orarioFine.slice(0, 5)}
                  </p>
                  <p>
                    A cura di{" "}
                    <Link to={`/insegnanti/${corso?.insegnante?.id}`}>
                      {corso?.insegnante?.nome} {corso?.insegnante?.cognome}
                    </Link>
                  </p>
                </Col>
                <Col>
                  <p>Frequenza:</p>
                  <p className="fw-bold">
                    {giorniOrdinati
                      .filter((g) => corso?.giorniLezione?.includes(g.eng))
                      .map((g) => g.ita)
                      .join(", ")}
                  </p>
                  <p>
                    <strong>Prezzo:</strong> {corso?.costo}
                  </p>
                </Col>
              </Row>
              <p className="bg-secondary text-white p-3 border border-primary border-3 rounded-3">{corso?.note}</p>
              <hr />
              <h4 className="metal-mania-regular my-3 text-center">Strumenti</h4>
              <p className="text-center">{corso?.strumenti.join(", ")}</p>
              <hr />
              <h4 className="metal-mania-regular my-3 text-center">Obiettivi Del Corso</h4>
              <p>{corso?.obiettivi}</p>
              <hr />
              {corso?.linkLezione && (
                <>
                  <h4 className="metal-mania-regular my-3 text-center">Link della lezione</h4>
                  <p className="text-center">
                    <a
                      href={corso.linkLezione.startsWith("http") ? corso?.linkLezione : "https://" + corso?.linkLezione}
                    >
                      {corso?.linkLezione}
                    </a>
                  </p>
                </>
              )}

              {userType && userType.includes("ROLE_USER") && corso.linkLezione === null && (
                <>
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => {
                      setShowModal(true);
                    }}
                  >
                    {" "}
                    Iscriviti
                  </Button>
                  <PagaCorsoModal
                    show={showModal}
                    id={id}
                    corso={corso}
                    setUpdate={setUpdate}
                    onHide={() => setShowModal(false)}
                  />
                </>
              )}
              {userType && userType.includes("ROLE_SCUOLA") && corso?.scuola && user.id === corso?.scuola.id && (
                <div className="d-flex flex-column">
                  <div className="d-flex  justify-content-between align-items-center w-100">
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={() => {
                        navigate(`/edit-corso/${id}`);
                      }}
                    >
                      {" "}
                      Modifica corso
                    </Button>
                    <Button variant="info" className="mt-3" onClick={() => setShowAssegnaInsegnante(true)}>
                      {" "}
                      Assegna insegnante
                    </Button>
                    <AssegnaInsegnanteModal
                      show={showAssegnaInsegnante}
                      id={id}
                      setUpdate={setUpdate}
                      insegnante={corso?.insegnante}
                      onHide={() => setShowAssegnaInsegnante(false)}
                    />
                    <Button variant="danger" className="mt-3 border border-primary border-2" onClick={handleDelete}>
                      {" "}
                      Elimina Corso
                    </Button>
                  </div>
                  <Alert show={showAlert} variant={alertType} className="mt-3">
                    {alertMessage}
                  </Alert>
                </div>
              )}
              {corso?.dataInizio && corso?.dataInizio !== "" && (
                <div className="my-3 bg-white p-3 rounded-3 border border-primary border-3">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    initialDate={
                      new Date(corso.dataInizio) > new Date()
                        ? corso.dataInizio
                        : new Date().toISOString().split("T")[0]
                    }
                    events={lezioni}
                    locale={itLocale}
                    height="auto"
                  />
                </div>
              )}
            </Col>
          </Row>
          {iscrizione && (iscrizione?.presenze.length > 0 || iscrizione?.valutazioni.length > 0) && (
            <Container>
              <Row xs={1} md={2} className="g-3 my-3 border border-primary border-3 rounded-3 bg-secondary text-white">
                {iscrizione?.presenze && iscrizione.presenze.length > 0 && (
                  <Col className="d-flex flex-column align-items-center">
                    <h4 className="metal-mania-regular my-3 text-center">Presenze:</h4>
                    <p className="text-center text-white fw-bold">
                      {(
                        (iscrizione?.presenze.filter((p) => p.presenza).length / iscrizione?.presenze.length) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                    {mostraPresenze && (
                      <ul className="bg-light p-3 rounded-3 border border-primary border-3 text-dark">
                        {iscrizione.presenze.map((p, i) => (
                          <li key={i}>
                            {p.data.slice(0, 10)}:{" "}
                            {p.presenza ? (
                              <strong className="text-success">Presente</strong>
                            ) : (
                              <strong className="text-danger">Assente</strong>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button
                      variant="primary"
                      className="my-3"
                      onClick={() => {
                        setMostraPresenze(!mostraPresenze);
                      }}
                    >
                      {mostraPresenze ? "Nascondi" : "Mostra tutto"}
                    </Button>
                  </Col>
                )}
                {iscrizione.valutazioni && iscrizione.valutazioni.length > 0 && (
                  <Col className="d-flex flex-column align-items-center">
                    <h4 className="metal-mania-regular my-3 text-center">Media:</h4>
                    <p className="text-center text-white">
                      <strong>
                        {(
                          iscrizione.valutazioni.reduce((acc, val) => acc + val, 0) / iscrizione.valutazioni.length
                        ).toFixed(2)}
                      </strong>
                      /10
                    </p>
                    {mostraValutazioni && (
                      <ul className="bg-light p-3 rounded-3 border border-primary border-3 text-dark">
                        {iscrizione.valutazioni.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    )}
                    <Button
                      variant="primary"
                      className="my-3"
                      onClick={() => {
                        setMostraValutazioni(!mostraValutazioni);
                      }}
                    >
                      {mostraValutazioni ? "Nascondi" : "Mostra tutto"}
                    </Button>
                  </Col>
                )}
              </Row>
            </Container>
          )}
        </Container>
      ) : (
        <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />
      )}
    </>
  );
}
export default CorsoDetail;
