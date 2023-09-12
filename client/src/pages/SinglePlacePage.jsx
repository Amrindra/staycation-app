import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidgets from "../components/BookingWidgets";
import PlaceGallery from "../components/PlaceGallery";
import AddressLink from "../components/AddressLink";
import PuffLoader from "react-spinners/ClipLoader";

const SinglePlacePage = () => {
  const { id } = useParams();
  const [places, setPlaces] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlaces(response.data);
    });
  }, [id]);

  if (!places) {
    return <PuffLoader color="#5C5470" />;
  }

  return (
    <div className="mt-8 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-2xl">{places.title}</h1>
      <AddressLink>{places.address}</AddressLink>

      {/* Photos section */}
      <PlaceGallery places={places} />

      {/* Start of Description sectoin */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-6 mt-8 mb-8">
        <div>
          <BookingWidgets places={places} />
        </div>

        <div className="flex flex-col">
          <div className="">
            <h2 className="font-semibold text-2xl">Description</h2>
            <p className="mb-6">{places.description}</p>
          </div>
          <span> Check-In: {places.checkIn}:00 PM</span>
          <span> Check-Out: {places.checkOut}:00 AM</span>
          <span>Max number of guests: {places.maxGuests}</span>
        </div>
      </div>
      {/* End of Description sectiom */}

      {/* Extra info section */}
      <div className="bg-white px-8 -mx-8 py-8 border border-t">
        <h3 className="font-semibold text-2xl">Extra Info</h3>
        <div className="text-sm text-gray-600 leading-4 mb-4 mt-2">
          {places.extraInfo}
        </div>
      </div>
      {/* End of extra info section */}
    </div>
  );
};

export default SinglePlacePage;
