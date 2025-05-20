import { Container } from "react-bootstrap";
import adminPic from "../../../assets/img/admin.png";
import { useSelector } from "react-redux";
function AdminProfile() {
  const user = useSelector((state) => state.user.user);
  return (
    <>
      {user && (
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
