import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../components/AddressLink";
import PlaceGallery from "../components/PlaceGallery";
import BookingDate from "../components/BookingDate";

const SingleBookingPage = () => {
  const [booking, setBooking] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        // To get only a booking when _id === id because the response will return all of the booking, but in this component I need only one booking
        const onlyOneBooking = response.data.find(({ _id }) => _id === id);
        if (onlyOneBooking) {
          setBooking(onlyOneBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDate booking={booking} />
        </div>
        <div className="p-6rounded-2xl">
          <div>Total price:</div>
          <div className="text-xl">${booking.price}</div>
        </div>
      </div>
      <PlaceGallery places={booking.place} />
    </div>
  );
};

export default SingleBookingPage;
