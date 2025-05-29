import { Col, Container, Row } from "react-bootstrap";
import { ArrowRightSquare } from "react-bootstrap-icons";
import { useNavigate } from "react-router";

function DashboardScuola() {
  const navigate = useNavigate();
  return (
    <div>
      <Container>
        <Row xs={1} lg={2} className="g-3">
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Inserisci un nuovo insegnante</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare onClick={() => navigate("/registra-insegnante")} />
              </Col>
            </Col>
          </Col>
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Gestisci Insegnanti</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare />
              </Col>
            </Col>
          </Col>
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Inserisci Corso</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare onClick={() => navigate("/registra-corso")} />
              </Col>
            </Col>
          </Col>
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Gestisci Corsi</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare />
              </Col>
            </Col>
          </Col>
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Guarda recensioni Scuola</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare />
              </Col>
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default DashboardScuola;
