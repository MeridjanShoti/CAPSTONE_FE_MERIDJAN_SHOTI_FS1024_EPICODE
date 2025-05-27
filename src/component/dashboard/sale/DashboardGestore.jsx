import { Col, Container, Row } from "react-bootstrap";
import { ArrowRightSquare } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
function DashboardGestore() {
  const navigate = useNavigate();
  return (
    <div>
      <Container>
        <Row xs={1} lg={2} className="g-3">
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Inserisci una nuova sala prove</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare onClick={() => navigate("/inserisci-sala")} />
              </Col>
            </Col>
          </Col>
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Gestisci le tue Sale Prove</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare onClick={() => navigate("/gestisci-sale")} />
              </Col>
            </Col>
          </Col>
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Gestisci Le Prenotazioni</Col>
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
export default DashboardGestore;
