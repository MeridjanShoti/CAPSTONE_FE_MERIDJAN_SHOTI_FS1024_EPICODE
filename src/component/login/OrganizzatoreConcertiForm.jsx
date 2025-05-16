import { useRef, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";

function OrganizzatoreConcertiForm() {
  const [countIndirizziSecondari, setCountIndirizziSecondari] = useState(0);
  const [countSocialSecondari, setCountSocialSecondari] = useState(0);
  const [indirizzi, setIndirizzi] = useState([""]);
  const [social, setSocial] = useState([""]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const formRef = useRef(null);
  const navigate = useNavigate();
  const aggiungiIndirizzo = () => {
    setIndirizzi([...indirizzi, ""]);
  };

  const rimuoviIndirizzo = () => {
    if (indirizzi.length > 1) {
      setIndirizzi(indirizzi.slice(0, indirizzi.length - 1));
    }
  };
  const aggiungiSocial = () => {
    setSocial([...social, ""]);
  };
  const rimuoviSocial = () => {
    if (social.length > 1) {
      setSocial(social.slice(0, social.length - 1));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    let avatarUrl = null;
    let copertinaUrl = null;

    const avatarFile = formData.get("avatar");
    if (avatarFile && avatarFile instanceof File && avatarFile.name) {
      const avatarFormData = new FormData();
      avatarFormData.append("file", avatarFile);
      try {
        const res = await fetch(`${apiUrl}/uploadme`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: avatarFormData,
        });
        avatarUrl = await res.text();
      } catch (err) {
        console.error("Errore upload avatar:", err);
      }
    }

    const copertinaFile = formData.get("copertina");
    if (copertinaFile && copertinaFile instanceof File && copertinaFile.name) {
      const copertinaFormData = new FormData();
      copertinaFormData.append("file", copertinaFile);
      try {
        const res = await fetch(`${apiUrl}/uploadme`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: copertinaFormData,
        });
        copertinaUrl = await res.text();
      } catch (err) {
        console.error("Errore upload copertina:", err);
      }
    }

    const data = {
      username: formData.get("username"),
      ragioneSociale: formData.get("ragioneSociale"),
      indirizzoPrincipale: formData.get("indirizzo"),
      email: formData.get("email"),
      password: formData.get("password"),
      numeroTelefono: formData.get("telefono"),
      bio: formData.get("bio"),
      linkSocial: [...social, formData.get("linkSocial")].filter(Boolean),
      indirizziSecondari: indirizzi,
      partitaIva: formData.get("partitaIva"),
      roles: ["ROLE_ORGANIZZATORE"],
      avatar: avatarUrl,
      copertina: copertinaUrl,
    };

    try {
      const res = await fetch(`${apiUrl}/register-organizzatore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (res.ok) {
        await res.text();
        setAlertMessage("Registrazione avvenuta con successo!");
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/login");
        }, 3000);
      } else {
        const response = await res.json();
        setAlertMessage(response.message + ". Registrazione fallita. Riprova.");
        setAlertType("danger");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          formRef.current.reset();
          setIndirizzi([""]);
          setSocial([""]);
          setCountIndirizziSecondari(0);
          setCountSocialSecondari(0);
        }, 5000);
      }
    } catch (error) {
      setAlertMessage(error.message + ". Errore durante la registrazione");
      setAlertType("danger");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        formRef.current.reset();
        setIndirizzi([""]);
        setSocial([""]);
        setCountIndirizziSecondari(0);
        setCountSocialSecondari(0);
      }, 5000);
    }
  };

  return (
    <div>
      <h1 className="metal-mania-regular text-center">Registrati come Organizzatore di Eventi</h1>
      {showAlert && (
        <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      <Form ref={formRef} className="my-3" onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" placeholder="Inserisci il tuo username" />
        </Form.Group>
        <Form.Group controlId="formBasicRagioneSociale">
          <Form.Label>RagioneSociale</Form.Label>
          <Form.Control type="text" name="ragioneSociale" placeholder="Inserisci il nome della tua azienda" />
        </Form.Group>
        <Form.Group controlId="formBasicPartitaIva">
          <Form.Label>Partita IVA</Form.Label>
          <Form.Control type="text" name="partitaIva" placeholder="Inserisci la tua partita IVA" />
        </Form.Group>
        <Form.Group controlId="formBasicIndirizzo">
          <Form.Label>Indirizzo Principale</Form.Label>
          <Form.Control type="text" name="indirizzo" placeholder="Inserisci il tuo indirizzo principale" required />
        </Form.Group>
        {indirizzi.map((_, idx) => (
          <Form.Group className="mb-3" key={idx} controlId={`formBasicIndirizzoSecondario${idx + 2}`}>
            <Form.Label>Indirizzo Secondario {idx + 1}</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci un indirizzo"
              onChange={(e) => {
                const newIndirizzi = [...indirizzi];
                newIndirizzi[idx] = e.target.value;
                setIndirizzi(newIndirizzi);
              }}
            />
          </Form.Group>
        ))}
        <Button
          className="my-3"
          variant="secondary"
          onClick={() => {
            setCountIndirizziSecondari(countIndirizziSecondari + 1);
            aggiungiIndirizzo();
          }}
        >
          Aggiungi indirizzo
        </Button>
        {countIndirizziSecondari > 0 && (
          <Button
            variant="secondary"
            onClick={() => {
              setCountIndirizziSecondari(countIndirizziSecondari - 1);
              rimuoviIndirizzo();
            }}
            className="my-3 ms-3"
          >
            Rimuovi indirizzo
          </Button>
        )}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="Inserisci la tua email" />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" placeholder="Password" />
        </Form.Group>
        <Form.Group controlId="formBasicTelefono">
          <Form.Label>Numero di telefono</Form.Label>
          <Form.Control type="text" name="telefono" placeholder="Numero di telefono" />
        </Form.Group>
        <Form.Group controlId="formBasicBio">
          <Form.Label>Bio</Form.Label>
          <Form.Control as={"textarea"} name="bio" rows={3} placeholder="Aggiungi una bio" />
        </Form.Group>
        <Form.Group controlId="formBasicLinkSocial">
          <Form.Label>Link Social</Form.Label>
          <Form.Control type="text" name="linkSocial" placeholder="Link Social" />
        </Form.Group>
        {social.map((_, idx) => (
          <Form.Group className="mb-3" key={idx} controlId={`formBasicLinkSocial${idx + 2}`}>
            <Form.Label>Link Social {idx + 2}</Form.Label>
            <Form.Control
              type="text"
              placeholder="Link Social"
              onChange={(e) => {
                const newSocial = [...social];
                newSocial[idx] = e.target.value;
                setSocial(newSocial);
              }}
            />
          </Form.Group>
        ))}
        <Button
          variant="secondary"
          onClick={() => {
            setCountSocialSecondari(countSocialSecondari + 1);
            aggiungiSocial();
          }}
          className="my-3"
        >
          Aggiungi un altro Social
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setCountSocialSecondari(countSocialSecondari - 1);
            rimuoviSocial();
          }}
          className="my-3 ms-3"
        >
          Rimuovi Social{" "}
        </Button>
        <Form.Group controlId="formBasicAvatar" className="my-3">
          <Form.Label>Carica un'immagine del profilo</Form.Label>
          <Form.Control type="file" name="avatar" accept="image/*" />
        </Form.Group>
        <Form.Group controlId="formBasicCopertina" className="my-3">
          <Form.Label>Carica un'immagine di copertina</Form.Label>
          <Form.Control type="file" name="copertina" accept="image/*" />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox" className="my-3">
          <Form.Check type="checkbox" label="Accetto i termini e le condizioni" required />
        </Form.Group>
        <Button type="submit">Registrati</Button>
      </Form>
    </div>
  );
}
export default OrganizzatoreConcertiForm;
