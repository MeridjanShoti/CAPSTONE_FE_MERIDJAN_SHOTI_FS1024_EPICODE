import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import RecensioneScuolaSingola from "./RecensioneScuolaSingola";
import ScriviRecensioneScuola from "./ScriviRecensioneScuola";
function RecensioniScuola(props) {
  const [recensioni, setRecensioni] = useState([]);
  const [recensioniMostrate, setRecensioniMostrate] = useState(5);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const [update, setUpdate] = useState(0);
  const [recensioniTotali, setRecensioniTotali] = useState(0);
  const [media, setMedia] = useState(null);
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  useEffect(() => {
    fetch(
      apiUrl +
        "/recensioni-scuola/scuole/" +
        props.id +
        "?page=0&size=" +
        recensioniMostrate +
        "&sort=createdAt&sortDir=desc",
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
          throw new Error("Errore nel recupero delle recensioni");
        }
      })
      .then((data) => {
        setRecensioni(data.content);
        setRecensioniTotali(data.totalElements);
        fetch(apiUrl + "/recensioni-scuola/media/" + props.id, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setMedia(data.media);
          })
          .catch((error) => {
            console.error(error.message);
          });
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [recensioniMostrate, props.id, token, apiUrl, update]);

  return (
    <>
      <Container fluid className="d-flex flex-column border border-2 rounded border-secondary bg-primary p-2 my-3">
        <div className="text-center my-3 p-2 bg-secondary text-white rounded-3 border border-2 border-light">
          <h3 className="metal-mania-regular">Recensioni</h3>
          {media && <p>Media recensioni: {media.toFixed(2)}/5</p>}
        </div>
        {recensioni.map((recensione) => {
          return <RecensioneScuolaSingola key={recensione.id} recensione={recensione} setUpdate={setUpdate} />;
        })}
        {userType && userType.includes("ROLE_USER") && (
          <ScriviRecensioneScuola id={props.id} setUpdate={setUpdate} mode="new" />
        )}
        <div className="d-flex justify-content-center gap-2">
          {recensioniTotali > recensioniMostrate && (
            <Button
              variant="secondary"
              onClick={() => {
                if (recensioniMostrate < recensioniTotali) setRecensioniMostrate(recensioniMostrate + 5);
              }}
            >
              Mostra di più
            </Button>
          )}
          {recensioniMostrate > 5 && (
            <Button
              variant="secondary"
              onClick={() => {
                if (recensioniMostrate > 5) setRecensioniMostrate(recensioniMostrate - 5);
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
export default RecensioniScuola;
