import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.scss";
import MyNavbar from "./component/navbar/MyNavbar";
import MyLogin from "./component/login/MyLogin";
import MyRegister from "./component/login/MyRegister";
import DashboardGestore from "./component/dashboard/sale/DashboardGestore";
import ChiEQuestaPersona from "./component/masgus/ChiEQuestaPersona";
import MyHome from "./component/home/MyHome";
import MyDashboard from "./component/dashboard/MyDashboard";
import RegistraInsegnante from "./component/dashboard/scuole/RegistrazioneInsegnante.jsx/RegistraInsegnante";
import Profile from "./component/profile/Profile";
import EditProfile from "./component/profile/EditProfile";
import AdminForm from "./component/login/AdminForm";
import FormEvento from "./component/dashboard/eventi/crea/FormEvento";
import GestisciEventi from "./component/dashboard/eventi/gestisci/GestisciEventi";
import EventoDetail from "./component/dashboard/eventi/dettaglio/EventoDetail";
import TuoiEventi from "./component/dashboard/utenti/eventi/TuoiEventi";
import PrenotazioneDetail from "./component/dashboard/utenti/eventi/PrenotazioneDetail";

function App() {
  return (
    <>
      <BrowserRouter>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<MyHome />} />
          <Route path="/login" element={<MyLogin />} />
          <Route path="/register" element={<MyRegister />} />
          <Route path="/dashboard" element={<MyDashboard />} />
          <Route path="/test" element={<DashboardGestore />} />
          <Route path="*" element={<ChiEQuestaPersona />} />
          <Route path="/registra-insegnante" element={<RegistraInsegnante />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile/:id" element={<EditProfile />} />
          <Route path="/register-admin" element={<AdminForm />} />
          <Route path="/registra-evento" element={<FormEvento />} />
          <Route path="/edit-evento/:id" element={<FormEvento />} />
          <Route path="/gestisci-eventi" element={<GestisciEventi />} />
          <Route path="/eventi/:id" element={<EventoDetail />} />
          <Route path="/utenti/:id" element={<Profile />} />
          <Route path="/i-tuoi-eventi" element={<TuoiEventi />} />
          <Route path="/prenotazioni-eventi/:id" element={<PrenotazioneDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
