import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../components/Image";

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
    <article className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-5 mt-8 ">
      {places.length > 0 &&
        places.map((place) => (
          <Link
            to={`/place/${place._id}`}
            key={place._id}
            className="border-2 border-stone-300 rounded-xl"
          >
            <div className="bg-gray-500 rounded-xl ">
              {place.photos?.[0] && (
                <Image
                  src={place.photos?.[0]}
                  alt=""
                  className="rounded-t-xl object-cover aspect-square"
                />
                //   <img
                //   src={`http://localhost:8000/uploads/${place.photos?.[0]}`}
                //   alt=""
                //   className="rounded-t-xl object-cover aspect-square"
                // />
              )}
            </div>
            <div className="px-1 pb-1">
              <p className="font-bold">{place.address}</p>
              <h3 className="text-sm truncate mb-2 mt-4 leading-4 text-gray-500">
                {place.title}
              </h3>
              <p className="mt-2">
                <span className="font-bold">${place.price} </span>Per Night
              </p>
            </div>
          </Link>
        ))}
    </article>
  );
};

export default IndexPage;
