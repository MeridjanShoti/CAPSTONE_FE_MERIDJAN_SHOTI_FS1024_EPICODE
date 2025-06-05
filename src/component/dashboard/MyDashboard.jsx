import { useSelector } from "react-redux";
import DashboardAdmin from "./admin/DashboardAdmin";
import DashboardInsegnanti from "./insegnanti/DashboardInsegnanti";
import DashboardScuola from "./scuole/DashboardScuola";
import DashboardUtenti from "./utenti/DashboardUtenti";
import DashboardOrganizzatore from "./eventi/DashboardOrganizzatore";
import userpic from "../../assets/img/utente.png";
import adminpic from "../../assets/img/admin.png";
import scuolapic from "../../assets/img/scuola.png";
import insegnantepic from "../../assets/img/insegnante.png";
import organizzatorepic from "../../assets/img/concerti.png";
import salapic from "../../assets/img/sala.png";
import genericpic from "../../assets/img/user-generico.png";
import DashboardGestore from "./sale/DashboardGestore";

function MyDashboard() {
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  let content = "";
  let userTypePicture = "";
  let ruolo = "";
  if (userType) {
    switch (true) {
      case userType.includes("ROLE_ADMIN"):
        content = <DashboardAdmin />;
        userTypePicture = adminpic;
        ruolo = "Admin";
        break;
      case userType.includes("ROLE_INSEGNANTE"):
        content = <DashboardInsegnanti />;
        userTypePicture = insegnantepic;
        ruolo = "Insegnante";
        break;
      case userType.includes("ROLE_SCUOLA"):
        content = <DashboardScuola />;
        userTypePicture = scuolapic;
        ruolo = "Scuola";
        break;
      case userType.includes("ROLE_USER"):
        content = <DashboardUtenti />;
        userTypePicture = userpic;
        ruolo = "Utente";
        break;
      case userType.includes("ROLE_ORGANIZZATORE"):
        content = <DashboardOrganizzatore />;
        userTypePicture = organizzatorepic;
        ruolo = "Eventi";
        break;
      case userType.includes("ROLE_GESTORE_SP"):
        content = <DashboardGestore />;
        userTypePicture = salapic;
        ruolo = "Gestore";

        break;
      default:
        content = <h1 className="text-center">User type not recognized</h1>;
        userTypePicture = genericpic;
        ruolo = "Sconosciuto";
    }
  }
  return (
    <div>
      <h1 className="text-center metal-mania-regular my-4">Dashboard {ruolo}</h1>
      {content}
    </div>
  );
}
export default MyDashboard;
