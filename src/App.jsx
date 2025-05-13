import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.scss";
import MyNavbar from "./component/navbar/MyNavbar";
import MyLogin from "./component/login/MyLogin";

function App() {
  return (
    <>
      <BrowserRouter>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/login" element={<MyLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
