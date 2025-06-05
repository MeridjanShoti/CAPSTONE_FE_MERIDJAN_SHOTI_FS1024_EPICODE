import { useEffect, useRef, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchUserDetails } from "../../redux/actions";

function UserForm() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [utente, setUtente] = useState(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const dispatch = useDispatch();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id && user && userType.includes("ROLE_USER")) {
      const base = {
        username: user.appUser?.username || "",
        nome: user.nome || "",
        cognome: user.cognome || "",
        email: user.email || "",
        dataNascita: user.dataNascita || "",
        bio: user.bio || "",
      };
      setUtente(base);
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    let avatarUrl = utente?.avatar || null;
    let copertinaUrl = utente?.copertina || null;

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
      const userData = {
        username: data.username,
        nome: data.nome,
        cognome: data.cognome,
        email: data.email,
        password: data.password?.trim() || null,
        dataNascita: data.dataNascita,
        bio: data.bio,
        avatar: avatarUrl || "",
        copertina: copertinaUrl || "",
      };

      const method = id ? "PUT" : "POST";
      const endpoint = id ? `${apiUrl}/utenti/${id}` : `${apiUrl}/register`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const result = await response.text();
      if (response.ok) {
        setAlertMessage(id ? "Profilo utente aggiornato" : "Registrazione avvenuta con successo");
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
    <>
      {
        <Container>
          <h1 className="metal-mania-regular text-center my-3">
            {id ? "Modifica profilo Utente" : "Registra un nuovo Utente"}
          </h1>
          {showAlert && (
            <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>
              {alertMessage}
            </Alert>
          )}
          <Form ref={formRef} className="my-3" onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" defaultValue={utente?.username || ""} required />
            </Form.Group>
            <Form.Group controlId="formBasicNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" name="nome" defaultValue={utente?.nome || ""} required />
            </Form.Group>
            <Form.Group controlId="formBasicCognome">
              <Form.Label>Cognome</Form.Label>
              <Form.Control type="text" name="cognome" defaultValue={utente?.cognome || ""} required />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" defaultValue={utente?.email || ""} required />
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
              <Form.Control type="date" name="dataNascita" defaultValue={utente?.dataNascita || ""} />
            </Form.Group>
            <Form.Group controlId="formBasicBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control as="textarea" name="bio" rows={3} defaultValue={utente?.bio || ""} />
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
            <Button type="submit" className="d-block mx-auto my-3">
              {id ? "Salva modifiche" : "Registrati"}
            </Button>
          </Form>
        </Container>
      }
    </>
  );
}

export default UserForm;
