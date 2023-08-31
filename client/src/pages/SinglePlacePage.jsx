import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SinglePlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);
  console.log(place);
  if (!place) {
    return "Loading";
  }

  return (
    <div className="mt-8 bg-gray-100 -mx-8 px-8 py-8">
      <h1 className="text-2xl">{place.title}</h1>
      <a
        target="_blank"
        rel="noreferrer"
        href={"https://maps.google.com/?q=" + place.address}
        className="block font-semibold underline my-2"
      >
        {place.address}
      </a>
      <div className="grid gap-2 grid-cols-[2fr_1fr]">
        <div>
          {place.photos?.[0] && (
            <img
              src={`http://localhost:8000/uploads/${place.photos[0]}`}
              alt=""
            />
          )}
        </div>
        <div>
          {place.photos?.[0] && (
            <img
              src={`http://localhost:8000/uploads/${place.photos[1]}`}
              alt=""
            />
          )}
          {place.photos?.[0] && (
            <img
              src={`http://localhost:8000/uploads/${place.photos[2]}`}
              alt=""
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePlacePage;
