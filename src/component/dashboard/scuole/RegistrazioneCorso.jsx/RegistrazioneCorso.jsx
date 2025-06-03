import { useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

function RegistrazioneCorso() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const { id } = useParams();
  const token = useSelector((state) => state.token.token);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [corso, setCorso] = useState({
    nomeCorso: "",
    note: "",
    dataInizio: "",
    dataFine: "",
    orarioInizio: "",
    orarioFine: "",
    locandina: null,
    livello: "PRINCIPIANTE",
    linkLezione: "",
    costo: "",
    strumenti: null,
    maxPartecipanti: "",
    minPartecipanti: "",
    giorniLezione: [],
    obiettivi: "",
  });
  const handlesubmit = async (e) => {
    e.preventDefault();

    const endpoint = id ? `${apiUrl}/corsi/${id}` : `${apiUrl}/corsi`;
    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...corso,
          strumenti: corso.strumenti ? corso.strumenti.split(",").map((s) => s.trim()) : [],
        }),
      });

      if (!res.ok) throw new Error("Errore durante il salvataggio del corso");
      setAlertMessage("Corso salvato con successo");
      setAlertType("success");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate("/dashboard");
      }, 5000);
    } catch (error) {
      setAlertMessage(error.message);
      setAlertType("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };
  useEffect(() => {
    if (id) {
      fetch(`${apiUrl}/corsi/complete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.json());
          return res.json();
        })
        .then((data) => {
          setCorso({
            nomeCorso: data.nomeCorso ? data.nomeCorso : "",
            note: data.note ? data.note : "",
            strumenti: data.strumenti ? data.strumenti.join(",") : "",
            livello: data.livello ? data.livello : "",
            linkLezione: data.linkLezione ? data.linkLezione : "",
            costo: data.costo ? data.costo : "",
            obiettivi: data.obiettivi ? data.obiettivi : "",
            giorniLezione: data.giorniLezione ? data.giorniLezione : "",
            minPartecipanti: data.minPartecipanti ? data.minPartecipanti : "",
            maxPartecipanti: data.maxPartecipanti ? data.maxPartecipanti : "",
            dataInizio: data.dataInizio ? data.dataInizio : "",
            dataFine: data.dataFine ? data.dataFine : "",
            orarioInizio: data.orarioInizio ? data.orarioInizio : "",
            orarioFine: data.orarioFine ? data.orarioFine : "",
            locandina: data.locandina ? data.locandina : null,
          });
        })
        .catch((error) => {
          console.error("Errore nel recupero del corso:", error.message);
        });
    }
  }, [id]);

  useEffect(() => {
    if (userType && !userType.includes("ROLE_SCUOLA")) {
      navigate(-1);
    }
  }, [userType]);

  return (
    <div>
      <h1 className="text-center metal-mania-regular my-4">Registrazione Corso</h1>

      <Container>
        <Alert show={showAlert} variant={alertType}>
          {alertMessage}
        </Alert>
        <Form onSubmit={(e) => handlesubmit(e)}>
          <Form.Group className="mb-3" controlId="formBasicNomeCorso">
            <Form.Label>Nome Corso</Form.Label>
            <Form.Control
              onChange={(e) => setCorso({ ...corso, nomeCorso: e.target.value })}
              value={corso.nomeCorso}
              type="text"
              placeholder="Inserisci il nome del corso"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicNote">
            <Form.Label>Note</Form.Label>
            <Form.Control
              onChange={(e) => setCorso({ ...corso, note: e.target.value })}
              value={corso.note}
              as="textarea"
              rows={3}
              placeholder="Inserisci la descrizione del corso"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLinkLezione">
            <Form.Label>Link Aula Virtuale</Form.Label>
            <Form.Control
              onChange={(e) => setCorso({ ...corso, linkLezione: e.target.value })}
              value={corso.linkLezione}
              type="text"
              placeholder="Inserisci il link dell'aula"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLivello">
            <Form.Label>Livello Corso</Form.Label>
            <Form.Select onChange={(e) => setCorso({ ...corso, livello: e.target.value })} value={corso.livello}>
              <option value={"PRINCIPIANTE"}>Principiante</option>
              <option value={"MEDIO"}>Medio</option>
              <option value={"AVANZATO"}>Avanzato</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCosto">
            <Form.Label>Costo</Form.Label>
            <Form.Control
              onChange={(e) => setCorso({ ...corso, costo: e.target.value })}
              value={corso.costo}
              type="number"
              placeholder="Inserisci il costo"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDataInizio">
            <Form.Label>Data Inizio</Form.Label>
            <Form.Control
              onChange={(e) => setCorso({ ...corso, dataInizio: e.target.value })}
              value={corso.dataInizio}
              type="date"
              placeholder="Inserisci la data di inizio del corso"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDataFine">
            <Form.Label>Data Fine</Form.Label>
            <Form.Control
              onChange={(e) => setCorso({ ...corso, dataFine: e.target.value })}
              value={corso.dataFine}
              type="date"
              placeholder="Inserisci la data di fine del corso"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicOrarioInizio">
            <Form.Label>Orario Inizio</Form.Label>
            <Form.Control
              onChange={(e) => setCorso({ ...corso, orarioInizio: e.target.value })}
              value={corso.orarioInizio}
              type="time"
              placeholder="Inserisci l'orario di inizio delle lezioni"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicOrarioFine">
            <Form.Label>Orario Fine</Form.Label>
            <Form.Control
              onChange={(e) => setCorso({ ...corso, orarioFine: e.target.value })}
              value={corso.orarioFine}
              type="time"
              placeholder="Inserisci l'orario di fine delle lezioni"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicStrumenti">
            <Form.Label>Strumenti</Form.Label>
            <Form.Control
              onChange={(e) => setCorso({ ...corso, strumenti: e.target.value })}
              value={corso.strumenti}
              type="text"
              placeholder="Inserisci gli strumenti separati da virgola"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicObiettivi">
            <Form.Label>Obiettivi Corso</Form.Label>
            <Form.Control
              onChange={(e) => setCorso({ ...corso, obiettivi: e.target.value })}
              value={corso.obiettivi}
              as="textarea"
              rows={3}
              placeholder="Inserisci gli obiettivi del corso"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicGiorniLezione">
            <Form.Label>Giorni Lezione</Form.Label>
            <div>
              {[
                { value: "MONDAY", label: "Lunedì" },
                { value: "TUESDAY", label: "Martedì" },
                { value: "WEDNESDAY", label: "Mercoledì" },
                { value: "THURSDAY", label: "Giovedì" },
                { value: "FRIDAY", label: "Venerdì" },
                { value: "SATURDAY", label: "Sabato" },
                { value: "SUNDAY", label: "Domenica" },
              ].map(({ value, label }) => (
                <Form.Check
                  key={value}
                  inline
                  type="checkbox"
                  label={label}
                  value={value}
                  checked={corso.giorniLezione.includes(value)}
                  onChange={(e) => {
                    const updatedDays = e.target.checked
                      ? [...corso.giorniLezione, value]
                      : corso.giorniLezione.filter((d) => d !== value);
                    setCorso({ ...corso, giorniLezione: updatedDays });
                  }}
                />
              ))}
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicMinPartecipanti">
            <Form.Label>Minimo partecipanti</Form.Label>
            <Form.Control
              onChange={(e) => setCorso({ ...corso, minPartecipanti: e.target.value })}
              value={corso.minPartecipanti}
              type="number"
              placeholder="Inserisci il numero minimo di partecipanti"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicMaxPartecipanti">
            <Form.Label>Massimo partecipanti</Form.Label>
            <Form.Control
              onChange={(e) => setCorso({ ...corso, maxPartecipanti: e.target.value })}
              value={corso.maxPartecipanti}
              type="number"
              placeholder="Inserisci il numero massimo di partecipanti"
            />
          </Form.Group>
          {corso.locandina && (
            <div className="my-3">
              <img src={corso.locandina} height="100px" width="auto" alt="" />
            </div>
          )}
          <Form.Control
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);

              try {
                const res = await fetch(`${apiUrl}/uploadme`, {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  body: formData,
                });

                if (!res.ok) throw new Error("Errore durante l'upload");

                const url = await res.text();
                setCorso((prev) => ({ ...prev, locandina: url }));
              } catch (error) {
                console.error("Errore upload locandina:", error.message);
              }
            }}
          />
          <Button variant="primary" type="submit" className="my-3">
            {id ? "Modifica Corso" : " Registra Corso"}
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default RegistrazioneCorso;
