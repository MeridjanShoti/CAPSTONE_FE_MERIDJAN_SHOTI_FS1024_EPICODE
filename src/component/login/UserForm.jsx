import { Button, Form } from "react-bootstrap";

function UserForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");
    const body = {
      username: data.username,
      nome: data.nome,
      cognome: data.cognome,
      email: data.email,
      password: data.password,
      dataNascita: data.dataNascita,
      bio: data.bio,
      avatar: null,
      copertina: null,
      roles: ["ROLE_USER"],
    };
    fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1 className="metal-mania-regular text-center">Registrati come Utente</h1>
      <Form className="my-3" onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" placeholder="Inserisci il tuo username" required />
        </Form.Group>
        <Form.Group controlId="formBasicNome">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" name="nome" placeholder="Inserisci il tuo nome" required />
        </Form.Group>
        <Form.Group controlId="formBasicCognome">
          <Form.Label>Cognome</Form.Label>
          <Form.Control type="text" name="cognome" placeholder="Inserisci il tuo cognome" required />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="Inserisci la tua email" required />
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
        <Form.Group controlId="formBasicCheckbox" className="my-3">
          <Form.Check type="checkbox" label="Accetto i termini e le condizioni" required />
        </Form.Group>
        <Button type="submit">Registrati</Button>
      </Form>
    </div>
  );
}
export default UserForm;
