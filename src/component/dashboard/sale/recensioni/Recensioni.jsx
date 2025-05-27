import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import RecensioneSingola from "./RecensioneSingola";
import ScriviRecensione from "./ScriviRecensione";
import { useSelector } from "react-redux";
function Recensioni(props) {
  const [recensioni, setRecensioni] = useState([]);
  const [recensioniMostrate, setRecensioniMostrate] = useState(5);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const [update, setUpdate] = useState(0);
  const [recensioniTotali, setRecensioniTotali] = useState(0);
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  useEffect(() => {
    fetch(
      apiUrl +
        "/recensioni-sala/sale/" +
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
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [recensioniMostrate, props.id, token, apiUrl, update]);

  return (
    <>
      <Container fluid className="d-flex flex-column border border-2 rounded border-secondary bg-primary p-2 my-3">
        <h3 className="text-center my-3 p-2 bg-secondary metal-mania-regular text-white rounded-3 border border-2 border-light">
          Recensioni:
        </h3>
        {recensioni.map((recensione) => {
          return <RecensioneSingola key={recensione.id} recensione={recensione} setUpdate={setUpdate} />;
        })}
        {userType && userType.includes("ROLE_USER") && (
          <ScriviRecensione id={props.id} setUpdate={setUpdate} mode="new" />
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
export default Recensioni;
