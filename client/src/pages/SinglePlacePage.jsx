import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SinglePlacePage = () => {
  const { id } = useParams();
  const [places, setPlaces] = useState(null);
  const [showAllPhotos, setShowAllPhots] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlaces(response.data);
    });
  }, [id]);

  if (!places) {
    return "Loading";
  }

  console.log(places);

  if (showAllPhotos) {
    return (
      <div className="absolute bg-white inset-0 min-h-screen">
        <div className="p-8 grid gap-4">
          <div>
            <h3 className="text-3xl">Photos of {places.title}</h3>
            <button
              onClick={() => setShowAllPhots(false)}
              className="fixed  flex gap-1 p-2 rounded-full bg-[#F5385D] text-white shadow shadow-black"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {places?.photos?.length > 0 &&
            places.photos.map((photo) => (
              <div key={photo._id} className="">
                <img
                  src={`http://localhost:8000/uploads/${photo}`}
                  alt=""
                  // className="w-full object-cover"
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gray-100 -mx-8 px-8 py-8">
      <h1 className="text-2xl">{places.title}</h1>
      <a
        target="_blank"
        rel="noreferrer"
        href={"https://maps.google.com/?q=" + places.address}
        className="flex gap-1 font-semibold underline my-3"
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
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>

        {places.address}
      </a>

      {/* Photos section */}
      <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-2xl overflow-hidden">
          <div>
            {places.photos?.[0] && (
              <img
                src={`http://localhost:8000/uploads/${places.photos[0]}`}
                alt=""
                className="object-cover aspect-square w-full"
              />
            )}
          </div>
          <div className="grid ">
            {places.photos?.[0] && (
              <img
                src={`http://localhost:8000/uploads/${places.photos[1]}`}
                alt=""
                className="object-cover aspect-square w-full"
              />
            )}

            <div className="overflow-hidden">
              {places.photos?.[0] && (
                <img
                  src={`http://localhost:8000/uploads/${places.photos[2]}`}
                  alt=""
                  className="object-cover aspect-square w-full relative top-4"
                />
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAllPhots(true)}
          className="flex gap-1 absolute right-0 bottom-0 px-4 py-2 border border-black bg-[#F5385D] text-white rounded-xl shadow-md shadow-black"
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

      {/* Start of Description sectoin */}
      <div className="my-4">
        <h2 className="font-semibold">Description</h2>
        {places.description}
      </div>
      <div className="grid grid-cols-2">
        <p>
          Check-In: {places.checkIn}
          Check-In: {places.checkOut}
          Max number of guests: {places.maxGuests}
        </p>
        <div>
          <div className="bg-gray-200 rounded-2xl p-4 shadow">
            <p className="text-2xl text-center">
              Price: ${places.price} / night
            </p>
            <div>
              <label>Check In: </label>
              <input type="date" />
            </div>
            <button className="primary">Book this place</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePlacePage;
