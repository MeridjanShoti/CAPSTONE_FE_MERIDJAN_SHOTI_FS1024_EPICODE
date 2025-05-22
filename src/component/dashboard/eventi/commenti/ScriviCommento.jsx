import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

function ScriviCommento(props) {
  const [commento, setCommento] = useState("");
  useEffect(() => {
    if (props.commento) {
      setCommento(props.commento.testo);
    }
  }, [props.commento]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("sono in handlesubmit");

    fetch(props.mode === "new" ? apiUrl + "/commenti/" + props.id : apiUrl + "/commenti/" + props.commento.id, {
      method: props.mode === "new" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        testo: commento,
      }),
    })
      .then((res) => {
        if (res.ok) {
          console.log("Commento inserito con successo");
          setCommento("");
          props.setUpdate((prev) => prev + 1);
          if (props.mode === "update") {
            props.onHide();
          }
        } else {
          throw new Error("Errore nell'inserimento del commento");
        }
      })
      .catch((error) => {
        alert("Errore nell'inserimento del commento:", error);
      });
  };
  return (
    <Container className="my-3">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control
            as="textarea"
            rows={3}
            value={commento}
            onChange={(e) => setCommento(e.target.value)}
            placeholder="Scrivi un commento"
          />
        </Form.Group>
        <Button type="submit" variant="success" className="mt-2 w-100">
          Commenta
        </Button>
      </Form>
    </Container>
  );
}

export default ScriviCommento;
