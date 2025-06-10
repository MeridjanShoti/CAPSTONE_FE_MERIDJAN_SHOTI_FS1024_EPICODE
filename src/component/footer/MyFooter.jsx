import { Link } from "react-router";

function MyFooter() {
  return (
    <footer className="footer d-flex flex-column align-items-center bg-secondary text-white border-top border-primary border-3 mb-0 mt-auto pt-3">
      <p>
        &copy;{" "}
        <Link to="/contacts" className="text-decoration-none text-white">
          Meridjan Shoti 2025
        </Link>
      </p>
      <p>Classe Epicode FS1024</p>
    </footer>
  );
}

export default MyFooter;
