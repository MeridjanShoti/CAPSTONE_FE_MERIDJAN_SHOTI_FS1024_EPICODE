import { useSelector } from "react-redux";
import RegistraInsegnante from "../dashboard/scuole/RegistrazioneInsegnante.jsx/RegistraInsegnante";
import ScuolaForm from "../login/ScuolaForm";
import UserForm from "../login/UserForm";
import OrganizzatoreConcertiForm from "../login/OrganizzatoreConcertiForm";
import GestoreSalaForm from "../login/GestoreSalaForm";
import { Container, Spinner } from "react-bootstrap";

function EditProfile() {
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  let componente;
  if (!userType) {
    return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />;
  }
  switch (true) {
    case userType.includes("ROLE_ADMIN"):
      componente = <h1 className="text-center">Admin</h1>;
      break;
    case userType.includes("ROLE_INSEGNANTE"):
      componente = <RegistraInsegnante />;
      break;
    case userType.includes("ROLE_SCUOLA"):
      componente = <ScuolaForm />;
      break;
    case userType.includes("ROLE_USER"):
      componente = <UserForm />;
      break;
    case userType.includes("ROLE_ORGANIZZATORE"):
      componente = <OrganizzatoreConcertiForm />;
      break;
    case userType.includes("ROLE_GESTORE_SP"):
      componente = <GestoreSalaForm />;
      break;
    default:
      componente = <h1 className="text-center">User type not recognized</h1>;
  }

  return <Container>{componente}</Container>;
}

export default EditProfile;
