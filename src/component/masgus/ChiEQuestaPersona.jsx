import { Button, Container } from "react-bootstrap";
import { Link } from "react-router";

function ChiEQuestaPersona() {
  return (
    <div>
      <Container className="d-flex flex-column justify-content-center align-items-center">
        <h1 className="text-center metal-mania-regular">Non dovevi entrare qui</h1>
        <div className="ratio ratio-16x9 w-100">
          <iframe
            src="https://www.youtube.com/embed/JNX2nOYuWuo?si=UlSpxU29QwjLlUAb"
            title="Studio Richard"
            style={{ border: "none" }}
          ></iframe>
        </div>
        <Button as={Link} to="/" className="mt-3" variant="primary">
          Torna alla Home
        </Button>
      </Container>
    </div>
  );
}
export default ChiEQuestaPersona;
