import { useParams } from "react-router-dom";

const SinglePlacePage = () => {
  const { id } = useParams();
  return <div>SinglePlacePage{id}</div>;
};

export default SinglePlacePage;
