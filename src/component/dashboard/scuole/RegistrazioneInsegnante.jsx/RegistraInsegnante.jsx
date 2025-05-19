import { useEffect, useRef, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchUserDetails } from "../../../../redux/actions";

function RegistraInsegnante() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [strumenti, setStrumenti] = useState([""]);
  const [countStrumenti, setCountStrumenti] = useState(0);
  const [insegnante, setInsegnante] = useState({});
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const dispatch = useDispatch();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id && user && userType.includes("ROLE_INSEGNANTE")) {
      const base = {
        username: user.appUser?.username || "",
        nome: user.nome || "",
        cognome: user.cognome || "",
        email: user.email || "",
        dataNascita: user.dataNascita || "",
        bio: user.bio || "",
        pagaOraria: user.pagaOraria != null ? user.pagaOraria : "",
      };
      setInsegnante(base);

      const strumentiIniziali = Array.isArray(user.strumenti) && user.strumenti.length > 0 ? user.strumenti : [""];

      setStrumenti(strumentiIniziali);
      setCountStrumenti(strumentiIniziali.length - 1);
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if (!data.pagaOraria || isNaN(data.pagaOraria)) {
      throw new Error("La paga oraria non è valida");
    }
    let avatarUrl = insegnante.avatar || null;
    let copertinaUrl = insegnante.copertina || null;

    if (formData.get("avatar") instanceof File && formData.get("avatar").name) {
      const avatarFormData = new FormData();
      avatarFormData.append("file", formData.get("avatar"));
      try {
        const res = await fetch(`${apiUrl}/uploadme`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: avatarFormData,
        });
        avatarUrl = await res.text();
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
        copertinaUrl = await res.text();
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
      if (data.password?.trim()) {
        insegnanteFormData.append("password", data.password);
      }
      insegnanteFormData.append("dataNascita", data.dataNascita);
      insegnanteFormData.append("bio", data.bio);
      if (avatarUrl) {
        insegnanteFormData.append("avatar", avatarUrl);
      }
      if (copertinaUrl) {
        insegnanteFormData.append("copertina", copertinaUrl);
      }
      insegnanteFormData.append("pagaOraria", data.pagaOraria);
      if (formData.get("curriculum") instanceof File && formData.get("curriculum").name) {
        insegnanteFormData.append("curriculum", formData.get("curriculum"));
      }

      strumenti.filter((s) => s.trim() !== "").forEach((s) => insegnanteFormData.append("strumenti", s));

      const method = id ? "PUT" : "POST";
      const endpoint = id ? `${apiUrl}/insegnanti/${id}` : `${apiUrl}/register-insegnante`;

      const response = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: insegnanteFormData,
      });

      const result = await response.text();
      if (response.ok) {
        setAlertMessage(id ? "Profilo insegnante aggiornato" : "Registrazione avvenuta con successo");
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          formRef.current.reset();
          navigate(id ? `/profile` : "/login");
          dispatch(fetchUserDetails(token));
        }, 3000);
      }
    } catch (error) {
      setAlertMessage("Errore: " + error.message);
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
      <h1 className="metal-mania-regular text-center my-3">
        {id ? "Modifica profilo insegnante" : "Registra un nuovo insegnante"}
      </h1>
      {showAlert && (
        <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      <Form ref={formRef} className="my-3" onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" defaultValue={insegnante.username || ""} required />
        </Form.Group>
        <Form.Group controlId="formBasicNome">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" name="nome" defaultValue={insegnante.nome || ""} required />
        </Form.Group>
        <Form.Group controlId="formBasicCognome">
          <Form.Label>Cognome</Form.Label>
          <Form.Control type="text" name="cognome" defaultValue={insegnante.cognome || ""} required />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" defaultValue={insegnante.email || ""} required />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder={id ? "Nuova password (facoltativa)" : "Password"}
          />
        </Form.Group>
        <Form.Group controlId="formBasicDataNascita">
          <Form.Label>Data di Nascita</Form.Label>
          <Form.Control type="date" name="dataNascita" defaultValue={insegnante.dataNascita || ""} />
        </Form.Group>
        <Form.Group controlId="formBasicBio">
          <Form.Label>Bio</Form.Label>
          <Form.Control as="textarea" name="bio" rows={3} defaultValue={insegnante.bio || ""} />
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
          <Form.Control
            type="number"
            name="pagaOraria"
            readOnly={!!id}
            defaultValue={insegnante.pagaOraria || ""}
            required
          />
        </Form.Group>

        {strumenti.map((val, idx) => (
          <Form.Group key={idx} controlId={`formStrumento${idx}`}>
            <Form.Label>{idx === 0 ? "Strumento principale" : `Strumento secondario ${idx}`}</Form.Label>
            <Form.Control
              type="text"
              name="strumenti"
              value={val}
              onChange={(e) => {
                const newStrumenti = [...strumenti];
                newStrumenti[idx] = e.target.value;
                setStrumenti(newStrumenti);
              }}
              required={idx === 0}
            />
          </Form.Group>
        ))}

        <Button
          className="my-3"
          variant="secondary"
          onClick={() => {
            setStrumenti([...strumenti, ""]);
            setCountStrumenti(countStrumenti + 1);
          }}
        >
          Aggiungi strumento
        </Button>

        {countStrumenti > 0 && (
          <Button
            variant="secondary"
            className="my-3 ms-3"
            onClick={() => {
              setStrumenti(strumenti.slice(0, -1));
              setCountStrumenti(countStrumenti - 1);
            }}
          >
            Rimuovi strumento
          </Button>
        )}

        {!id && (
          <Form.Group controlId="formBasicCheckbox" className="my-3">
            <Form.Check type="checkbox" label="Accetto i termini e le condizioni" required />
          </Form.Group>
        )}

        <Button type="submit" className="d-block mx-auto">
          {id ? "Salva modifiche" : "Registrati"}
        </Button>
      </Form>
    </Container>
  );
}

export default RegistraInsegnante;
