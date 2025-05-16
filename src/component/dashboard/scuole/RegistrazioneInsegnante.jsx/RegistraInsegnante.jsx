import { useRef, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
function RegistraInsegnante() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [strumenti, setStrumenti] = useState([]);
  const [countStrumenti, setCountStrumenti] = useState(0);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const aggiungiStrumento = () => {
    setStrumenti([...strumenti, ""]);
  };

  const rimuoviStrumento = () => {
    if (strumenti.length > 1) {
      setStrumenti(strumenti.slice(0, strumenti.length - 1));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");
    let avatarUrl = null;
    let copertinaUrl = null;

    if (formData.get("avatar") instanceof File && formData.get("avatar").name) {
      const avatarFormData = new FormData();
      avatarFormData.append("file", formData.get("avatar"));

      try {
        const res = await fetch(`${apiUrl}/uploadme`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: avatarFormData,
        });
        const result = await res.text();
        avatarUrl = result;
      } catch (error) {
        console.error("Errore upload avatar", error);
      }
    }

    if (formData.get("copertina") instanceof File && formData.get("copertina").name) {
      const copertinaFormData = new FormData();
      copertinaFormData.append("file", formData.get("copertina"));

      try {
        const res = await fetch(`${apiUrl}/uploadme`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: copertinaFormData,
        });
        const result = await res.text();
        copertinaUrl = result;
      } catch (error) {
        console.error("Errore upload copertina", error);
      }
    }
    try {
      const insegnanteFormData = new FormData();
      insegnanteFormData.append("username", data.username);
      insegnanteFormData.append("nome", data.nome);
      insegnanteFormData.append("cognome", data.cognome);
      insegnanteFormData.append("email", data.email);
      insegnanteFormData.append("password", data.password);
      insegnanteFormData.append("dataNascita", data.dataNascita);
      insegnanteFormData.append("bio", data.bio);
      insegnanteFormData.append("avatar", avatarUrl);
      insegnanteFormData.append("copertina", copertinaUrl);
      insegnanteFormData.append("pagaOraria", data.pagaOraria);
      insegnanteFormData.append("curriculum", formData.get("curriculum"));
      strumenti.forEach((s) => insegnanteFormData.append("strumenti", s));
      const response = await fetch(`${apiUrl}/register-insegnante`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: insegnanteFormData,
      });
      const result = await response.text();
      if (response.ok) {
        setAlertMessage("Registrazione avvenuta con successo");
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          formRef.current.reset();
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      setAlertMessage(error.message + "Errore durante la registrazione");
      setAlertType("danger");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        formRef.current?.reset();
      }, 5000);
    }
  };

  return (
    <Container>
      <h1 className="metal-mania-regular text-center my-3">Registra un nuovo insegnante</h1>
      {showAlert && (
        <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      <Form ref={formRef} className="my-3" onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" placeholder="Inserisci lo username dell'insegnante" required />
        </Form.Group>
        <Form.Group controlId="formBasicNome">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" name="nome" placeholder="Inserisci il nome dell'insegnante" required />
        </Form.Group>
        <Form.Group controlId="formBasicCognome">
          <Form.Label>Cognome</Form.Label>
          <Form.Control type="text" name="cognome" placeholder="Inserisci il cognome dell'insegnante" required />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="Inserisci la tua mail dell'insegnante" required />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" placeholder="Password" required />
        </Form.Group>
        <Form.Group controlId="formBasicDataNascita">
          <Form.Label>Data di Nascita</Form.Label>
          <Form.Control type="date" name="dataNascita" placeholder="Data di Nascita" />
        </Form.Group>
        <Form.Group controlId="formBasicBio">
          <Form.Label>Bio</Form.Label>
          <Form.Control as={"textarea"} name="bio" rows={3} placeholder="Aggiungi una bio" />
        </Form.Group>
        <Form.Group controlId="formBasicAvatar" className="my-3">
          <Form.Label>Carica un'immagine del profilo</Form.Label>
          <Form.Control type="file" name="avatar" accept="image/*" />
        </Form.Group>
        <Form.Group controlId="formBasicCopertina" className="my-3">
          <Form.Label>Carica un'immagine di copertina</Form.Label>
          <Form.Control type="file" name="copertina" accept="image/*" />
        </Form.Group>
        <Form.Group controlId="formBasicCurriculum" className="my-3">
          <Form.Label>Carica il curriculum vitae in formato pdf</Form.Label>
          <Form.Control type="file" name="curriculum" accept="application/pdf" />
        </Form.Group>
        <Form.Group controlId="formBasicPagaOraria">
          <Form.Label>Paga oraria</Form.Label>
          <Form.Control type="number" name="pagaOraria" placeholder="Inserisci la paga oraria" required />
        </Form.Group>
        <Form.Group controlId="formBasicStrumenti">
          <Form.Label>Strumento</Form.Label>
          <Form.Control type="text" name="strumenti" placeholder="Inserisci lo strumento" required />
        </Form.Group>
        {strumenti.map((_, idx) => (
          <Form.Group className="mb-3" key={idx} controlId={`formBasicStrumenti${idx + 2}`}>
            <Form.Label>Strumento secondario {idx + 1}</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci uno strumento"
              onChange={(e) => {
                const newStrumenti = [...strumenti];
                newStrumenti[idx] = e.target.value;
                setStrumenti(newStrumenti);
              }}
            />
          </Form.Group>
        ))}
        <Button
          className="my-3"
          variant="secondary"
          onClick={() => {
            setCountStrumenti(countStrumenti + 1);
            aggiungiStrumento();
          }}
        >
          Aggiungi strumento
        </Button>
        {countStrumenti > 0 && (
          <Button
            variant="secondary"
            onClick={() => {
              setCountStrumenti(countStrumenti - 1);
              rimuoviStrumento();
            }}
            className="my-3 ms-3"
          >
            Rimuovi strumento
          </Button>
        )}

        <Form.Group controlId="formBasicCheckbox" className="my-3">
          <Form.Check type="checkbox" label="Accetto i termini e le condizioni" required />
        </Form.Group>
        <Button type="submit">Registrati</Button>
      </Form>
    </Container>
  );
}

export default RegistraInsegnante;
