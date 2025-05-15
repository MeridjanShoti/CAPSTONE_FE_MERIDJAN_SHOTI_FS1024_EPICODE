import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.scss";
import MyNavbar from "./component/navbar/MyNavbar";
import MyLogin from "./component/login/MyLogin";
import MyRegister from "./component/login/MyRegister";
import DashboardUtenti from "./component/dashboard/utenti/DashboardUtenti";

function App() {
  return (
    <>
      <BrowserRouter>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/login" element={<MyLogin />} />
          <Route path="/register" element={<MyRegister />} />
          <Route path="/test" element={<DashboardUtenti />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
