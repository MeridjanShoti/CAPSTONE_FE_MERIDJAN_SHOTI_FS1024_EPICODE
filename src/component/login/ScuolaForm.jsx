import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function ScuolaForm() {
  const [countIndirizziSecondari, setCountIndirizziSecondari] = useState(0);
  const [countSocialSecondari, setCountSocialSecondari] = useState(0);
  const [indirizzi, setIndirizzi] = useState([""]);
  const [social, setSocial] = useState([""]);
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

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
      roles: ["ROLE_SCUOLA"],
      avatar: null,
      copertina: null,
    };

    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    fetch(`${apiUrl}/register-scuola`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          console.log("Registrazione avvenuta con successo");
        } else {
          console.error("Errore nella registrazione", response.message);
        }
      });
  };

  return (
    <div>
      <h1 className="metal-mania-regular text-center">Registrati come Scuola di Musica</h1>
      <Form className="my-3" onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" placeholder="Inserisci il tuo username" />
        </Form.Group>
        <Form.Group controlId="formBasicRagioneSociale">
          <Form.Label>RagioneSociale</Form.Label>
          <Form.Control type="text" name="ragioneSociale" placeholder="Inserisci il nome della tua scuola" />
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
          <Form.Group className="mb-3" key={idx} controlId={`formBasicIndirizzoSecondario${idx + 1}`}>
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
export default ScuolaForm;
