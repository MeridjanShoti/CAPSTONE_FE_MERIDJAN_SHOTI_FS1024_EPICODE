import { useSelector } from "react-redux";

function PrenotazioneDetail() {
  const user = useSelector((state) => state.user.user);
  return <div>prenotazioneDetail</div>;
}

export default PrenotazioneDetail;
