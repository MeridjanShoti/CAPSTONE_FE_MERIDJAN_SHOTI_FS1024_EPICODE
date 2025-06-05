import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import CommentoSingolo from "./CommentoSingolo";
import ScriviCommento from "./ScriviCommento";

function Commenti(props) {
  const [commenti, setCommenti] = useState([]);
  const [commentiMostrati, setCommentiMostrati] = useState(5);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const [update, setUpdate] = useState(0);
  const [commentiTotali, setCommentiTotali] = useState(0);
  useEffect(() => {
    fetch(
      apiUrl + "/commenti/eventi/" + props.id + "?page=0&size=" + commentiMostrati + "&sort=createdAt&sortDir=desc",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore nel recupero dei commenti");
        }
      })
      .then((data) => {
        setCommenti(data.content);
        setCommentiTotali(data.totalElements);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [commentiMostrati, props.id, token, apiUrl, update]);

  return (
    <>
      <Container fluid className="d-flex flex-column border border-2 rounded border-secondary bg-primary p-2 my-3">
        <h3 className="text-center my-3 p-2 bg-secondary metal-mania-regular text-white rounded-3 border border-2 border-light">
          Commenti:
        </h3>
        {commenti.map((commento) => {
          return <CommentoSingolo key={commento.id} commento={commento} setUpdate={setUpdate} />;
        })}
        <ScriviCommento id={props.id} setUpdate={setUpdate} mode="new" />
        <div className="d-flex justify-content-center gap-2">
          {commentiTotali > commentiMostrati && (
            <Button
              variant="secondary"
              onClick={() => {
                if (commentiMostrati < commentiTotali) setCommentiMostrati(commentiMostrati + 5);
              }}
            >
              Mostra di più
            </Button>
          )}
          {commentiMostrati > 5 && (
            <Button
              variant="secondary"
              onClick={() => {
                if (commentiMostrati > 5) setCommentiMostrati(commentiMostrati - 5);
              }}
            >
              Mostra di meno
            </Button>
          )}
        </div>
      </Container>
    </>
  );
}

export default Commenti;
