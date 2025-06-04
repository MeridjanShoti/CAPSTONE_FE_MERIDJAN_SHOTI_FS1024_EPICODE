import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import utenteNormale from "../../../../assets/img/utente.png";
import utenteAdmin from "../../../../assets/img/admin.png";
import utenteScuola from "../../../../assets/img/scuola.png";
import utenteInsegnante from "../../../../assets/img/insegnante.png";
import utenteOrganizzatore from "../../../../assets/img/concerti.png";
import utenteGestore from "../../../../assets/img/sala.png";
import utenteSconosciuto from "../../../../assets/img/user-generico.png";
import { Col, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Flag, Pencil, Star, StarFill, Trash } from "react-bootstrap-icons";
import UpdateRecensioneModal from "./updateRecensioneModal";
import SegnalazioneModal from "../../../segnalazioni/SegnalazioneModal";
function RecensioneSingola(props) {
  const { id } = useParams();
  const [recensione, setRecensione] = useState(props?.recensione || null);
  const [showSegnalazione, setShowSegnalazione] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const autoreType = recensione?.autore?.roles || recensione?.autore?.appUser?.roles;
  const user = useSelector((state) => state.user.user);
  const [modalShow, setModalShow] = useState(false);
  useEffect(() => {
    if (!props.recensione) {
      fetch(apiUrl + "/recensioni-sala/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Errore nel recupero della recensione");
          }
        })
        .then((data) => {
          setRecensione(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [props, id, apiUrl, token]);
  useEffect(() => {
    setRecensione(props.recensione);
  }, [props.recensione]);
  const handleDelete = () => {
    fetch(apiUrl + "/recensioni-sala/" + recensione.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          props.setUpdate((prev) => prev + 1);
        } else {
          throw new Error("Errore nell'eliminazione della recensione");
        }
      })
      .catch((error) => {
        alert("Errore nell'eliminazione della recensione:", error);
      });
  };

  return (
    <>
      {recensione && autoreType ? (
        <Row className="my-1">
          <Col xs={1} className="d-flex justify-content-center align-items-center">
            <img
              src={
                autoreType.includes("ROLE_USER")
                  ? utenteNormale
                  : autoreType.includes("ROLE_ADMIN")
                  ? utenteAdmin
                  : autoreType.includes("ROLE_SCUOLA")
                  ? utenteScuola
                  : autoreType.includes("ROLE_INSEGNANTE")
                  ? utenteInsegnante
                  : autoreType.includes("ROLE_ORGANIZZATORE")
                  ? utenteOrganizzatore
                  : autoreType.includes("ROLE_GESTORE_SP")
                  ? utenteGestore
                  : utenteSconosciuto
              }
              alt={recensione.autore.username}
              height={"40px"}
            />
          </Col>
          <Col className="d-flex flex-column recensione-singola border border-secondary border-2 rounded-3 bg-light">
            <div>
              {[1, 2, 3, 4, 5].map((val) => (
                <span key={val}>{val <= recensione.voto ? <StarFill /> : <Star />}</span>
              ))}
            </div>
            <Link
              to={
                autoreType.includes("ROLE_ADMIN")
                  ? "#"
                  : `/profile/${
                      autoreType.includes("ROLE_USER")
                        ? "utenti"
                        : autoreType.includes("ROLE_SCUOLA")
                        ? "scuole"
                        : autoreType.includes("ROLE_INSEGNANTE")
                        ? "insegnanti"
                        : autoreType.includes("ROLE_ORGANIZZATORE")
                        ? "organizzatori"
                        : autoreType.includes("ROLE_GESTORE_SP")
                        ? "gestori"
                        : "#"
                    }/${recensione.autore.id}`
              }
              className="text-decoration-none"
            >
              {recensione.autore.username}
            </Link>
            <p>{recensione.testo}</p>
          </Col>
          <Col xs={1} className="d-flex flex-column justify-content-around align-items-center ">
            {user?.id === recensione.autore.id ? (
              <>
                <div className="d-flex justify-content-center align-items-center bg-light rounded-3 border border-secondary border-2 p-1">
                  <Trash className="trash-icon" onClick={handleDelete} />
                </div>
                <div className="d-flex justify-content-center align-items-center bg-light rounded-3 border border-secondary border-2 p-1">
                  <Pencil className="pencil-icon" onClick={() => setModalShow(true)} />
                </div>
                <UpdateRecensioneModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  recensione={recensione}
                  setUpdate={props.setUpdate}
                  mode="update"
                />
              </>
            ) : (
              <div className="d-flex justify-content-center align-items-center bg-light rounded-3 border border-secondary border-2 p-1">
                <Flag className="flag-icon" onClick={() => setShowSegnalazione(true)} />
                <SegnalazioneModal
                  id={recensione.id}
                  onHide={() => setShowSegnalazione(false)}
                  show={showSegnalazione}
                  tipoSegnalazione="RECENSIONE_SALA"
                  titolo={recensione?.testo?.length > 20 ? recensione?.testo?.slice(0, 20) + "..." : recensione?.testo}
                />
              </div>
            )}
          </Col>
        </Row>
      ) : (
        <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />
      )}
    </>
  );
}
export default RecensioneSingola;
