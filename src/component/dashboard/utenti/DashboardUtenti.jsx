import { Col, Container, Row } from "react-bootstrap";
import { ArrowRightSquare } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
function DashboardUtenti() {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <Container>
          <Row xs={1} lg={2} className="g-3">
            <Col>
              <Col className="dashboard-element d-flex">
                <Col>I tuoi corsi</Col>
                <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                  <ArrowRightSquare />
                </Col>
              </Col>
            </Col>
            <Col>
              <Col className="dashboard-element d-flex">
                <Col>I tuoi eventi</Col>
                <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                  <ArrowRightSquare onClick={() => navigate("/i-tuoi-eventi")} />
                </Col>
              </Col>
            </Col>
            <Col>
              <Col className="dashboard-element d-flex">
                <Col>Le tue prenotazioni in sala prove</Col>
                <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                  <ArrowRightSquare onClick={() => navigate("/tue-prenotazioni-sale")} />
                </Col>
              </Col>
            </Col>
            <Col>
              <Col className="dashboard-element d-flex">
                <Col>Cerca Eventi</Col>
                <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                  <ArrowRightSquare onClick={() => navigate("/cerca-eventi")} />
                </Col>
              </Col>
            </Col>
            <Col>
              <Col className="dashboard-element d-flex">
                <Col>Cerca Sale Prove</Col>
                <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                  <ArrowRightSquare onClick={() => navigate("/cerca-sale")} />
                </Col>
              </Col>
            </Col>
            <Col>
              <Col className="dashboard-element d-flex">
                <Col>Cerca Corsi</Col>
                <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                  <ArrowRightSquare onClick={() => navigate("/cerca-corsi")} />
                </Col>
              </Col>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
export default DashboardUtenti;
