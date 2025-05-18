import { useEffect, useRef, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchUserDetails } from "../../redux/actions";

function UserForm() {
  const [formDataState, setFormDataState] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (id && user) {
      setFormDataState({
        ...user,
        username: user.appUser?.username || "",
      });
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    let avatarUrl = formDataState.avatar || null;
    let copertinaUrl = formDataState.copertina || null;

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

    const body = {
      username: data.username,
      nome: data.nome,
      cognome: data.cognome,
      email: data.email,
      ...(data.password?.trim() && { password: data.password.trim() }),
      dataNascita: data.dataNascita,
      bio: data.bio,
      avatar: avatarUrl,
      copertina: copertinaUrl,
      roles: ["ROLE_USER"],
    };

    const method = id ? "PUT" : "POST";
    const endpoint = id ? `${apiUrl}/utenti/${id}` : `${apiUrl}/register`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.text();
      if (response.ok) {
        setAlertMessage(id ? "Profilo aggiornato con successo" : "Registrazione avvenuta con successo");
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          formRef.current.reset();
          dispatch(fetchUserDetails(token));
          navigate(id ? `/profile/` : "/login");
        }, 3000);
      }
    } catch (error) {
      setAlertMessage("Errore durante l'invio: " + error.message);
      setAlertType("danger");
      setShowAlert(true);
    }
  };

  return (
    <div>
      <h1 className="metal-mania-regular text-center">{id ? "Modifica il tuo profilo" : "Registrati come Utente"}</h1>
      {showAlert && (
        <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      <Form ref={formRef} className="my-3" onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" defaultValue={formDataState.username || ""} required />
        </Form.Group>
        <Form.Group controlId="formBasicNome">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" name="nome" defaultValue={formDataState.nome || ""} required />
        </Form.Group>
        <Form.Group controlId="formBasicCognome">
          <Form.Label>Cognome</Form.Label>
          <Form.Control type="text" name="cognome" defaultValue={formDataState.cognome || ""} required />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" defaultValue={formDataState.email || ""} required />
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
          <Form.Control type="date" name="dataNascita" defaultValue={formDataState.dataNascita || ""} />
        </Form.Group>
        <Form.Group controlId="formBasicBio">
          <Form.Label>Bio</Form.Label>
          <Form.Control as="textarea" name="bio" rows={3} defaultValue={formDataState.bio || ""} />
        </Form.Group>
        <Form.Group controlId="formBasicAvatar" className="my-3">
          <Form.Label>Carica un'immagine del profilo</Form.Label>
          <Form.Control type="file" name="avatar" accept="image/*" />
        </Form.Group>
        <Form.Group controlId="formBasicCopertina" className="my-3">
          <Form.Label>Carica un'immagine di copertina</Form.Label>
          <Form.Control type="file" name="copertina" accept="image/*" />
        </Form.Group>
        {!id && (
          <Form.Group controlId="formBasicCheckbox" className="my-3">
            <Form.Check type="checkbox" label="Accetto i termini e le condizioni" required />
          </Form.Group>
        )}
        <Button type="submit">{id ? "Aggiorna" : "Registrati"}</Button>
      </Form>
    </div>
  );
}

export default UserForm;
