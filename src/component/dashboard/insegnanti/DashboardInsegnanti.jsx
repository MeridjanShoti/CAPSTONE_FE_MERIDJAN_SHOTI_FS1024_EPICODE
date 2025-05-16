import { Col, Container, Row } from "react-bootstrap";
import { ArrowRightSquare } from "react-bootstrap-icons";

function DashboardInsegnanti() {
  return (
    <div>
      <h1 className="text-center metal-mania-regular my-4">Dashboard Insegnante</h1>
      <Container>
        <Row xs={1} lg={2} className="g-3">
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Gestisci corsi</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare />
              </Col>
            </Col>
          </Col>
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Gestisci Studenti</Col>
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
export default DashboardInsegnanti;
