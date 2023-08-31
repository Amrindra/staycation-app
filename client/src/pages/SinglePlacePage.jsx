import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SinglePlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhots] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) {
    return "Loading";
  }

  if (showAllPhotos) {
    return <div className="fixed bg-white min-w-full min-h-screen"></div>;
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

      {/* Photos section */}
      <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr]">
          <div>
            {place.photos?.[0] && (
              <img
                src={`http://localhost:8000/uploads/${place.photos[0]}`}
                alt=""
                className="object-cover aspect-square w-full"
              />
            )}
          </div>
          <div className="grid gap-2">
            {place.photos?.[0] && (
              <img
                src={`http://localhost:8000/uploads/${place.photos[1]}`}
                alt=""
                className="object-cover aspect-square w-full"
              />
            )}

            <div className="overflow-hidden">
              {place.photos?.[0] && (
                <img
                  src={`http://localhost:8000/uploads/${place.photos[2]}`}
                  alt=""
                  className="object-cover aspect-square w-full relative t-2"
                />
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAllPhots(true)}
          className="flex gap-1 absolute right-0 bottom-0 px-4 py-2 border border-black bg-white rounded-xl shadow-md shadow-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
          </svg>
          Show more
        </button>
      </div>
      {/* End of photos section */}
    </div>
  );
};

export default SinglePlacePage;
