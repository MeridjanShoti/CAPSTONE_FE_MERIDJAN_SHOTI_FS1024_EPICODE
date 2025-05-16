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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
