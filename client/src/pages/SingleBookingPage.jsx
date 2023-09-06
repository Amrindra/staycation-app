import { useParams } from "react-router-dom";

const SingleBookingPage = () => {
  const { id } = useParams();
  return <div>BookingPage {id}</div>;
};

export default SingleBookingPage;
