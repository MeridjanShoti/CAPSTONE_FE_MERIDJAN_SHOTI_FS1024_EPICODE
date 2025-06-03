import { useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

function FormEvento() {
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const [nomeEvento, setNomeEvento] = useState("");
  const [maxPartecipanti, setMaxPartecipanti] = useState("");
  const [minPartecipanti, setMinPartecipanti] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [aperturaPorte, setAperturaPorte] = useState("");
  const [fineEvento, setFineEvento] = useState("");
  const [note, setNote] = useState("");
  const [luogo, setLuogo] = useState("");
  const [citta, setCitta] = useState("");
  const [tipoEvento, setTipoEvento] = useState("ALTRO");
  const [prezzoBiglietto, setPrezzoBiglietto] = useState("");
  const [locandina, setLocandina] = useState(null);
  const [artistiPartecipanti, setArtistiPartecipanti] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  useEffect(() => {
    if (userType) {
      if (!userType.includes("ROLE_ADMIN") && !userType.includes("ROLE_ORGANIZZATORE")) {
        navigate("/");
      } else {
        if (id) {
          fetch(`${apiUrl}/eventi/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Network response was not ok");
              return res.json();
            })
            .then((data) => {
              setNomeEvento(data.nomeEvento);
              setMaxPartecipanti(data.maxPartecipanti);
              setMinPartecipanti(data.minPartecipanti);
              setDataEvento(data.dataEvento);
              setAperturaPorte(data.aperturaPorte);
              setFineEvento(data.fineEvento);
              setNote(data.note);
              setLuogo(data.luogo);
              setCitta(data.citta);
              setTipoEvento(data.tipoEvento);
              setPrezzoBiglietto(data.prezzoBiglietto);
              setLocandina(data.locandina);
              setArtistiPartecipanti(data.artistiPartecipanti);
            })
            .catch((err) => {
              console.log(err);
              navigate("/");
            });
        }
      }
    }
  }, [user, userType, id, token, apiUrl]);
  const handleLocandinaUpload = async (e) => {
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
      setLocandina(url);
    } catch (err) {
      console.error("Errore upload locandina:", err);
      alert("Caricamento locandina fallito");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      nomeEvento: nomeEvento,
      maxPartecipanti: parseInt(maxPartecipanti),
      minPartecipanti: parseInt(minPartecipanti),
      dataEvento: dataEvento,
      aperturaPorte: aperturaPorte,
      fineEvento: fineEvento,
      note: note,
      luogo: luogo,
      citta: citta,
      tipoEvento: tipoEvento,
      prezzoBiglietto: parseFloat(prezzoBiglietto),
      locandina: locandina,
      artistiPartecipanti: [...artistiPartecipanti],
    };
    fetch(`${apiUrl}/eventi${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        setAlertMessage("Evento salvato con id " + data.id);
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/dashboard/");
        }, 5000);
      })
      .catch((err) => {
        setAlertMessage("Evento non salvato");
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
        <h1 className="text-center metal-mania-regular my-4">{id ? "Modifica evento" : "Crea evento"}</h1>
        <Alert show={showAlert} variant={alertType}>
          {" "}
          {alertMessage}{" "}
        </Alert>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicNomeEvento">
            <Form.Label>Nome evento</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il nome dell'evento"
              value={nomeEvento}
              onChange={(e) => setNomeEvento(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicMaxPartecipanti">
            <Form.Label>Max partecipanti</Form.Label>
            <Form.Control
              type="number"
              placeholder="Inserisci il numero massimo di partecipanti"
              value={maxPartecipanti}
              onChange={(e) => setMaxPartecipanti(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicMinPartecipanti">
            <Form.Label>Min partecipanti</Form.Label>
            <Form.Control
              type="number"
              placeholder="Inserisci il numero minimo di partecipanti"
              value={minPartecipanti}
              onChange={(e) => setMinPartecipanti(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDataEvento">
            <Form.Label>Data evento</Form.Label>
            <Form.Control
              type="date"
              placeholder="Inserisci la data dell'evento"
              value={dataEvento}
              onChange={(e) => setDataEvento(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicAperturaPorte">
            <Form.Label>Apertura porte</Form.Label>
            <Form.Control
              type="time"
              placeholder="Inserisci l'ora di apertura porte"
              value={aperturaPorte}
              onChange={(e) => setAperturaPorte(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicFineEvento">
            <Form.Label>Fine evento</Form.Label>
            <Form.Control
              type="time"
              placeholder="Inserisci l'orario di fine evento"
              value={fineEvento}
              onChange={(e) => setFineEvento(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicNote">
            <Form.Label>Note</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci le note dell'evento"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLuogo">
            <Form.Label>Luogo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il luogo dell'evento"
              value={luogo}
              onChange={(e) => setLuogo(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCitta">
            <Form.Label>Citta</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci la citta dell'evento"
              value={citta}
              onChange={(e) => setCitta(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicTipoEvento">
            <Form.Label>Tipo evento</Form.Label>
            <Form.Select value={tipoEvento} onChange={(e) => setTipoEvento(e.target.value)}>
              <option value="CONCERTO">Concerto</option>
              <option value="MEET_AND_GREET">Meet and Greet</option>
              <option value="CLINIC">Clinic</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="ALTRO">Altro</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPrezzoBiglietto">
            <Form.Label>Prezzo biglietto</Form.Label>
            <Form.Control
              type="number"
              placeholder="Inserisci il prezzo del biglietto"
              value={prezzoBiglietto}
              onChange={(e) => setPrezzoBiglietto(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicArtistiPartecipanti">
            <Form.Label>Artisti partecipanti</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci gli artisti partecipanti, separati da virgola"
              value={artistiPartecipanti.join(",")}
              onChange={(e) => setArtistiPartecipanti(e.target.value.split(","))}
            />
          </Form.Group>
          {locandina && (
            <div className="mb-3">
              <img
                src={locandina}
                alt="Locandina attuale"
                className="img-fluid rounded border border-primary"
                style={{ maxWidth: "200px", height: "auto" }}
              />
            </div>
          )}
          <Form.Group className="mb-3" controlId="formBasicLocandina">
            <Form.Label>Locandina</Form.Label>
            <Form.Control
              type="file"
              placeholder="Inserisci la locandina dell'evento"
              onChange={(e) => handleLocandinaUpload(e)}
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

export default FormEvento;
