import { BrowserRouter, Route, Routes } from "react-router";
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
import CercaEventi from "./component/dashboard/utenti/eventi/CercaEventi";
import OrganizzatoreProfile from "./component/profile/eventi/OrganizzatoreProfile";
import GestisciSaleProva from "./component/dashboard/sale/gestisci/GestisciSaleProva";
import DettaglioSalaProve from "./component/dashboard/sale/dettaglio/DettaglioSalaProve";
import CreaSalaProve from "./component/dashboard/sale/crea/CreaSalaProve";
import CercaSaleProva from "./component/dashboard/utenti/sale/CercaSaleProva";
import PrenotaSala from "./component/dashboard/utenti/sale/PrenotaSala";
import TuePrenotazioniSala from "./component/dashboard/utenti/sale/TuePrenotazioniSala";
import PrenotazioneSalaDetail from "./component/dashboard/utenti/sale/PrenotazioneSalaDetail";
import SalaProfile from "./component/profile/sale/SalaProfile";
import ScuolaProfile from "./component/profile/scuole/ScuolaProfile";
import ModificaPrenotazioneSala from "./component/dashboard/sale/modificaprenotazioni/ModificaPrenotazioneSala";
import PrenotazioniGestore from "./component/dashboard/sale/prenotazioni/PrenotazioniGestore";
import RegistrazioneCorso from "./component/dashboard/scuole/RegistrazioneCorso.jsx/RegistrazioneCorso";
import CorsoDetail from "./component/dashboard/scuole/dettagliCorso/CorsoDetail";
import CercaCorsi from "./component/dashboard/utenti/corsi/CercaCorsi";
import GestisciCorsi from "./component/dashboard/scuole/gestisci/GestisciCorsi";
import InsegnanteProfile from "./component/profile/insegnanti/InsegnanteProfile";
import GestisciInsegnanti from "./component/dashboard/scuole/gestisci/GestisciInsegnanti";
import TuoiCorsi from "./component/dashboard/utenti/corsi/TuoiCorsi";
import GestisciStudenti from "./component/dashboard/insegnanti/gestiscistudenti/GestisciStudenti";
import GestisciSegnalazioni from "./component/dashboard/admin/gestiscisegnalazioni/GestisciSegnalazioni";
import MyFooter from "./component/footer/MyFooter";

function App() {
  return (
    <>
      <BrowserRouter>
        <div style={{ minHeight: "100vh" }} className="d-flex flex-column">
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
            <Route path="/cerca-eventi" element={<CercaEventi />} />
            <Route path="/organizzatori/:id" element={<OrganizzatoreProfile />} />
            <Route path="/gestori/:id" element={<SalaProfile />} />
            <Route path="/scuole/:id" element={<ScuolaProfile />} />
            <Route path="/profile/:tipoutente/:id" element={<Profile />} />
            <Route path="/gestisci-sale" element={<GestisciSaleProva />} />
            <Route path="/sale-prove/:id" element={<DettaglioSalaProve />} />
            <Route path="/edit-sala/:id" element={<CreaSalaProve />} />
            <Route path="/inserisci-sala" element={<CreaSalaProve />} />
            <Route path="/cerca-sale" element={<CercaSaleProva />} />
            <Route path="/prenota-sala/:id" element={<PrenotaSala />} />
            <Route path="/tue-prenotazioni-sale" element={<TuePrenotazioniSala />} />
            <Route path="/profile/:tipoutente" element={<Profile />} />
            <Route path="/prenotazioni-sale/:id" element={<PrenotazioneSalaDetail />} />
            <Route path="/modifica-prenotazione-sala/:idPrenotazione" element={<ModificaPrenotazioneSala />} />
            <Route path="/prenotazioni-gestore" element={<PrenotazioniGestore />} />
            <Route path="/gestisci-prenotazioni/:idSala" element={<PrenotazioniGestore />} />
            <Route path="/registra-corso" element={<RegistrazioneCorso />} />
            <Route path="/edit-corso/:id" element={<RegistrazioneCorso />} />
            <Route path="/corso/:id" element={<CorsoDetail />} />
            <Route path="/cerca-corsi" element={<CercaCorsi />} />
            <Route path="/gestisci-corsi" element={<GestisciCorsi />} />
            <Route path="/insegnanti/:id" element={<InsegnanteProfile />} />
            <Route path="/gestisci-insegnanti" element={<GestisciInsegnanti />} />
            <Route path="/tuoi-corsi" element={<TuoiCorsi />} />
            <Route path="/gestisci-studenti" element={<GestisciStudenti />} />
            <Route path="gestisci-segnalazioni" element={<GestisciSegnalazioni />} />
          </Routes>
          <MyFooter />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
