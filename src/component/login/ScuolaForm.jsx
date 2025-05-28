import { useEffect, useRef, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchUserDetails } from "../../redux/actions";

function ScuolaForm() {
  const [indirizzi, setIndirizzi] = useState([""]);
  const [social, setSocial] = useState([""]);
  const [countIndirizziSecondari, setCountIndirizziSecondari] = useState(0);
  const [countSocialSecondari, setCountSocialSecondari] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [formData, setFormData] = useState({});
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      const reduxUserId = String(user?.appUser?.id);

      if (isEditing && user && id === reduxUserId) {
        console.log("Stai modificando te stesso (Redux)");

        setFormData({
          username: user.appUser.username,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          copertina: user.copertina,
          partitaIva: user.partitaIva,
          ragioneSociale: user.ragioneSociale,
          indirizzoPrincipale: user.indirizzoPrincipale,
          numeroTelefono: user.numeroTelefono,
          password: "",

          roles: user.appUser.roles,
        });

        setIndirizzi(user.altreSedi?.length ? user.altreSedi : [""]);
        setSocial(user.linkSocial?.length ? user.linkSocial : [""]);
        setCountIndirizziSecondari(user.altreSedi?.length ? user.altreSedi.length : 0);
        setCountSocialSecondari(user.linkSocial?.length ? user.linkSocial.length : 0);
      } else if (isEditing) {
        console.log("Modifica altro utente (via API)");

        try {
          const res = await fetch(`${apiUrl}/scuole/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setFormData({ ...data, password: "" });
          setIndirizzi(data.altreSedi?.length ? data.altreSedi : [""]);
          setSocial(data.linkSocial?.length ? data.linkSocial : [""]);
          setCountIndirizziSecondari(data.altreSedi?.length ? data.altreSedi.length : 0);
          setCountSocialSecondari(data.linkSocial?.length ? data.linkSocial.length : 0);
        } catch (err) {
          console.error("Errore fetch scuola", err);
        }
      }
    };

    if (isEditing && user) {
      loadData();
    }
  }, [id, user, isEditing, apiUrl, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fData = new FormData(e.target);
    const avatarFile = fData.get("avatar");
    const copertinaFile = fData.get("copertina");

    const uploadFile = async (file) => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${apiUrl}/uploadme`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      return await res.text();
    };

    let avatarUrl = formData.avatar || null;
    let copertinaUrl = formData.copertina || null;
    if (avatarFile?.name) avatarUrl = await uploadFile(avatarFile);
    if (copertinaFile?.name) copertinaUrl = await uploadFile(copertinaFile);

    const dataToSend = {
      ...formData,
      avatar: avatarUrl,
      copertina: copertinaUrl,
      altreSedi: indirizzi,
      linkSocial: social,
      roles: ["ROLE_SCUOLA"],
    };

    if (isEditing && !formData.password) {
      delete dataToSend.password;
    }

    const res = await fetch(`${apiUrl}/${isEditing ? `scuole/${id}` : "register-scuola"}`, {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    });

    if (res.ok) {
      setAlertMessage(isEditing ? "Modifica completata" : "Registrazione avvenuta con successo!");
      setAlertType("success");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate(id == user?.appUser?.id || user?.id == id ? "/" : "/scuole/" + id);
        dispatch(fetchUserDetails(token));
      }, 3000);
    } else {
      const err = await res.json();
      setAlertMessage(err.message || "Errore durante l'operazione");
      setAlertType("danger");
      setShowAlert(true);
    }
  };

  return (
    <div>
      <h1 className="text-center metal-mania-regular">
        {isEditing ? "Modifica Profilo Scuola" : "Registrati come Scuola"}
      </h1>
      {showAlert && <Alert variant={alertType}>{alertMessage}</Alert>}
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control name="username" value={formData.username || ""} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Ragione Sociale</Form.Label>
          <Form.Control name="ragioneSociale" value={formData.ragioneSociale || ""} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Partita IVA</Form.Label>
          <Form.Control name="partitaIva" value={formData.partitaIva || ""} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Indirizzo Principale</Form.Label>
          <Form.Control name="indirizzoPrincipale" value={formData.indirizzoPrincipale || ""} onChange={handleChange} />
        </Form.Group>

        {indirizzi &&
          indirizzi.map((val, i) => (
            <Form.Group key={i}>
              <Form.Label>Indirizzo Secondario {i + 1}</Form.Label>
              <Form.Control
                value={val}
                onChange={(e) => {
                  const copy = [...indirizzi];
                  copy[i] = e.target.value;
                  setIndirizzi(copy);
                }}
              />
            </Form.Group>
          ))}
        <Button
          type="button"
          variant="secondary"
          className="my-3 me-3"
          onClick={() => {
            setCountIndirizziSecondari(countIndirizziSecondari + 1);
            setIndirizzi([...indirizzi, ""]);
          }}
        >
          Aggiungi indirizzo
        </Button>
        {countIndirizziSecondari > 0 && (
          <Button
            type="button"
            variant="secondary"
            className="my-3 me-3"
            onClick={() => {
              setCountIndirizziSecondari(countIndirizziSecondari - 1);
              setIndirizzi(indirizzi.slice(0, -1));
            }}
          >
            Rimuovi indirizzo
          </Button>
        )}

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control name="email" type="email" value={formData.email || ""} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" value={formData.password || ""} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Telefono</Form.Label>
          <Form.Control
            name="numeroTelefono"
            type="tel"
            value={formData.numeroTelefono || ""}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Bio</Form.Label>
          <Form.Control as="textarea" name="bio" value={formData.bio || ""} onChange={handleChange} />
        </Form.Group>

        {social &&
          social.map((val, i) => (
            <Form.Group key={i}>
              <Form.Label>Link Social {i + 1}</Form.Label>
              <Form.Control
                value={val}
                type="text"
                onChange={(e) => {
                  const copy = [...social];
                  copy[i] = e.target.value;
                  setSocial(copy);
                }}
              />
            </Form.Group>
          ))}
        <Button
          type="button"
          variant="secondary"
          className="my-3 me-3"
          onClick={() => {
            setCountSocialSecondari(countSocialSecondari + 1);
            setSocial([...social, ""]);
          }}
        >
          Aggiungi Social
        </Button>
        {countSocialSecondari > 0 && (
          <Button
            type="button"
            variant="secondary"
            className="my-3 me-3"
            onClick={() => {
              setCountSocialSecondari(countSocialSecondari - 1);
              setSocial(social.slice(0, -1));
            }}
          >
            Rimuovi Social
          </Button>
        )}

        <Form.Group>
          <Form.Label>Avatar</Form.Label>
          {isEditing && formData.avatar && (
            <div className="mb-2">
              <img src={formData.avatar} alt="Avatar" style={{ maxHeight: "100px" }} />
            </div>
          )}
          <Form.Control type="file" name="avatar" accept="image/*" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Copertina</Form.Label>
          {isEditing && formData.copertina && (
            <div className="mb-2">
              <img src={formData.copertina} alt="Copertina" style={{ maxHeight: "100px" }} />
            </div>
          )}
          <Form.Control type="file" name="copertina" accept="image/*" />
        </Form.Group>

        {!isEditing && (
          <Form.Group className="my-3">
            <Form.Check type="checkbox" label="Accetto i termini e le condizioni" required />
          </Form.Group>
        )}

        <Button type="submit">{isEditing ? "Salva modifiche" : "Registrati"}</Button>
      </Form>
    </div>
  );
}

export default ScuolaForm;
