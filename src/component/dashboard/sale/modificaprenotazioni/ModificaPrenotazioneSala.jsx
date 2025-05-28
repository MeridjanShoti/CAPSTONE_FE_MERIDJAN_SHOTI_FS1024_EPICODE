import { useEffect, useState } from "react";
import { Col, Row, Spinner, Button, Container, Form, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import itLocale from "@fullcalendar/core/locales/it";

function ModificaPrenotazioneSala() {
  const { idPrenotazione } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;

  const [modalShow, setModalShow] = useState(false);
  const [sala, setSala] = useState(null);
  const [giorniDisponibili, setGiorniDisponibili] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [slots, setSlots] = useState([]);
  const [giornoSelezionato, setGiornoSelezionato] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [body, setBody] = useState({
    inizio: null,
    fine: null,
    numMembri: 1,
    pagata: false,
  });

  const isDateSelectable = (date) => {
    const giorno = date.getDay();
    return giorniDisponibili.includes(giorno);
  };

  const handleConferma = () => {
    fetch(`${import.meta.env.VITE_API_URL}/prenotazioni-sala-prove/${idPrenotazione}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nella prenotazione");
        setAlertMessage("Prenotazione aggiornata con successo");
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
      })
      .catch((error) => {
        setAlertMessage(error.message);
        setAlertType("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
      });
  };

  const handleDateClick = (arg) => {
    const giorno = arg.dateStr;
    setGiornoSelezionato(giorno);
    fetch(
      `${import.meta.env.VITE_API_URL}/prenotazioni-sala-prove/disponibilita-update/${idPrenotazione}?giorno=${giorno}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Disponibilità non trovata");
        return res.json();
      })
      .then((data) => setSlots(data))
      .catch((error) => console.error("Errore nel recupero della disponibilità:", error));
  };

  const handleSlotClick = (e, slot) => {
    const selectedRange = selectedSlots[0];

    const slotStart = new Date(slot.inizio).getTime();
    const slotEnd = new Date(slot.fine).getTime();

    const isInsideSelectedRange =
      selectedRange &&
      new Date(selectedRange.inizio).getTime() <= slotStart &&
      new Date(selectedRange.fine).getTime() >= slotEnd;

    // ➤ Se clicchi su uno slot già selezionato → deseleziona
    if (isInsideSelectedRange) {
      setSelectedSlots([]);
      setBody({ ...body, inizio: null, fine: null });
      return;
    }

    if (selectedSlots.length === 1) {
      const updated = [selectedSlots[0], slot].sort((a, b) => new Date(a.inizio) - new Date(b.inizio));
      setSelectedSlots([{ inizio: updated[0].inizio, fine: updated[1].fine }]);
      setBody({ ...body, inizio: updated[0].inizio, fine: updated[1].fine });
    } else {
      setSelectedSlots([{ inizio: slot.inizio, fine: slot.fine }]);
      setBody({ ...body, inizio: slot.inizio, fine: slot.fine });
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/prenotazioni-sala-prove/${idPrenotazione}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Prenotazione non trovata o accesso non autorizzato");
        return res.json();
      })
      .then((data) => {
        setSala(data.salaProve);
        setBody({
          inizio: data.inizio,
          fine: data.fine,
          numMembri: data.numMembri,
          pagata: data.pagata,
        });

        setSelectedSlots([{ inizio: data.inizio, fine: data.fine }]);

        const giorno = data.inizio.split("T")[0];
        setGiornoSelezionato(giorno);

        fetch(
          `${
            import.meta.env.VITE_API_URL
          }/prenotazioni-sala-prove/disponibilita-update/${idPrenotazione}?giorno=${giorno}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
          .then((res) => {
            if (!res.ok) throw new Error("Disponibilità non trovata");
            return res.json();
          })
          .then((data) => setSlots(data))
          .catch((error) => console.error("Errore nel recupero della disponibilità:", error));

        const giorni = data.salaProve.giorniApertura.map((g) => {
          const giorniMap = {
            MONDAY: 1,
            TUESDAY: 2,
            WEDNESDAY: 3,
            THURSDAY: 4,
            FRIDAY: 5,
            SATURDAY: 6,
            SUNDAY: 0,
          };
          return giorniMap[g];
        });
        setGiorniDisponibili(giorni);
      })
      .catch(() => navigate("/"));
  }, [idPrenotazione]);

  if (userType && !userType.includes("ROLE_GESTORE_SP")) navigate("/");

  return (
    <>
      {sala ? (
        <>
          <Container>
            <Row>
              <Col>
                <h1 className="text-center metal-mania-regular">Prenota</h1>
                <h2 className="text-center">{sala.nomeSala}</h2>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={6} className="mx-auto">
                <div className="p-4 border border-primary rounded-4 bg-secondary text-white shadow-sm">
                  <Form.Group controlId="numMembri" className="mb-3">
                    <Form.Label className="fw-bold">Numero Membri (max {sala.capienzaMax}):</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      max={sala.capienzaMax}
                      value={body.numMembri}
                      onChange={(e) => setBody({ ...body, numMembri: e.target.value })}
                      placeholder="Inserisci il numero di membri"
                    />
                  </Form.Group>
                  <label>
                    <input
                      type="checkbox"
                      checked={body.pagata}
                      onChange={(e) => setBody({ ...body, pagata: e.target.checked })}
                    />{" "}
                    Pagato
                  </label>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="primary"
                      disabled={!body.inizio || !body.fine || body.numMembri < 1}
                      onClick={handleConferma}
                    >
                      Conferma
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          <Row className="mt-4">
            <Col xs={12} className="text-center">
              <Alert show={showAlert} variant={alertType} onClose={() => setShowAlert(false)} dismissible>
                {alertMessage}
              </Alert>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={6} className="mx-auto p-4">
              <div className="border border-primary border-3 p-3 rounded-4 bg-white d-flex flex-column w-100">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  dateClick={(arg) => {
                    if (isDateSelectable(arg.date)) handleDateClick(arg);
                  }}
                  height={"auto"}
                  locale={itLocale}
                  firstDay={1}
                  selectable={false}
                  validRange={{ start: new Date().toISOString().split("T")[0] }}
                  dayCellDidMount={(info) => {
                    const day = info.date.getDay();
                    if (giorniDisponibili.includes(day)) {
                      info.el.style.cursor = "pointer";
                    } else {
                      info.el.style.backgroundColor = "#e0e0e0";
                      info.el.style.opacity = "0.5";
                      info.el.style.pointerEvents = "none";
                      info.el.style.cursor = "not-allowed";
                      info.el.title = "Sala chiusa";
                    }
                  }}
                />
              </div>
            </Col>
            <Col xs={12} lg={6} className="mx-auto p-4">
              {giornoSelezionato && (
                <div className="border border-primary border-3 p-3 rounded-4 bg-white">
                  <h3 className="metal-mania-regular">Slot disponibili per {giornoSelezionato}</h3>
                  {slots.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {slots.map((slot, idx) => {
                        const slotStart = new Date(slot.inizio);
                        const slotEnd = new Date(slot.fine);

                        const isSelected =
                          selectedSlots.length > 0 &&
                          (() => {
                            const selStart = new Date(selectedSlots[0].inizio);
                            const selEnd = new Date(selectedSlots[0].fine);
                            return slotStart >= selStart && slotEnd <= selEnd;
                          })();

                        return (
                          <button
                            key={idx}
                            className={`slot btn btn-outline-primary ${isSelected ? "bg-primary text-white" : ""}`}
                            data-inizio={slot.inizio}
                            data-fine={slot.fine}
                            onClick={(e) => handleSlotClick(e, slot)}
                          >
                            {slot.inizio.slice(11, 16)} - {slot.fine.slice(11, 16)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p>Nessuno slot disponibile.</p>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />
      )}
    </>
  );
}

export default ModificaPrenotazioneSala;
