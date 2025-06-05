import { Col, Container, Row } from "react-bootstrap";
import { ArrowRightSquare } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
function DashboardOrganizzatore() {
  const navigate = useNavigate();
  return (
    <div>
      <Container>
        <Row xs={1} lg={2} className="g-3">
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Inserisci un nuovo Evento</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare onClick={() => navigate("/registra-evento")} />
              </Col>
            </Col>
          </Col>
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Gestisci Eventi</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare onClick={() => navigate("/gestisci-eventi")} />
              </Col>
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default DashboardOrganizzatore;
