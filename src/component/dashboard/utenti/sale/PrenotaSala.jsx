import { useEffect, useState } from "react";
import { Col, Row, Spinner, Button, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import itLocale from "@fullcalendar/core/locales/it";

function PrenotaSala() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const [sala, setSala] = useState(null);
  const [giorniDisponibili, setGiorniDisponibili] = useState([]);
  const [slots, setSlots] = useState([]);
  const [giornoSelezionato, setGiornoSelezionato] = useState(null);
  const [usaPagamentoInStruttura, setUsaPagamentoInStruttura] = useState(false);

  const isDateSelectable = (date) => {
    const giorno = date.getDay();
    return giorniDisponibili.includes(giorno);
  };

  const handleDateClick = (arg) => {
    const giorno = arg.dateStr;
    setGiornoSelezionato(giorno);

    fetch(`${import.meta.env.VITE_API_URL}/prenotazioni-sala-prove/disponibilita/${id}?giorno=${giorno}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Disponibilità non trovata");
        return res.json();
      })
      .then((data) => {
        setSlots(data);
      })
      .catch((error) => {
        console.error("Errore nel recupero della disponibilità:", error);
      });
  };

  const handleSlotClick = (slot) => {
    const prenotazione = {
      giorno: giornoSelezionato,
      orario: slot,
    };

    if (usaPagamentoInStruttura) {
      fetch("/api/prenota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prenotazione),
      }).then(() => {
        alert("Prenotazione effettuata!");
      });
    } else {
      // Modal pagamento da implementare
      // onPrenotazione(prenotazione);
      // showModalePagamento(true);
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/saleprove/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Sala non trovata o accesso non autorizzato");
        return res.json();
      })
      .then((data) => {
        setSala(data);

        const giorni = data.giorniApertura.map((g) => {
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
      .catch(() => {
        navigate("/");
      });
  }, [id]);

  if (userType && !userType.includes("ROLE_USER")) navigate("/");

  return (
    <>
      {sala ? (
        <>
          <Container>
            <Row>
              <Col xs={3} className="d-flex justify-content-center align-items-center">
                <img
                  src={sala.copertinaSala}
                  className="img-fluid rounded-4"
                  alt={sala.nomeSala}
                  style={{ maxHeight: "100px", objectFit: "cover", objectPosition: "center", width: "auto" }}
                />
              </Col>
              <Col>
                <h1 className="text-center mt-5 mb-4 metal-mania-regular">Prenota Sala Prove</h1>
                <h2 className="text-center mb-4">{sala.nomeSala}</h2>
              </Col>
            </Row>
          </Container>
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
                <label>
                  <input
                    type="checkbox"
                    checked={usaPagamentoInStruttura}
                    onChange={(e) => setUsaPagamentoInStruttura(e.target.checked)}
                  />{" "}
                  Paga in struttura
                </label>
              </div>
            </Col>
            <Col xs={12} lg={6} className="mx-auto p-4">
              {giornoSelezionato && (
                <div className="border border-primary border-3 p-3 rounded-4 bg-white">
                  <h3>Slot disponibili per {giornoSelezionato}</h3>
                  {slots.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {slots.map((slot, idx) => (
                        <Button key={idx} variant="outline-primary" onClick={() => handleSlotClick(slot)}>
                          {slot.inizio.slice(11, 16)} - {slot.fine.slice(11, 16)}
                        </Button>
                      ))}
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

export default PrenotaSala;
