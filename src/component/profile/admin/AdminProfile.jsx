import { Container } from "react-bootstrap";
import adminPic from "../../../assets/img/admin.png";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";
function AdminProfile() {
  const user = useSelector((state) => state.user.user);
  const userType = user?.roles || user?.appUser?.roles;
  const navigate = useNavigate();
  useEffect(() => {
    if (userType && !userType.includes("ROLE_ADMIN")) {
      navigate(-1);
    }
  }, [userType]);
  return (
    <>
      {user && userType.includes("ROLE_ADMIN") && (
        <Container className="d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-center metal-mania-regular my-4">Admin</h1>
          <img src={adminPic} alt="Admin" className="profile-pic mx-auto" />
          <p>Benvenuto, {user.username}.</p>
          <p>Il tuo compito è quello di mantenere l'ordine.</p>
        </Container>
      )}
    </>
  );
}
export default AdminProfile;
