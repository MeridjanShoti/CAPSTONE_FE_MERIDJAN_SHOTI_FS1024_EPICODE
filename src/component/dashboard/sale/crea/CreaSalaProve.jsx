import { useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
function CreaSalaProve() {
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const giorniSettimana = [
    { label: "Lunedì", value: "MONDAY" },
    { label: "Martedì", value: "TUESDAY" },
    { label: "Mercoledì", value: "WEDNESDAY" },
    { label: "Giovedì", value: "THURSDAY" },
    { label: "Venerdì", value: "FRIDAY" },
    { label: "Sabato", value: "SATURDAY" },
    { label: "Domenica", value: "SUNDAY" },
  ];
  const handleGiorniChange = (e) => {
    const giorno = e.target.value;
    if (e.target.checked) {
      setGiorniApertura([...giorniApertura, giorno]);
    } else {
      setGiorniApertura(giorniApertura.filter((g) => g !== giorno));
    }
  };
  const [nomeSala, setNomeSala] = useState("");
  const [indirizzoSala, setIndirizzoSala] = useState("");
  const [capienzaMax, setCapienzaMax] = useState("");
  const [citta, setCitta] = useState("");
  const [orarioApertura, setOrarioApertura] = useState("");
  const [orarioChiusura, setOrarioChiusura] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [regolamento, setRegolamento] = useState("");
  const [giorniApertura, setGiorniApertura] = useState([]);
  const [prezzoOrario, setPrezzoOrario] = useState("");
  const [copertinaSala, setCopertinaSala] = useState(null);
  const [ampliETestate, setAmpliETestate] = useState([]);
  const [microfoni, setMicrofoni] = useState([]);
  const [mixer, setMixer] = useState([]);
  const [setBatteria, setSetBatteria] = useState([]);
  const [altro, setAltro] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  useEffect(() => {
    if (userType) {
      if (!userType.includes("ROLE_GESTORE_SP")) {
        navigate("/");
      } else {
        if (id) {
          fetch(`${apiUrl}/saleprove/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then((data) => {
              setNomeSala(data.nomeSala);
              setIndirizzoSala(data.indirizzoSala);
              setCapienzaMax(data.capienzaMax);
              setCitta(data.citta);
              setOrarioApertura(data.orarioApertura);
              setOrarioChiusura(data.orarioChiusura);
              setDescrizione(data.descrizione);
              setRegolamento(data.regolamento);
              setGiorniApertura(data.giorniApertura);
              setPrezzoOrario(data.prezzoOrario);
              setCopertinaSala(data.copertinaSala);
              setAmpliETestate(data.strumentazione.ampliETestate);
              setMicrofoni(data.strumentazione.microfoni);
              setMixer(data.strumentazione.mixer);
              setSetBatteria(data.strumentazione.setBatteria);
              setAltro(data.strumentazione.altro);
            })
            .catch((err) => {
              console.log(err);
              navigate("/");
            });
        }
      }
    }
  }, [user, navigate, userType, id, token, apiUrl]);
  const handleCopertinaSalaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${apiUrl}/uploadme`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload fallito");

      const url = await res.text();
      setCopertinaSala(url);
    } catch (err) {
      console.error("Errore upload copertina:", err);
      alert("Caricamento copertina fallito");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      nomeSala: nomeSala,
      indirizzoSala: indirizzoSala,
      capienzaMax: parseInt(capienzaMax),
      citta: citta,
      orarioApertura: orarioApertura,
      orarioChiusura: orarioChiusura,
      descrizione: descrizione,
      regolamento: regolamento,
      giorniApertura: giorniApertura,
      prezzoOrario: parseFloat(prezzoOrario),
      copertinaSala: copertinaSala,
      ampliETestate: [...ampliETestate],
      microfoni: [...microfoni],
      mixer: [...mixer],
      setBatteria: [...setBatteria],
      altro: [...altro],
    };
    fetch(`${apiUrl}/saleprove${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setAlertMessage("Sala prove salvata con id " + data.id);
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/dashboard/");
        }, 5000);
      })
      .catch((err) => {
        setAlertMessage("Sala prove non salvata");
        setAlertType("danger");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      });
  };
  return (
    <>
      <Container>
        <h1 className="text-center metal-mania-regular my-4">{id ? "Modifica Sala Prove" : "Inserisci Sala Prove"}</h1>
        <Alert show={showAlert} variant={alertType}>
          {" "}
          {alertMessage}{" "}
        </Alert>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicNomeSala">
            <Form.Label>Nome Sala Prove</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il nome della sala prove"
              value={nomeSala}
              onChange={(e) => setNomeSala(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCapienzaMax">
            <Form.Label>Capienza Massima</Form.Label>
            <Form.Control
              type="number"
              placeholder="Inserisci il numero massimo di membri"
              value={capienzaMax}
              onChange={(e) => setCapienzaMax(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPrezzoOrario">
            <Form.Label>Prezzo Orario</Form.Label>
            <Form.Control
              type="number"
              placeholder="Inserisci il prezzo orario"
              value={prezzoOrario}
              onChange={(e) => setPrezzoOrario(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicOrarioApertura">
            <Form.Label>Orario apertura</Form.Label>
            <Form.Control
              type="time"
              placeholder="Inserisci l'orario di apertura'"
              value={orarioApertura}
              onChange={(e) => setOrarioApertura(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicOrarioChiusura">
            <Form.Label>Orario chiusura</Form.Label>
            <Form.Control
              type="time"
              placeholder="Inserisci l'orario di chiusura'"
              value={orarioChiusura}
              onChange={(e) => setOrarioChiusura(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDescrizione">
            <Form.Label>descrizione</Form.Label>
            <Form.Control
              as={"textarea"}
              placeholder="Inserisci la descrizione della tua sala prove"
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicRegolamento">
            <Form.Label>Regolamento</Form.Label>
            <Form.Control
              as={"textarea"}
              placeholder="Inserisci il regolamento della tua sala prove"
              value={regolamento}
              onChange={(e) => setRegolamento(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicIndirizzoSala">
            <Form.Label>Indirizzo Sala</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci l'indirizzo della sala prove"
              value={indirizzoSala}
              onChange={(e) => setIndirizzoSala(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCitta">
            <Form.Label>Citta</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci la citta"
              value={citta}
              onChange={(e) => setCitta(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicGiorniApertura">
            <Form.Label>Giorni di apertura</Form.Label>
            {giorniSettimana.map(({ label, value }) => (
              <Form.Check
                key={value}
                type="checkbox"
                label={label}
                value={value}
                checked={giorniApertura.includes(value)}
                onChange={handleGiorniChange}
              />
            ))}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicAmpliETestate">
            <Form.Label>Ampli e testate</Form.Label>
            <Form.Control
              as={"textarea"}
              placeholder="Inserisci gli ampli e testate, separati da virgola"
              value={ampliETestate.join(",")}
              onChange={(e) => setAmpliETestate(e.target.value.split(","))}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicMicrofoni">
            <Form.Label>Microfoni</Form.Label>
            <Form.Control
              as={"textarea"}
              placeholder="Inserisci i microfoni, separati da virgola"
              value={microfoni.join(",")}
              onChange={(e) => setMicrofoni(e.target.value.split(","))}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicMixer">
            <Form.Label>Mixer</Form.Label>
            <Form.Control
              as={"textarea"}
              placeholder="Inserisci i mixer, separati da virgola"
              value={mixer.join(",")}
              onChange={(e) => setMixer(e.target.value.split(","))}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicSetBatteria">
            <Form.Label>Set Batteria</Form.Label>
            <Form.Control
              as={"textarea"}
              placeholder="Inserisci i set per batteria, separati da virgola"
              value={setBatteria.join(",")}
              onChange={(e) => setSetBatteria(e.target.value.split(","))}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicAltro">
            <Form.Label>Altro</Form.Label>
            <Form.Control
              as={"textarea"}
              placeholder="Inserisci altri strumenti, separati da virgola"
              value={altro.join(",")}
              onChange={(e) => setAltro(e.target.value.split(","))}
            />
          </Form.Group>

          {copertinaSala && (
            <div className="mb-3">
              <img
                src={copertinaSala}
                alt="Copertina attuale"
                className="img-fluid rounded border border-primary"
                style={{ maxWidth: "200px", height: "auto" }}
              />
            </div>
          )}
          <Form.Group className="mb-3" controlId="formBasicLocandina">
            <Form.Label>Locandina</Form.Label>
            <Form.Control
              type="file"
              placeholder="Inserisci la copertina della sala prove"
              onChange={(e) => handleCopertinaSalaUpload(e)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {id ? "Modifica" : "Crea"}
          </Button>
        </Form>
      </Container>
    </>
  );
}
export default CreaSalaProve;
