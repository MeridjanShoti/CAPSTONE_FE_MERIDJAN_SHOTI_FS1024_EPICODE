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
import { Flag, Pencil, Trash } from "react-bootstrap-icons";
import UpdateCommentModal from "./UpdateCommentModal";

function CommentoSingolo(props) {
  const { id } = useParams();
  const [comment, setComment] = useState(props?.commento || null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const autoreType = comment?.autore.roles;
  const user = useSelector((state) => state.user.user);
  const [modalShow, setModalShow] = useState(false);
  useEffect(() => {
    if (!props.commento) {
      fetch(apiUrl + "/commenti/" + id, {
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
            throw new Error("Errore nel recupero del commento");
          }
        })
        .then((data) => {
          setComment(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [props, id, apiUrl, token]);
  useEffect(() => {
    setComment(props.commento);
  }, [props.commento]);
  const handleDelete = () => {
    fetch(apiUrl + "/commenti/" + comment.id, {
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
          throw new Error("Errore nell'eliminazione del commento");
        }
      })
      .catch((error) => {
        alert("Errore nell'eliminazione del commento:", error);
      });
  };
  const handleFlag = () => {
    console.log("flag");
  };
  return (
    <>
      {comment && autoreType ? (
        <Row className="my-1">
          <Col xs={1} className="d-flex justify-content-center align-items-center">
            <img
              src={
                comment.autore.roles.includes("ROLE_USER")
                  ? utenteNormale
                  : comment.autore.roles.includes("ROLE_ADMIN")
                  ? utenteAdmin
                  : comment.autore.roles.includes("ROLE_SCUOLA")
                  ? utenteScuola
                  : comment.autore.roles.includes("ROLE_INSEGNANTE")
                  ? utenteInsegnante
                  : comment.autore.roles.includes("ROLE_ORGANIZZATORE")
                  ? utenteOrganizzatore
                  : comment.autore.roles.includes("ROLE_GESTORE_SP")
                  ? utenteGestore
                  : utenteSconosciuto
              }
              alt={comment.autore.username}
              height={"40px"}
            />
          </Col>
          <Col className="commento-singolo border border-secondary border-2 rounded-3 bg-light">
            <Link to={`/profilo/${comment.autore.id}`} className="text-decoration-none">
              {comment.autore.username}
            </Link>
            <p>{comment.testo}</p>
          </Col>
          <Col xs={1} className="d-flex flex-column justify-content-around align-items-center ">
            {user?.id === comment.autore.id ? (
              <>
                <div className="d-flex justify-content-center align-items-center bg-light rounded-3 border border-secondary border-2 p-1">
                  <Trash className="trash-icon" onClick={handleDelete} />
                </div>
                <div className="d-flex justify-content-center align-items-center bg-light rounded-3 border border-secondary border-2 p-1">
                  <Pencil className="pencil-icon" onClick={() => setModalShow(true)} />
                </div>
                <UpdateCommentModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  commento={comment}
                  setUpdate={props.setUpdate}
                  mode="update"
                />
              </>
            ) : (
              <div className="d-flex justify-content-center align-items-center bg-light rounded-3 border border-secondary border-2 p-1">
                <Flag className="flag-icon" onClick={handleFlag} />
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

export default CommentoSingolo;
