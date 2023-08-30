import { useEffect, useState } from "react";
import axios from "axios";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces([
        ...response.data,
        ...response.data,
        ...response.data,
        ...response.data,
      ]);
    });
  }, []);

  return (
    <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-8">
      {places.length > 0 &&
        places.map((place) => (
          <div key={place._id}>
            <div className="bg-gray-500 rounded-xl">
              {place.photos?.[0] && (
                <img
                  src={`http://localhost:8000/uploads/${place.photos?.[0]}`}
                  alt=""
                  className="rounded-xl object-cover aspect-square"
                />
              )}
            </div>
            <h3 className="text-sm truncate mb-2 mt-4 leading-4">
              {place.title}
            </h3>
            <p className="font-bold">{place.address}</p>
          </div>
        ))}
    </div>
  );
};

export default IndexPage;
