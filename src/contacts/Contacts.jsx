import { Col, Container, Row } from "react-bootstrap";
import { Image } from "react-bootstrap";
import image from "../assets/img/meridjan.png";
import { Envelope, Github, Linkedin } from "react-bootstrap-icons";

function Contacts() {
  return (
    <>
      <h1 className="text-center metal-mania-regular my-3">Meridjan Shoti</h1>
      <Container xs={1} md={2} className="d-flex justify-content-center gap-5">
        <div>
          <Image src={image} fluid className="rounded-5 border border-primary border-3" />
        </div>
        <div className="d-flex flex-column justify-content-center fs-3">
          <p>
            <Github /> <a href="https://github.com/MeridjanShoti">https://github.com/MeridjanShoti</a>
          </p>
          <p>
            <Envelope /> <a href="mailto:meridjanshoti@gmail.com">meridjanshoti@gmail.com</a>
          </p>
          <p>
            <Linkedin /> <a href="https://www.linkedin.com/in/meridjan">www.linkedin.com/in/meridjan</a>
          </p>
        </div>
      </Container>
    </>
  );
}
export default Contacts;
