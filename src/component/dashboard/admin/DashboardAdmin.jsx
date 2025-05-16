function DashboardAdmin() {
  const apiUrl = import.meta.env.VITE_API_URL;
  return (
    <div>
      <h1 className="text-center metal-mania-regular my-4">Dashboard Admin</h1>
      <Container>
        <Row xs={1} lg={2} className="g-3">
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Inserisci un nuovo Admin</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare />
              </Col>
            </Col>
          </Col>
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Gestisci Segnalazioni su Utenti</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare />
              </Col>
            </Col>
          </Col>
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Gestisci Segnalazioni su Commenti</Col>
              <Col xs={2} sm={1} className="bg-primary text-center p-2 m-0">
                <ArrowRightSquare />
              </Col>
            </Col>
          </Col>
          <Col>
            <Col className="dashboard-element d-flex">
              <Col>Gestisci Segnalazioni su recensioni</Col>
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
export default DashboardAdmin;
