import { useSelector } from "react-redux";
import AdminProfile from "./admin/AdminProfile";
import UtenteProfile from "./utenti/UtenteProfile";
import ScuolaProfile from "./scuole/ScuolaProfile";
import InsegnanteProfile from "./insegnanti/InsegnanteProfile";
import OrganizzatoreProfile from "./eventi/OrganizzatoreProfile";
import SalaProfile from "./sale/SalaProfile";

function Profile() {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token.token);
  const userType = user?.roles || user?.appUser?.roles;
  let profile;
  switch (true) {
    case userType.includes("ROLE_ADMIN"):
      profile = <AdminProfile />;
      break;
    case userType.includes("ROLE_INSEGNANTE"):
      profile = <InsegnanteProfile />;
      break;
    case userType.includes("ROLE_SCUOLA"):
      profile = <ScuolaProfile />;
      break;
    case userType.includes("ROLE_USER"):
      profile = <UtenteProfile />;
      break;
    case userType.includes("ROLE_ORGANIZZATORE"):
      profile = <OrganizzatoreProfile />;
      break;
    case userType.includes("ROLE_GESTORE_SP"):
      profile = <SalaProfile />;
      break;
    default:
      profile = <h1 className="text-center">User type not recognized</h1>;
  }

  return <h1 className="text-center"></h1>;
}
export default Profile;
