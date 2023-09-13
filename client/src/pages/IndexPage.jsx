import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../components/Image";
import PuffLoader from "react-spinners/ClipLoader";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces([...response.data]);
    });
  }, []);

  return (
    <>
      <div className="grid gap-x-6 gap-y-8 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-8 ">
        {places.length > 0 &&
          places.map((place) => (
            <article
              key={place._id}
              className="border-2 border-[#5C5470] rounded-xl"
            >
              <Link to={`/place/${place._id}`}>
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

                  <div className="mt-2 flex justify-between">
                    <p>
                      <span className="font-bold">${place.price} </span>/ Night
                    </p>
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>4.5</span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
      </div>

      {!places.length > 0 && (
        <div className="flex flex-col justify-center items-center mt-72">
          <PuffLoader color="#36d7b7" size={60} />
          <p>Loading data...</p>
        </div>
      )}
    </>
  );
};

export default IndexPage;
