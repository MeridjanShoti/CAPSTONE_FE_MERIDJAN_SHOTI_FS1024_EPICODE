import { Col, Container, Row } from "react-bootstrap";
import { ArrowRightSquare } from "react-bootstrap-icons";
import { useNavigate } from "react-router";

function DashboardAdmin() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  return (
    <div>
      <Container>
        <Row xs={1} lg={2} className="g-3">
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Inserisci un nuovo Admin</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare onClick={() => navigate("/register-admin")} />
              </Col>
            </Col>
          </Col>
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Gestisci Segnalazioni</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare onClick={() => navigate("/gestisci-segnalazioni")} />
              </Col>
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default DashboardAdmin;
