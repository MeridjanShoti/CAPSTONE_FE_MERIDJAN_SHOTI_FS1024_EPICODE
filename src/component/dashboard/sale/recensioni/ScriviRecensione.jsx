import { useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";
function ScriviRecensione(props) {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [recensione, setRecensione] = useState({
    testo: "",
    voto: 0,
  });
  const [hover, setHover] = useState(0);

  const handleClick = (val) => {
    setRecensione({ ...recensione, voto: val });
  };
  useEffect(() => {
    if (props.recensione) {
      setRecensione({
        testo: props.recensione.testo || "",
        voto: props.recensione.voto || "",
      });
    }
  }, [props.recensione]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const handleSubmit = (e) => {
    e.preventDefault();

    if (recensione.voto && recensione.voto !== "" && recensione.voto > 0 && recensione.voto < 6) {
      fetch(
        props.mode === "new"
          ? apiUrl + "/recensioni-sala/" + props.id
          : apiUrl + "/recensioni-sala/" + props.recensione.id,
        {
          method: props.mode === "new" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            testo: recensione.testo,
            voto: recensione.voto,
          }),
        }
      )
        .then((res) => {
          if (res.ok) {
            console.log("recensione inserita con successo");
            setRecensione({ testo: "", voto: "" });
            props.setUpdate((prev) => prev + 1);
            if (props.mode === "update") {
              props.onHide();
            }
          } else {
            throw new Error(
              "Errore nell'invio della recensione. Se l'hai già inviata, non puoi mandarne altre, ma modificare quella già inviata."
            );
          }
        })
        .catch((error) => {
          setAlertMessage(error.message);
          setAlertType("danger");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
        });
    }
  };
  return (
    <Container className="my-3">
      <Form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center align-items-center gap-2 mb-3 border border-2 rounded p-2 bg-secondary">
          {[1, 2, 3, 4, 5].map((val) => (
            <span
              key={val}
              onClick={() => handleClick(val)}
              onMouseEnter={() => setHover(val)}
              onMouseLeave={() => setHover(0)}
              style={{ cursor: "pointer" }}
            >
              {val <= (hover || recensione.voto) ? <StarFill color="gold" /> : <Star color="gray" />}
            </span>
          ))}
        </div>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control
            as="textarea"
            rows={3}
            value={recensione.testo}
            onChange={(e) => setRecensione({ ...recensione, testo: e.target.value })}
            placeholder="Scrivi una recensione"
          />
        </Form.Group>
        <Alert show={showAlert} variant={alertType}>
          {alertMessage}
        </Alert>
        <Button
          type="submit"
          variant="success"
          className="mt-2 w-100"
          disabled={!recensione.voto || recensione.voto === "" || recensione.voto < 1 || recensione.voto > 5}
        >
          Invia
        </Button>
      </Form>
    </Container>
  );
}
export default ScriviRecensione;
